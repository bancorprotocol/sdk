/* eslint-disable max-len */
import { getConverterBlockchainId as getEosConverterBlockchainId, getReserveBlockchainId as getEosReserveBlockchainId, getReserves as getEOSReserves, getReservesCount as getEOSReservesCount, isMultiConverter } from './blockchains/eos';
import { getReserves as getEthReserves, getConverterBlockchainId as getEthConverterBlockchainId, getConverterSmartToken as getEthConverterSmartToken, getReserveBlockchainId as getEthereumReserveBlockchainId, getReservesCount as getEthReservesCount, getSmartTokens, getAllPathsAndRates } from './blockchains/ethereum';

export type BlockchainType = 'ethereum' | 'eos';

const BNTBlockchainId = '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C';

const EthereumAnchorToken: Token = {
    blockchainType: 'ethereum',
    blockchainId: BNTBlockchainId
};

const EOSAnchorToken: Token = {
    blockchainType: 'eos',
    blockchainId: 'bntbntbntbnt',
    symbol: 'BNT'
};

const anchorTokens = {
    ethereum: EthereumAnchorToken,
    eos: EOSAnchorToken
};

export interface ConversionPathsTokens {
    from: Token;
    to: Token;
}

export interface ConversionPath {
    type: BlockchainType;
    path: string[] | ConversionToken[];
}

export interface ConversionToken {
    [key: string]: string;
}

export interface ConversionPathStep {
    converterBlockchainId: string | ConversionToken;
    fromToken: string | ConversionToken;
    toToken: string | ConversionToken;
}

export interface ConversionPaths {
    paths: ConversionPath[];
}

export interface Token {
    blockchainType: BlockchainType;
    blockchainId: string;
    symbol?: string;
}

function isAnchorToken(token: Token) {
    if (token.blockchainType == 'ethereum' && token.blockchainId.toLowerCase() == BNTBlockchainId.toLowerCase())
        return true;
    if (token.blockchainType == 'eos' && token.blockchainId == anchorTokens['eos'].blockchainId)
        return true;
    return false;
}

function getTokenBlockchainId(token: Token) {
    if (token.blockchainType == 'ethereum') return token.blockchainId.toLowerCase();
    return { [token.symbol]: token.blockchainId.toLowerCase() };
}
// function getTokenBlockchainId(token: Token) {
//     if (token.blockchainType == 'ethereum') return token.blockchainId.toLowerCase();
//     return token.blockchainId.toLowerCase();
// }

function isReserveToken(reserveToken: Token, token: Token) {
    if (token.blockchainType == 'ethereum' && token.blockchainId == reserveToken.blockchainId)
        return true;
    if (token.blockchainType == 'eos' && token.blockchainId == reserveToken.blockchainId)
        return true;
    return false;
}

export const getConverterBlockchainId = async (token: Token) => {
    if (token.blockchainType == 'ethereum')
        return await getEthConverterBlockchainId(token.blockchainId);
    return await getEosConverterBlockchainId(token);
};

export const getReserveCount = async (reserves, blockchainType: BlockchainType) => {
    if (blockchainType == 'ethereum')
        return await getEthReservesCount(reserves);
    return await getEOSReservesCount(reserves);
};

export const getReserves = async (blockchainId, blockchainType: BlockchainType, symbol: string, isMulti: boolean) => {
    if (blockchainType == 'ethereum')
        return await getEthReserves(blockchainId);
    return await getEOSReserves(blockchainId, symbol, isMulti);
};

export const getReserveToken = async (token, index, blockchainType: BlockchainType) => {
    if (blockchainType == 'ethereum')
        return await getEthereumReserveBlockchainId(token, index);
    return await getEosReserveBlockchainId(token, index);
};

export async function getConverterToken(blockchainId, connector, blockchainType: BlockchainType) {
    if (blockchainType == 'ethereum') return await getEthConverterSmartToken(connector);
    return blockchainId;
}

export async function generatePathByBlockchainIds(sourceToken: Token, targetToken: Token, amount: string, getBestPath: (paths: string[], rates: string[]) => string[]) {
    const pathObjects: ConversionPaths = { paths: []};
    let paths, rates;

    switch (sourceToken.blockchainType + ',' + targetToken.blockchainType) {
        case 'eos,eos':
            pathObjects.paths.push({ type: 'eos', path: await getConversionPath(sourceToken, targetToken) });
            break;
        case 'ethereum,ethereum':
            [paths, rates] = await getAllPathsAndRates(sourceToken.blockchainId, targetToken.blockchainId, amount);
            pathObjects.paths.push({ type: 'ethereum', path: getBestPath(paths, rates) });
            break;
        case 'eos,ethereum':
            [paths, rates] = await getAllPathsAndRates(EthereumAnchorToken.blockchainId, targetToken.blockchainId, amount);
            pathObjects.paths.push({ type: 'eos', path: await getConversionPath(sourceToken, null) });
            pathObjects.paths.push({ type: 'ethereum', path: getBestPath(paths, rates) });
            break;
        case 'ethereum,eos':
            [paths, rates] = await getAllPathsAndRates(sourceToken.blockchainId, EthereumAnchorToken.blockchainId, amount);
            pathObjects.paths.push({ type: 'ethereum', path: getBestPath(paths, rates) });
            pathObjects.paths.push({ type: 'eos', path: await getConversionPath(null, targetToken) });
            break;
    }

    return pathObjects;
}

function getPath(from: Token, to: Token) {
    const blockchainType: BlockchainType = from ? from.blockchainType : to.blockchainType;
    const path: ConversionPathsTokens = {
        from: from ? from : null,
        to: to ? to : null
    };

    if (!path.to)
        path.to = { ...anchorTokens[blockchainType] };

    if (!path.from)
        path.from = { ...anchorTokens[blockchainType] };

    return path;
}

export async function getConversionPath(from: Token, to: Token) {
    const blockchainType = from ? from.blockchainType : to.blockchainType;

    const path = getPath(from, to);
    return findPath(path, blockchainType);
}

export async function findPath(pathObject: ConversionPathsTokens, blockchainType: BlockchainType) {
    const from = await getPathToAnchorByBlockchainId({ ...pathObject.from }, anchorTokens[blockchainType]);
    const to = await getPathToAnchorByBlockchainId({ ...pathObject.to }, anchorTokens[blockchainType]);
    return getShortestPath(from, to);
}

export async function getPathToAnchorByBlockchainId(token: Token, anchorToken: Token) {
    if (isAnchorToken(token))
        return [getTokenBlockchainId(token)];

    const smartTokens = token.blockchainType == 'eos' ? [token.blockchainId] : await getSmartTokens(token);
    const isMulti = token.blockchainType == 'eos' ? isMultiConverter(token.blockchainId) : false;
    let response = [];
    for (const smartToken of smartTokens) {
        const blockchainId = await getConverterBlockchainId(token.blockchainType == 'ethereum' ? { blockchainType: token.blockchainType, blockchainId: smartToken } : token);
        const converterBlockchainId = token.blockchainType == 'ethereum' ? blockchainId : Object.values(blockchainId)[0];
        const { reserves } = await getReserves(converterBlockchainId, token.blockchainType, token.symbol, isMulti);
        const reservesCount = await getReserveCount(reserves, token.blockchainType);
        for (let i = 0; i < reservesCount; i++) {
            const reserveToken = await getReserveToken(reserves, i, token.blockchainType);
            if (!isReserveToken(reserveToken, token)) {
                const path = await getPathToAnchorByBlockchainId(reserveToken, anchorToken);
                if (path.length > 0)
                    return [getTokenBlockchainId(token), token.blockchainType == 'eos' ? blockchainId : smartToken, ...path];
            }
        }
    }
    return response;
}

function getShortestPath(sourcePath, targetPath) {
    if (sourcePath.length > 0 && targetPath.length > 0) {
        let i = sourcePath.length - 1;
        let j = targetPath.length - 1;
        while (i >= 0 && j >= 0 && JSON.stringify(sourcePath[i]) == JSON.stringify(targetPath[j])) {
            i--;
            j--;
        }

        const path = [];
        for (let m = 0; m <= i + 1; m++)
            path.push(sourcePath[m]);
        for (let n = j; n >= 0; n--)
            path.push(targetPath[n]);

        let length = 0;
        for (let p = 0; p < path.length; p += 1) {
            for (let q = p + 2; q < path.length - p % 2; q += 2) {
                if (path[p] == path[q])
                    p = q;
            }
            path[length++] = path[p];
        }

        return path.slice(0, length);
    }

    return [];
}

export function ethGetShortestPath(paths, rates) {
    let bestPathIndex = 0;
    for (let i = 1; i < paths.length; i++) {
        if ((paths[bestPathIndex].length > paths[i].length) || (paths[bestPathIndex].length == paths[i].length && rates[bestPathIndex] < rates[i]))
            bestPathIndex = i;
    }
    return paths[bestPathIndex];
}

export function ethGetCheapestPath(paths, rates) {
    let bestPathIndex = 0;
    for (let i = 1; i < rates.length; i++) {
        if ((rates[bestPathIndex] < rates[i]) || (rates[bestPathIndex] == rates[i] && paths[bestPathIndex].length > paths[i].length))
            bestPathIndex = i;
    }
    return paths[bestPathIndex];
}
