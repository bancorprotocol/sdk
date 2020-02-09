/* eslint-disable max-len */
/* eslint-disable no-sync */
/* eslint-disable prefer-reflect */
import Web3 from 'web3';
import Decimal from 'decimal.js';
import { BancorConverterV9 } from './contracts/BancorConverterV9';
import { fromWei, toWei } from './utils';
import { ConversionPathStep, Token } from '../../path_generation';
import { BancorConverter } from './contracts/BancorConverter';
import { ContractRegistry } from './contracts/ContractRegistry';
import { BancorConverterRegistry } from './contracts/BancorConverterRegistry';
import { SmartToken } from './contracts/SmartToken';
import { ERC20Token } from './contracts/ERC20Token';

let web3;
let registry;

export const anchorToken: Token = {
    blockchainType: 'ethereum',
    blockchainId: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
};

export async function init(ethereumNodeUrl, ethereumContractRegistryAddress = '0xf078b4ec84e5fc57c693d43f1f4a82306c9b88d6') {
    web3 = new Web3(new Web3.providers.HttpProvider(ethereumNodeUrl));
    const contractRegistryContract = new web3.eth.Contract(ContractRegistry, ethereumContractRegistryAddress);
    const registryBlockchainId = await contractRegistryContract.methods.addressOf(Web3.utils.asciiToHex('BancorConverterRegistry')).call(); // '0x85e27A5718382F32238497e78b4A40DD778ab847'
    registry = new web3.eth.Contract(BancorConverterRegistry, registryBlockchainId);
    Decimal.set({precision: 100, rounding: Decimal.ROUND_DOWN});
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

export const getTokenDecimals = async tokenBlockchainId => {
    const token = new web3.eth.Contract(ERC20Token, tokenBlockchainId);
    return await token.methods.decimals().call();
};

export async function getPathStepRate(converterPair: ConversionPathStep, amount: string) {
    let amountInTokenWei = await getAmountInTokenWei((converterPair.fromToken as string), amount, web3);
    const tokenBlockchainId = converterPair.toToken;
    const tokenDecimals = await getTokenDecimals(tokenBlockchainId);
    try {
        const returnAmount = await getConversionReturn(converterPair, amountInTokenWei, BancorConverter, web3);
        amountInTokenWei = returnAmount['0'];
    }
    catch (e) {
        if (e.message.includes('insufficient data for uint256'))
            amountInTokenWei = await getConversionReturn(converterPair, amountInTokenWei, BancorConverterV9, web3);

        else throw (e);
    }
    return fromWei(amountInTokenWei, tokenDecimals);
}

export async function getRegistry() {
    const contractRegistryContract = new web3.eth.Contract(ContractRegistry, '0x52Ae12ABe5D8BD778BD5397F99cA900624CfADD4');
    const registryBlockchainId = await contractRegistryContract.methods.addressOf(Web3.utils.asciiToHex('BancorConverterRegistry')).call();
    return new web3.eth.Contract(BancorConverterRegistry, registryBlockchainId);
}

export const getConverterBlockchainId = async blockchainId => {
    const tokenContract = new web3.eth.Contract(SmartToken, blockchainId);
    return await tokenContract.methods.owner().call();
};

export async function getReserveTokens(converterBlockchainId) {
    const converter = new web3.eth.Contract(BancorConverter, converterBlockchainId);
    const connectorTokenCount = await converter.methods.connectorTokenCount().call();
    const tokens: Token[] = [];
    for (let i = 0; i < connectorTokenCount; i++) {
        tokens.push({
            blockchainType: 'ethereum',
            blockchainId: await converter.methods.connectorToken(i).call()
        });
    }
    return tokens;
}

export async function getConverterSmartToken(converter) {
    return await converter.methods.token().call();
}

export async function getSmartTokens(token: Token) {
    const isSmartToken = await registry.methods.isSmartToken(token.blockchainId).call();
    return isSmartToken ? [token.blockchainId] : await registry.methods.getConvertibleTokenSmartTokens(token.blockchainId).call();
}
