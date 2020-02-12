/* eslint-disable max-len */
/* eslint-disable no-sync */
/* eslint-disable prefer-reflect */
import Web3 from 'web3';
import { BancorConverterV9 } from './contracts/BancorConverterV9';
import { fromWei, toWei, timestampToBlockNumber } from './utils';
import { ConversionPathStep, Token } from '../../path_generation';
import { BancorConverter } from './contracts/BancorConverter';
import { ContractRegistry } from './contracts/ContractRegistry';
import { BancorConverterRegistry } from './contracts/BancorConverterRegistry';
import { SmartToken } from './contracts/SmartToken';
import { ERC20Token } from './contracts/ERC20Token';
import * as retrieve_contract_version from './retrieve_contract_version';
import * as fetch_conversion_events from './fetch_conversion_events';

let web3;
let registry;

export const anchorToken: Token = {
    blockchainType: 'ethereum',
    blockchainId: '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C'
};

export async function init(ethereumNodeUrl, ethereumContractRegistryAddress = '0xf078b4ec84e5fc57c693d43f1f4a82306c9b88d6') {
    web3 = new Web3(new Web3.providers.HttpProvider(ethereumNodeUrl));
    const contractRegistryContract = new web3.eth.Contract(ContractRegistry, ethereumContractRegistryAddress);
    const registryBlockchainId = await contractRegistryContract.methods.addressOf(Web3.utils.asciiToHex('BancorConverterRegistry')).call(); // '0x85e27A5718382F32238497e78b4A40DD778ab847'
    registry = new web3.eth.Contract(BancorConverterRegistry, registryBlockchainId);
}

export function isAnchorToken(token: Token) {
    return Web3.utils.toChecksumAddress(token.blockchainId) == anchorToken.blockchainId;
}

export function getTokenBlockchainId(token: Token) {
    return token.blockchainId.toLowerCase();
}

export const getAmountInTokenWei = async (token: string, amount: string, web3) => {
    const tokenContract = new web3.eth.Contract(ERC20Token, token);
    const decimals = await tokenContract.methods.decimals().call();
    return toWei(amount, decimals);
};

export const getConversionReturn = async (converterPair: ConversionPathStep, amount: string, ABI, web3) => {
    let converterContract = new web3.eth.Contract(ABI, converterPair.converterBlockchainId);
    const returnAmount = await converterContract.methods.getReturn(converterPair.fromToken, converterPair.toToken, amount).call();
    return returnAmount;
};

export async function getPathStepRate(converterPair: ConversionPathStep, amount: string) {
    const amountInTokenWei = await getAmountInTokenWei((converterPair.fromToken as string), amount, web3);
    const tokenContract = new web3.eth.Contract(ERC20Token, converterPair.toToken);
    const tokenDecimals = await tokenContract.methods.decimals().call();
    try {
        const returnAmount = await getConversionReturn(converterPair, amountInTokenWei, BancorConverter, web3);
        return fromWei(returnAmount['0'], tokenDecimals);
    }
    catch (error) {
        if (error.message.includes('insufficient data for uint256')) {
            const returnAmount = await getConversionReturn(converterPair, amountInTokenWei, BancorConverterV9, web3);
            return fromWei(returnAmount, tokenDecimals);
        }
        throw error;
    }
}

export const getConverterBlockchainId = async blockchainId => {
    const tokenContract = new web3.eth.Contract(SmartToken, blockchainId);
    return await tokenContract.methods.owner().call();
};

export async function retrieveContractVersion(contract) {
    return await retrieve_contract_version.run(web3, contract);
}

export async function fetchConversionEvents(token, fromBlock, toBlock) {
    return await fetch_conversion_events.run(web3, token, fromBlock, toBlock);
}

export async function fetchConversionEventsByTimestamp(token, fromTimestamp, toTimestamp) {
    const fromBlock = await timestampToBlockNumber(web3, fromTimestamp);
    const toBlock = await timestampToBlockNumber(web3, toTimestamp);
    return await fetch_conversion_events.run(web3, token, fromBlock, toBlock);
}

function registryDataUpdate(registryData, key, value) {
    if (registryData[key] == undefined)
        registryData[key] = [value];
    else if (!registryData[key].includes(value))
        registryData[key].push(value);
}

function getAllPathsRecursive(paths, path, targetToken, registryData) {
    const prevToken = path[path.length - 1];
    if (prevToken == targetToken)
        paths.push(path);
    else for (const nextToken of registryData[prevToken].filter(token => !path.includes(token)))
        getAllPathsRecursive(paths, [...path, nextToken], targetToken, registryData);
}

export async function getAllPaths(sourceToken, targetToken) {
    const MULTICALL_ABI = [{"constant":false,"inputs":[{"components":[{"internalType":"address","name":"target","type":"address"},{"internalType":"bytes","name":"callData","type":"bytes"}],"internalType":"struct Multicall.Call[]","name":"calls","type":"tuple[]"},{"internalType":"bool","name":"strict","type":"bool"}],"name":"aggregate","outputs":[{"internalType":"uint256","name":"blockNumber","type":"uint256"},{"components":[{"internalType":"bool","name":"success","type":"bool"},{"internalType":"bytes","name":"data","type":"bytes"}],"internalType":"struct Multicall.Return[]","name":"returnData","type":"tuple[]"}],"payable":false,"stateMutability":"nonpayable","type":"function"}];
    const MULTICALL_ADDRESS = '0x5Eb3fa2DFECdDe21C950813C665E9364fa609bD2';
    const multicall = new web3.eth.Contract(MULTICALL_ABI, MULTICALL_ADDRESS);

    const convertibleTokens = await registry.methods.getConvertibleTokens().call();
    const calls = convertibleTokens.map(convertibleToken => [registry._address, registry.methods.getConvertibleTokenSmartTokens(convertibleToken).encodeABI()]);
    const [blockNumber, returnData] = await multicall.methods.aggregate(calls, true).call();

    const registryData = {};

    for (let i = 0; i < returnData.length; i++) {
        for (const smartToken of Array.from(Array((returnData[i].data.length - 130) / 64).keys()).map(n => Web3.utils.toChecksumAddress(returnData[i].data.substr(64 * n + 154, 40)))) {
            if (convertibleTokens[i] != smartToken) {
                registryDataUpdate(registryData, convertibleTokens[i], smartToken);
                registryDataUpdate(registryData, smartToken, convertibleTokens[i]);
            }
        }
    }

    const paths = [];
    getAllPathsRecursive(paths, [sourceToken], targetToken, registryData);
    return paths;
}
