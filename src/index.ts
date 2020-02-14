import * as eos from './blockchains/eos/index';
import * as ethereum from './blockchains/ethereum/index';
import { BlockchainType, Token, Converter, ConversionStep } from './path_generation';

interface Settings {
    ethereumNodeEndpoint: string;
    eosNodeEndpoint: string;
    ethereumContractRegistryAddress?: string;
}

export async function init(args: Settings) {
    if (args.eosNodeEndpoint)
        eos.init(args.eosNodeEndpoint);
    if (args.ethereumNodeEndpoint)
        await ethereum.init(args.ethereumNodeEndpoint, args.ethereumContractRegistryAddress);
}

export async function buildPathsFile() {
    await eos.buildPathsFile();
}

export async function generatePath(sourceToken: Token, targetToken: Token) {
    let eosPath;
    let ethPaths;

    switch (sourceToken.blockchainType + ',' + targetToken.blockchainType) {
        case 'eos,eos':
            eosPath = await eos.getConversionPath(sourceToken, targetToken);
            return [eosPath];
        case 'ethereum,ethereum':
            ethPaths = await ethereum.getAllPaths(sourceToken.blockchainId, targetToken.blockchainId);
            return [ethPaths.reduce((a, b) => a.length < b.length ? a : b)];
        case 'eos,ethereum':
            eosPath = await eos.getConversionPath(sourceToken, eos.anchorToken);
            ethPaths = await ethereum.getAllPaths(ethereum.anchorToken.blockchainId, targetToken.blockchainId);
            return [eosPath, ethPaths.reduce((a, b) => a.length < b.length ? a : b)];
        case 'ethereum,eos':
            ethPaths = await ethereum.getAllPaths(sourceToken.blockchainId, ethereum.anchorToken.blockchainId);
            eosPath = await eos.getConversionPath(eos.anchorToken, targetToken);
            return [ethPaths.reduce((a, b) => a.length < b.length ? a : b), eosPath];
    }

    return [];
}

export async function getRateByPath(paths: Token[][], amount) {
    for (const path of paths) {
        const module = {eos, ethereum}[path[0].blockchainType];
        const steps : ConversionStep[] = await module.getConversionSteps(path);
        for (const step of steps) {
            amount = await module.getPathStepRate(step, amount);
        }
    }
    return amount;
};

export async function getRate(sourceToken: Token, targetToken: Token, amount: string) {
    const paths = await generatePath(sourceToken, targetToken);
    return await getRateByPath(paths, amount);
}

export async function retrieveConverterVersion(converter: Converter) {
    if (converter.blockchainType == 'ethereum')
        return await ethereum.retrieveConverterVersion(converter.blockchainId);
    throw new Error(converter.blockchainType + ' blockchain not supported');
}

export async function fetchConversionEvents(token: Token, fromBlock, toBlock) {
    if (token.blockchainType == 'ethereum')
        return await ethereum.fetchConversionEvents(token.blockchainId, fromBlock, toBlock);
    throw new Error(token.blockchainType + ' blockchain not supported');
}

export async function fetchConversionEventsByTimestamp(token: Token, fromTimestamp, toTimestamp) {
    if (token.blockchainType == 'ethereum')
        return await ethereum.fetchConversionEventsByTimestamp(token.blockchainId, fromTimestamp, toTimestamp);
    throw new Error(token.blockchainType + ' blockchain not supported');
}

export async function getAllPaths(sourceToken: Token, targetToken: Token) {
    if (sourceToken.blockchainType == 'ethereum' && targetToken.blockchainType == 'ethereum')
        return await ethereum.getAllPaths(sourceToken.blockchainId, targetToken.blockchainId);
    throw new Error(sourceToken.blockchainType + ' blockchain to ' + targetToken.blockchainType + ' blockchain not supported');
}

export default {
    init,
    getRate,
    generatePath,
    getRateByPath,
    buildPathsFile,
    retrieveConverterVersion,
    fetchConversionEvents,
    fetchConversionEventsByTimestamp,
    getAllPaths
};
