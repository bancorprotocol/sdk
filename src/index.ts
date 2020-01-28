import { init as initEthereum, getConverterBlockchainId, getPathStepRate as getEthPathStepRate } from './blockchains/ethereum/index';
import { buildPathsFile, initEOS, getPathStepRate as getEOSPathStepRate, isMultiConverter } from './blockchains/eos';
import { Token, generatePathByBlockchainIds, ConversionPaths, ConversionPathStep, BlockchainType } from './path_generation';

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

export async function generatePath(sourceToken: Token, targetToken: Token) {
    return await generatePathByBlockchainIds(sourceToken, targetToken);
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
        pairs.push({ converterBlockchainId: converterBlockchainId, fromToken: path[i], toToken: path[i + 2] });
    }
    if (pairs.length == 0 && blockchainType == 'eos' && isMultiConverter(path[0]))
        pairs.push({ converterBlockchainId: path[0], fromToken: path[0], toToken: path[0] });
    return pairs;
}

export const getRateByPath = async (paths: ConversionPaths, amount) => {
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
