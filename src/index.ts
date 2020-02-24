import * as eos from './blockchains/eos/index';
import * as ethereum from './blockchains/ethereum/index';
import { Token, Converter } from './path_generation';

export {
    init,
    generatePath,
    getRateByPath,
    getRate,
    getAllPaths,
    getAllRates,
    retrieveConverterVersion,
    fetchConversionEvents,
    fetchConversionEventsByTimestamp,
    buildPathsFile
};

interface Settings {
    ethereumNodeEndpoint: string;
    eosNodeEndpoint: string;
}

async function init(args: Settings) {
    if (args.eosNodeEndpoint)
        eos.init(args.eosNodeEndpoint);
    if (args.ethereumNodeEndpoint)
        await ethereum.init(args.ethereumNodeEndpoint);
}

async function generatePath(sourceToken: Token, targetToken: Token) {
    let eosPath;
    let ethPaths;

    const ethShortestPath = paths => paths.reduce((a, b) => a.length < b.length ? a : b).map(x => ({blockchainType: 'ethereum', blockchainId: x}));

    switch (sourceToken.blockchainType + ',' + targetToken.blockchainType) {
        case 'eos,eos':
            eosPath = await eos.getConversionPath(sourceToken, targetToken);
            return [eosPath];
        case 'ethereum,ethereum':
            ethPaths = await ethereum.getAllPaths(sourceToken.blockchainId, targetToken.blockchainId);
            return [ethShortestPath(ethPaths)];
        case 'eos,ethereum':
            eosPath = await eos.getConversionPath(sourceToken, eos.getAnchorToken());
            ethPaths = await ethereum.getAllPaths(ethereum.getAnchorToken(), targetToken.blockchainId);
            return [eosPath, ethShortestPath(ethPaths)];
        case 'ethereum,eos':
            ethPaths = await ethereum.getAllPaths(sourceToken.blockchainId, ethereum.getAnchorToken());
            eosPath = await eos.getConversionPath(eos.getAnchorToken(), targetToken);
            return [ethShortestPath(ethPaths), eosPath];
    }

    return [];
}

async function getRateByPath(paths: Token[][], amount: string) {
    for (const path of paths) {
        switch (path[0].blockchainType) {
        case 'eos':
            amount = await eos.getRateByPath(path, amount);
            break;
        case 'ethereum':
            amount = await ethereum.getRateByPath(path.map(token => token.blockchainId), amount);
            break;
        }
    }
    return amount;
}

async function getRate(sourceToken: Token, targetToken: Token, amount: string) {
    const paths = await generatePath(sourceToken, targetToken);
    return await getRateByPath(paths, amount);
}

async function getAllPaths(sourceToken: Token, targetToken: Token) {
    if (sourceToken.blockchainType == 'ethereum' && targetToken.blockchainType == 'ethereum')
        return await ethereum.getAllPaths(sourceToken.blockchainId, targetToken.blockchainId);
    throw new Error(sourceToken.blockchainType + ' blockchain to ' + targetToken.blockchainType + ' blockchain not supported');
}

async function getAllRates(paths: Token[][], amounts: string[]) {
    if (paths.every(path => path.every(token => token.blockchainType == 'ethereum')))
        return await ethereum.getRateByPaths(paths.map(path => path.map(token => token.blockchainId)), amounts);
    throw new Error("only ethereum blockchain supported");
}

async function retrieveConverterVersion(converter: Converter) {
    if (converter.blockchainType == 'ethereum')
        return await ethereum.retrieveConverterVersion(converter.blockchainId);
    throw new Error(converter.blockchainType + ' blockchain not supported');
}

async function fetchConversionEvents(token: Token, fromBlock, toBlock) {
    if (token.blockchainType == 'ethereum')
        return await ethereum.fetchConversionEvents(token.blockchainId, fromBlock, toBlock);
    throw new Error(token.blockchainType + ' blockchain not supported');
}

async function fetchConversionEventsByTimestamp(token: Token, fromTimestamp, toTimestamp) {
    if (token.blockchainType == 'ethereum')
        return await ethereum.fetchConversionEventsByTimestamp(token.blockchainId, fromTimestamp, toTimestamp);
    throw new Error(token.blockchainType + ' blockchain not supported');
}

async function buildPathsFile() {
    await eos.buildPathsFile();
}
