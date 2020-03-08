import Web3 from 'web3';
import * as abis from './abis';
import * as utils from '../../utils';
import * as conversionEvents from './conversion_events';
import * as converterVersion from './converter_version';
import { Token, Converter } from '../../path_generation';
import { timestampToBlockNumber } from './timestamp_to_block_number';

const CONTRACT_ADDRESSES = {
    main: {
        registry: '0x52Ae12ABe5D8BD778BD5397F99cA900624CfADD4',
        multicall: '0x5Eb3fa2DFECdDe21C950813C665E9364fa609bD2',
        anchorToken: '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C',
    },
    ropsten: {
        registry: '0xFD95E724962fCfC269010A0c6700Aa09D5de3074',
        multicall: '0xf3ad7e31b052ff96566eedd218a823430e74b406',
        anchorToken: '0x62bd9D98d4E188e281D7B78e29334969bbE1053c',
    }
};

export class Ethereum {
    web3: Web3;
    networkType: string;
    bancorNetwork: Web3.eth.Contract;
    converterRegistry: Web3.eth.Contract;
    multicallContract: Web3.eth.Contract;
    decimals = {};

    static async create(nodeEndpoint: string): Promise<Ethereum> {
        const ethereum = new Ethereum();
        ethereum.web3 = getWeb3(nodeEndpoint);
        ethereum.networkType = await ethereum.web3.eth.net.getNetworkType();
        const contractRegistry = new ethereum.web3.eth.Contract(abis.ContractRegistry, getContractAddresses(ethereum).registry);
        const bancorNetworkAddress = await contractRegistry.methods.addressOf(Web3.utils.asciiToHex('BancorNetwork')).call();
        const converterRegistryAddress = await contractRegistry.methods.addressOf(Web3.utils.asciiToHex('BancorConverterRegistry')).call();
        ethereum.bancorNetwork = new ethereum.web3.eth.Contract(abis.BancorNetwork, bancorNetworkAddress);
        ethereum.converterRegistry = new ethereum.web3.eth.Contract(abis.BancorConverterRegistry, converterRegistryAddress);
        ethereum.multicallContract = new ethereum.web3.eth.Contract(abis.MulticallContract, getContractAddresses(ethereum).multicall);
        return ethereum;
    }

    static async destroy(ethereum: Ethereum): Promise<void> {
        if (ethereum.web3.currentProvider && ethereum.web3.currentProvider.constructor.name == 'WebsocketProvider')
            ethereum.web3.currentProvider.connection.close();
    }

    getAnchorToken(): string {
        return getContractAddresses(this).anchorToken;
    }

    async getRateByPath(path: Token[], amount: string): Promise<string> {
        const tokens = path.map(token => token.blockchainId);
        const sourceDecimals = await getDecimals(this, tokens[0]);
        const targetDecimals = await getDecimals(this, tokens[tokens.length - 1]);
        amount = utils.toWei(amount, sourceDecimals);
        amount = await getReturn(this, tokens, amount);
        amount = utils.fromWei(amount, targetDecimals);
        return amount;
    }

    async getAllPathsAndRates(sourceToken, targetToken, amount) {
        const paths = [];
        const graph = await getGraph(this);
        const tokens = [Web3.utils.toChecksumAddress(sourceToken)];
        const destToken = Web3.utils.toChecksumAddress(targetToken);
        getAllPathsRecursive(paths, graph, tokens, destToken);
        const sourceDecimals = await getDecimals(this, sourceToken);
        const targetDecimals = await getDecimals(this, targetToken);
        const rates = await getRates(this, paths, utils.toWei(amount, sourceDecimals));
        return [paths, rates.map(rate => utils.fromWei(rate, targetDecimals))];
    }

    async getConverterVersion(converter: Converter): Promise<string> {
        return (await converterVersion.get(this, converter.blockchainId)).value;
    }

    async getConversionEvents(token: Token, fromBlock: number, toBlock: number): Promise<object[]> {
        return await conversionEvents.get(this, token.blockchainId, fromBlock, toBlock);
    }

    async getConversionEventsByTimestamp(token: Token, fromTimestamp: number, toTimestamp: number): Promise<object[]> {
        const fromBlock = await timestampToBlockNumber(this, fromTimestamp);
        const toBlock = await timestampToBlockNumber(this, toTimestamp);
        return await conversionEvents.get(this, token.blockchainId, fromBlock, toBlock);
    }
}

export const getWeb3 = function(nodeEndpoint) {
    return new Web3(nodeEndpoint);
};

export const getContractAddresses = function(ethereum) {
    if (CONTRACT_ADDRESSES[ethereum.networkType])
        return CONTRACT_ADDRESSES[ethereum.networkType];
    throw new Error(ethereum.networkType + ' network not supported');
};

export const getReturn = async function(ethereum, path, amount) {
    return (await ethereum.bancorNetwork.methods.getReturnByPath(path, amount).call())['0'];
};

export const getDecimals = async function(ethereum, token) {
    if (ethereum.decimals[token] == undefined) {
        const tokenContract = new ethereum.web3.eth.Contract(abis.ERC20Token, token);
        ethereum.decimals[token] = await tokenContract.methods.decimals().call();
    }
    return ethereum.decimals[token];
};

export const getRates = async function(ethereum, paths, amount) {
    const calls = paths.map(path => [ethereum.bancorNetwork._address, ethereum.bancorNetwork.methods.getReturnByPath(path, amount).encodeABI()]);
    const [blockNumber, returnData] = await ethereum.multicallContract.methods.aggregate(calls, false).call();
    return returnData.map(item => item.success ? Web3.utils.toBN(item.data.substr(0, 66)).toString() : '0');
};

export const getGraph = async function(ethereum) {
    const graph = {};

    const convertibleTokens = await ethereum.converterRegistry.methods.getConvertibleTokens().call();
    const calls = convertibleTokens.map(convertibleToken => [ethereum.converterRegistry._address, ethereum.converterRegistry.methods.getConvertibleTokenSmartTokens(convertibleToken).encodeABI()]);
    const [blockNumber, returnData] = await ethereum.multicallContract.methods.aggregate(calls, true).call();

    for (let i = 0; i < returnData.length; i++) {
        for (const smartToken of Array.from(Array((returnData[i].data.length - 130) / 64).keys()).map(n => Web3.utils.toChecksumAddress(returnData[i].data.substr(64 * n + 154, 40)))) {
            if (convertibleTokens[i] != smartToken) {
                updateGraph(graph, convertibleTokens[i], smartToken);
                updateGraph(graph, smartToken, convertibleTokens[i]);
            }
        }
    }

    return graph;
};

function updateGraph(graph, key, value) {
    if (graph[key] == undefined)
        graph[key] = [value];
    else if (!graph[key].includes(value))
        graph[key].push(value);
}

function getAllPathsRecursive(paths, graph, tokens, destToken) {
    const prevToken = tokens[tokens.length - 1];
    if (prevToken == destToken)
        paths.push(tokens);
    else for (const nextToken of graph[prevToken].filter(token => !tokens.includes(token)))
        getAllPathsRecursive(paths, graph, [...tokens, nextToken], destToken);
}
