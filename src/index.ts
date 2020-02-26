import { init as initEthereum, getConverterBlockchainId, getPathStepRate as getEthPathStepRate, getAllPathsAndRates as ethGetAllPathsAndRates} from './blockchains/ethereum/index';
import { buildPathsFile, initEOS, getPathStepRate as getEOSPathStepRate, isMultiConverter } from './blockchains/eos';
import { Token, generatePathByBlockchainIds, ConversionPaths, ConversionPathStep, BlockchainType, ConversionToken } from './path_generation';

interface Settings {
    ethereumNodeEndpoint: string;
    eosNodeEndpoint: string;
    ethereumContractRegistryAddress?: string;
}

export async function init(args: Settings) {
    if (args.eosNodeEndpoint)
        initEOS(args.eosNodeEndpoint);
    if (args.ethereumNodeEndpoint)
        await initEthereum(args.ethereumNodeEndpoint, args.ethereumContractRegistryAddress);
}

export async function generateEosPaths() {
    await buildPathsFile();
}

export async function generatePath(sourceToken: Token, targetToken: Token, amount: string = '1', getBestPath: (paths: string[][], rates: string[]) => string[] = getEthCheapestPath) {
    return await generatePathByBlockchainIds(sourceToken, targetToken, amount, getBestPath);
}

export const calculateRateFromPaths = async (paths: ConversionPaths, amount) => {
    if (paths.paths.length == 0) return amount;
    const rate = await calculateRateFromPath(paths, amount);
    paths.paths.shift();
    return calculateRateFromPaths(paths, rate);
};

export async function calculateRateFromPath(paths: ConversionPaths, amount) {
    const blockchainType: BlockchainType = paths.paths[0].type;
    const convertPairs = await getConverterPairs(paths.paths[0].path, blockchainType);
    let i = 0;
    while (i < convertPairs.length) {
        amount = blockchainType == 'ethereum' ? await getEthPathStepRate(convertPairs[i], amount) : await getEOSPathStepRate(convertPairs[i], amount);
        i += 1;
    }
    return amount;
}

async function getConverterPairs(path: string[] | object[], blockchainType: BlockchainType) {
    const pairs: ConversionPathStep[] = [];
    for (let i = 0; i < path.length - 1; i += 2) {
        let converterBlockchainId = blockchainType == 'ethereum' ? await getConverterBlockchainId(path[i + 1]) : path[i + 1];
        pairs.push({ converterBlockchainId: converterBlockchainId, fromToken: (path[i] as string), toToken: (path[i + 2] as string) });
    }
    if (pairs.length == 0 && blockchainType == 'eos' && isMultiConverter(path[0])) {
        pairs.push({
            converterBlockchainId: (path[0] as ConversionToken), fromToken: (path[0] as ConversionToken), toToken: (path[0] as ConversionToken)
        });
    }
    return pairs;
}

export const getRateByPath = async (paths: ConversionPaths, amount) => {
    return await calculateRateFromPaths(paths, amount);
};

export async function getRate(sourceToken: Token, targetToken: Token, amount: string) {
    const paths = await generatePath(sourceToken, targetToken);
    return await getRateByPath(paths, amount);
}

export async function getAllPathsAndRates(sourceToken: Token, targetToken: Token, amount: string = '1') {
    if (sourceToken.blockchainType == 'ethereum' && targetToken.blockchainType == 'ethereum')
        return await ethGetAllPathsAndRates(sourceToken.blockchainId, targetToken.blockchainId, amount);
    throw new Error(sourceToken.blockchainType + ' blockchain to ' + targetToken.blockchainType + ' blockchain not supported');
}

export function getEthShortestPath(paths: string[][], rates: string[]) {
    let index = 0;
    for (let i = 1; i < paths.length; i++) {
        if (shorterPath(paths, index, i) || (equalPath(paths, index, i) && cheaperRate(rates, index, i)))
            index = i;
    }
    return paths[index];
}

export function getEthCheapestPath(paths: string[][], rates: string[]) {
    let index = 0;
    for (let i = 1; i < rates.length; i++) {
        if (cheaperRate(rates, index, i) || (equalRate(rates, index, i) && shorterPath(paths, index, i)))
            index = i;
    }
    return paths[index];
}

function shorterPath(paths: string[][], index1: number, index2: number) {
    return paths[index1].length > paths[index2].length;
}

function cheaperRate(rates: string[], index1: number, index2: number) {
    // return Number(rates[index1]) < Number(rates[index2]);
    const rate1 = rates[index1].split('.').concat('');
    const rate2 = rates[index2].split('.').concat('');
    rate1[0] = rate1[0].padStart(rate2[0].length, '0');
    rate2[0] = rate2[0].padStart(rate1[0].length, '0');
    rate1[1] = rate1[1].padEnd(rate2[1].length, '0');
    rate2[1] = rate2[1].padEnd(rate1[1].length, '0');
    return rate1.join('') < rate2.join('');
}

function equalPath(paths: string[][], index1: number, index2: number) {
    return paths[index1].length == paths[index2].length;
}

function equalRate(rates: string[], index1: number, index2: number) {
    return rates[index1] == rates[index2];
}

export default {
    init,
    generateEosPaths,
    getRate,
    generatePath,
    getRateByPath,
    buildPathsFile,
    getAllPathsAndRates,
    getEthShortestPath,
    getEthCheapestPath
};
