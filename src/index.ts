import * as eos from './blockchains/eos/index';
import * as ethereum from './blockchains/ethereum/index';
import { Token, ConversionPath, ConversionPathStep, BlockchainType, ConversionToken } from './path_generation';

interface Settings {
    ethereumNodeEndpoint: string;
    eosNodeEndpoint: string;
    ethereumContractRegistryAddress?: string;
}

interface Contract {
    blockchainType: BlockchainType;
    blockchainId: string;
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
    const pathObjects: ConversionPath[] = [];
    let paths;

    switch (sourceToken.blockchainType + ',' + targetToken.blockchainType) {
        case 'eos,eos':
            pathObjects.push({ type: 'eos', path: await eos.getConversionPath(sourceToken, targetToken) });
            break;
        case 'ethereum,ethereum':
            paths = await ethereum.getAllPaths(sourceToken.blockchainId, targetToken.blockchainId);
            pathObjects.push({ type: 'ethereum', path: paths.reduce((a, b) => a.length < b.length ? a : b)});
            break;
        case 'eos,ethereum':
            paths = await ethereum.getAllPaths(ethereum.anchorToken.blockchainId, targetToken.blockchainId);
            pathObjects.push({ type: 'eos', path: await eos.getConversionPath(sourceToken, eos.anchorToken) });
            pathObjects.push({ type: 'ethereum', path: paths.reduce((a, b) => a.length < b.length ? a : b)});
            break;
        case 'ethereum,eos':
            paths = await ethereum.getAllPaths(sourceToken.blockchainId, ethereum.anchorToken.blockchainId);
            pathObjects.push({ type: 'ethereum', path: paths.reduce((a, b) => a.length < b.length ? a : b)});
            pathObjects.push({ type: 'eos', path: await eos.getConversionPath(eos.anchorToken, targetToken) });
            break;
    }

    return pathObjects;
}

async function calculateRateFromPaths(paths: ConversionPath[], amount) {
    if (paths.length == 0) return amount;
    const rate = await calculateRateFromPath(paths, amount);
    return calculateRateFromPaths(paths.slice(1), rate);
};

async function calculateRateFromPath(paths: ConversionPath[], amount) {
    const blockchainType: BlockchainType = paths[0].type;
    const convertPairs = await getConverterPairs(paths[0].path, blockchainType);
    const module = {eos, ethereum}[blockchainType];
    for (let i = 0; i < convertPairs.length; i++)
        amount = await module.getPathStepRate(convertPairs[i], amount);
    return amount;
}

async function getConverterPairs(path: string[] | object[], blockchainType: BlockchainType) {
    const pairs: ConversionPathStep[] = [];
    for (let i = 0; i < path.length - 1; i += 2) {
        let converterBlockchainId = blockchainType == 'ethereum' ? await ethereum.getConverterBlockchainId(path[i + 1]) : path[i + 1];
        pairs.push({ converterBlockchainId: converterBlockchainId, fromToken: (path[i] as string), toToken: (path[i + 2] as string) });
    }
    if (pairs.length == 0 && blockchainType == 'eos' && eos.isMultiConverter(path[0])) {
        pairs.push({
            converterBlockchainId: (path[0] as ConversionToken), fromToken: (path[0] as ConversionToken), toToken: (path[0] as ConversionToken)
        });
    }
    return pairs;
}

export async function getRateByPath(paths: ConversionPath[], amount) {
    return await calculateRateFromPaths(paths, amount);
};

export async function getRate(sourceToken: Token, targetToken: Token, amount: string) {
    const paths = await generatePath(sourceToken, targetToken);
    return await getRateByPath(paths, amount);
}

export async function retrieveContractVersion(contract: Contract) {
    if (contract.blockchainType == 'ethereum')
        return await ethereum.retrieveContractVersion(contract.blockchainId);
    throw new Error(contract.blockchainType + ' blockchain not supported');
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
    retrieveContractVersion,
    fetchConversionEvents,
    fetchConversionEventsByTimestamp,
    getAllPaths
};
