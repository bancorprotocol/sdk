import * as eos from './blockchains/eos/index';
import * as ethereum from './blockchains/ethereum/index';
import { Token, Converter } from './path_generation';

export {
    init,
    generatePath,
    getRateByPath,
    getRate,
    getAllPathsAndRates,
    getEthShortestPath,
    getEthCheapestPath,
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

async function generatePath(sourceToken: Token, targetToken: Token, amount: string = "1", getEthBestPath: (paths: string[], rates: string[]) => string[] = getEthCheapestPath) {
    let eosPath;
    let ethPaths;
    let ethRates;

    switch (sourceToken.blockchainType + ',' + targetToken.blockchainType) {
        case 'eos,eos':
            eosPath = await eos.getConversionPath(sourceToken, targetToken);
            return [eosPath];
        case 'ethereum,ethereum':
            [ethPaths, ethRates] = await ethereum.getAllPathsAndRates(sourceToken.blockchainId, targetToken.blockchainId, amount);
            return [getEthBestPath(ethPaths, ethRates).map(x => ({blockchainType: 'ethereum', blockchainId: x}))];
        case 'eos,ethereum':
            eosPath = await eos.getConversionPath(sourceToken, eos.getAnchorToken());
            [ethPaths, ethRates] = await ethereum.getAllPathsAndRates(ethereum.getAnchorToken(), targetToken.blockchainId, amount);
            return [eosPath, getEthBestPath(ethPaths, ethRates).map(x => ({blockchainType: 'ethereum', blockchainId: x}))];
        case 'ethereum,eos':
            [ethPaths, ethRates] = await ethereum.getAllPathsAndRates(sourceToken.blockchainId, ethereum.getAnchorToken(), amount);
            eosPath = await eos.getConversionPath(eos.getAnchorToken(), targetToken);
            return [getEthBestPath(ethPaths, ethRates).map(x => ({blockchainType: 'ethereum', blockchainId: x})), eosPath];
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

async function getAllPathsAndRates(sourceToken: Token, targetToken: Token, amount: string = "1") {
    if (sourceToken.blockchainType == 'ethereum' && targetToken.blockchainType == 'ethereum')
        return await ethereum.getAllPathsAndRates(sourceToken.blockchainId, targetToken.blockchainId, amount);
    throw new Error(sourceToken.blockchainType + ' blockchain to ' + targetToken.blockchainType + ' blockchain not supported');
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

function getEthShortestPath(paths, rates) {
    let bestPathIndex = 0;
    for (let i = 1; i < paths.length; i++) {
        if ((paths[bestPathIndex].length > paths[i].length) || (paths[bestPathIndex].length == paths[i].length && rates[bestPathIndex] < rates[i]))
            bestPathIndex = i;
    }
    return paths[bestPathIndex];
}

function getEthCheapestPath(paths, rates) {
    let bestPathIndex = 0;
    for (let i = 1; i < rates.length; i++) {
        if ((rates[bestPathIndex] < rates[i]) || (rates[bestPathIndex] == rates[i] && paths[bestPathIndex].length > paths[i].length))
            bestPathIndex = i;
    }
    return paths[bestPathIndex];
}
