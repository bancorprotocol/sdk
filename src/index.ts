import { init as initEthereum, getConverterBlockchainId, getPathStepRate as getEthPathStepRate } from './blockchains/ethereum/index';
import { buildPathsFile, initEOS, getPathStepRate as getEOSPathStepRate } from './blockchains/eos';
import { testConversionTypes } from '../example/example';
import { IToken, generatePathByBlockchainIds, IConversionPaths, IConversionPathStep, IBlockchainType } from './path_generation';

let ethereumEndpoint = '';
let eosNodeEndpoint = '';

interface ISettings {
    ethereumNodeEndpointUrl: string;
    eosNodeEndpointUrl: string;
}

export async function init({ ethereumNodeEndpointUrl, eosNodeEndpointUrl }: ISettings) {
    ethereumEndpoint = ethereumNodeEndpointUrl;
    eosNodeEndpoint = eosNodeEndpointUrl;
    if (eosNodeEndpoint)
        initEOS(eosNodeEndpoint);
    if (ethereumEndpoint)
        await initEthereum(ethereumEndpoint);
}

export async function generateEosPaths() {
    buildPathsFile();
}

export async function generatePath(sourceToken: IToken, targetToken: IToken) {
    return await generatePathByBlockchainIds(sourceToken, targetToken);
}

async function calculateRateFromPaths(paths: IConversionPaths, amount) {
    if (paths.paths.length == 0) return amount;
    const rate = await calculateRateFromPath(paths, amount);
    paths.paths.shift();
    return calculateRateFromPaths(paths, rate);
}

async function calculateRateFromPath(paths: IConversionPaths, amount) {
    const blockchainType: IBlockchainType = paths.paths[0].type;
    const convertPairs = await getConverterPairs(paths.paths[0].path, blockchainType);

    let i = 0;
    while (i < convertPairs.length) {
        amount = blockchainType == 'ethereum' ? await getEthPathStepRate(convertPairs[i], amount) : await getEOSPathStepRate(convertPairs[i], amount);
        i += 1;
    }
    return amount;
}

async function getConverterPairs(path: string[], blockchainType: IBlockchainType) {
    const pairs: IConversionPathStep[] = [];
    for (let i = 0; i < path.length - 1; i += 2) {
        let converterBlockchainId = blockchainType == 'ethereum' ? await getConverterBlockchainId(path[i + 1]) : path[i + 1];
        pairs.push({ converterBlockchainId: converterBlockchainId, fromToken: path[i], toToken: path[i + 2] });
    }
    return pairs;
}

export async function getRateByPath(paths: IConversionPaths, amount) {
    return await calculateRateFromPaths(paths, amount);
}

export async function getRate(sourceToken: IToken, targetToken: IToken, amount: string) {
    const paths = await generatePath(sourceToken, targetToken);
    return await getRateByPath(paths, amount);
}

// testConversionTypes(); // todo uncomment to run tests

export default {
    init,
    generateEosPaths,
    getRate,
    generatePath,
    getRateByPath,
    buildPathsFile,
    testConversionTypes
};
