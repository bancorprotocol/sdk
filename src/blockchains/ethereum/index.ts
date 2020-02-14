import Web3 from 'web3';

import { ContractRegistry } from './contracts/ContractRegistry';
import { BancorConverter } from './contracts/BancorConverter';
import { BancorConverterV9 } from './contracts/BancorConverterV9';
import { BancorConverterRegistry } from './contracts/BancorConverterRegistry';
import { ERC20Token } from './contracts/ERC20Token';
import { SmartToken } from './contracts/SmartToken';

import * as utils from './utils';
import * as retrieve_converter_version from './retrieve_converter_version';
import * as fetch_conversion_events from './fetch_conversion_events';

let web3;
let converterRegistryContract;

export const anchorToken = '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C';

export async function init(nodeAddress, contractRegistryAddress) {
    web3 = new Web3(new Web3.providers.HttpProvider(nodeAddress));
    const contractRegistryContract = new web3.eth.Contract(ContractRegistry, contractRegistryAddress);
    const converterRegistryAddress = await contractRegistryContract.methods.addressOf(Web3.utils.asciiToHex('BancorConverterRegistry')).call();
    converterRegistryContract = new web3.eth.Contract(BancorConverterRegistry, converterRegistryAddress);
}

export async function getConversionRate(smartToken, fromToken, toToken, amount) {
    const inputAmount = await toWei(fromToken, amount);
    try {
        const outputAmount = await getReturn(smartToken, BancorConverter, fromToken, toToken, inputAmount);
        return await fromWei(toToken, outputAmount['0']);
    }
    catch (error) {
        if (!error.message.includes('insufficient data for uint256'))
            throw error;
        const outputAmount = await getReturn(smartToken, BancorConverterV9, fromToken, toToken, inputAmount);
        return await fromWei(toToken, outputAmount);
    }
}

export async function retrieveConverterVersion(converter) {
    return await retrieve_converter_version.run(web3, converter);
}

export async function fetchConversionEvents(token, fromBlock, toBlock) {
    return await fetch_conversion_events.run(web3, token, fromBlock, toBlock);
}

export async function fetchConversionEventsByTimestamp(token, fromTimestamp, toTimestamp) {
    const fromBlock = await utils.timestampToBlockNumber(web3, fromTimestamp);
    const toBlock = await utils.timestampToBlockNumber(web3, toTimestamp);
    return await fetch_conversion_events.run(web3, token, fromBlock, toBlock);
}

export async function getAllPaths(sourceToken, targetToken) {
    const paths = [];
    const graph = await getGraph();
    getAllPathsRecursive(paths, graph, [sourceToken], targetToken);
    return paths;
}

export const toWei = async function(token, amount) {
    const tokenContract = new web3.eth.Contract(ERC20Token, token);
    const decimals = await tokenContract.methods.decimals().call();
    return utils.toWei(amount, decimals);
};

export const fromWei = async function(token, amount) {
    const tokenContract = new web3.eth.Contract(ERC20Token, token);
    const decimals = await tokenContract.methods.decimals().call();
    return utils.fromWei(amount, decimals);
};

export const getReturn = async function(smartToken, converterABI, fromToken, toToken, amount) {
    const tokenContract = new web3.eth.Contract(SmartToken, smartToken);
    const converter = await tokenContract.methods.owner().call();
    const converterContract = new web3.eth.Contract(converterABI, converter);
    return await converterContract.methods.getReturn(fromToken, toToken, amount).call();
};

export const getGraph = async function() {
    const graph = {};

    const MULTICALL_ABI = [{"constant":false,"inputs":[{"components":[{"internalType":"address","name":"target","type":"address"},{"internalType":"bytes","name":"callData","type":"bytes"}],"internalType":"struct Multicall.Call[]","name":"calls","type":"tuple[]"},{"internalType":"bool","name":"strict","type":"bool"}],"name":"aggregate","outputs":[{"internalType":"uint256","name":"blockNumber","type":"uint256"},{"components":[{"internalType":"bool","name":"success","type":"bool"},{"internalType":"bytes","name":"data","type":"bytes"}],"internalType":"struct Multicall.Return[]","name":"returnData","type":"tuple[]"}],"payable":false,"stateMutability":"nonpayable","type":"function"}];
    const MULTICALL_ADDRESS = '0x5Eb3fa2DFECdDe21C950813C665E9364fa609bD2';
    const multicall = new web3.eth.Contract(MULTICALL_ABI, MULTICALL_ADDRESS);

    const convertibleTokens = await converterRegistryContract.methods.getConvertibleTokens().call();
    const calls = convertibleTokens.map(convertibleToken => [converterRegistryContract._address, converterRegistryContract.methods.getConvertibleTokenSmartTokens(convertibleToken).encodeABI()]);
    const [blockNumber, returnData] = await multicall.methods.aggregate(calls, true).call();

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
