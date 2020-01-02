import { init as initEthereum, getConverterBlockchainId, getPathStepRate as getEthPathStepRate } from './blockchains/ethereum/index';
import { buildPathsFile, initEOS, getPathStepRate as getEOSPathStepRate } from './blockchains/eos';
import { Token, generatePathByBlockchainIds, ConversionPaths, ConversionPathStep, BlockchainType } from './path_generation';

interface Settings {
    ethereumNodeEndpoint: string;
    eosNodeEndpoint: string;
}

export async function init({ ethereumNodeEndpoint, eosNodeEndpoint }: Settings) {
    if (eosNodeEndpoint)
        initEOS(eosNodeEndpoint);
    if (ethereumNodeEndpoint)
        await initEthereum(ethereumNodeEndpoint);
}

export async function generateEosPaths() {
    buildPathsFile();
}

export async function generatePath(sourceToken: Token, targetToken: Token) {
    return await generatePathByBlockchainIds(sourceToken, targetToken);
}

// export async function calculateRateFromPaths(paths: ConversionPaths, amount) {
export const calculateRateFromPaths = async (paths: ConversionPaths, amount) => {
    if (paths.paths.length == 0) return amount;
    const rate = await calculateRateFromPath(paths, amount);
    paths.paths.shift();
    return calculateRateFromPaths(paths, rate);
};

export async function calculateRateFromPath(paths: ConversionPaths, amount) {
    const blockchainType: BlockchainType = paths.paths[0].type;
    const convertPairs = await getConverterPairs(paths.paths[0].path, blockchainType);
    console.log('convertPairs ', convertPairs);

    let i = 0;
    while (i < convertPairs.length) {
        amount = blockchainType == 'ethereum' ? await getEthPathStepRate(convertPairs[i], amount) : await getEOSPathStepRate(convertPairs[i], amount);
        i += 1;
    }
    return amount;
}

async function getConverterPairs(path: string[], blockchainType: BlockchainType) {
    const pairs: ConversionPathStep[] = [];
    for (let i = 0; i < path.length - 1; i += 2) {
        let converterBlockchainId = blockchainType == 'ethereum' ? await getConverterBlockchainId(path[i + 1]) : path[i + 1];
        pairs.push({ converterBlockchainId: converterBlockchainId, fromToken: path[i], toToken: path[i + 2] });
    }
    return pairs;
}

export const getRateByPath = async (paths: ConversionPaths, amount) => {
    console.log('paths ', JSON.stringify(paths));
    return await calculateRateFromPaths(paths, amount);
};

export async function getRate(sourceToken: Token, targetToken: Token, amount: string) {
    const paths = await generatePath(sourceToken, targetToken);
    return await getRateByPath(paths, amount);
}

export default {
    init,
    generateEosPaths,
    getRate,
    generatePath,
    getRateByPath,
    buildPathsFile
};
