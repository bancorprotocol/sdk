/* eslint-disable max-len */
import { getConverterBlockchainId as getEosConverterBlockchainId, EOSToken, getReserveBlockchainId as getEosReserveBlockchainId, getReserves as getEOSReserves, getReservesCount as getEOSReservesCount } from './blockchains/eos';
import { getReserves as getEthReserves, getConverterBlockchainId as getEthConverterBlockchainId, getConverterSmartToken as getEthConverterSmartToken, getReserveBlockchainId as getEthereumReserveBlockchainId, getReservesCount as getEthReservesCount, getSmartTokens } from './blockchains/ethereum';

const ETHBlockchainId = '0xc0829421c1d260bd3cb3e0f06cfe2d52db2ce315';
const BNTBlockchainId = '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C';

const EOSAnchorToken: EOSToken = {
    tokenAccount: 'bntbntbntbnt',
    tokenSymbol: 'BNT'
};

const anchorTokens = {
    ethereum: BNTBlockchainId,
    eos: EOSAnchorToken
};

export interface ConversionPathsTokens {
    from: Token;
    to: Token;
}

export type BlockchainType = 'ethereum' | 'eos';

export interface ConversionPath {
    type: 'ethereum' | 'eos';
    path: string[];
}

export interface ConversionPathStep {
    converterBlockchainId: string;
    fromToken: string;
    toToken: string;
}

export interface ConversionPaths {
    paths: ConversionPath[];
}

export interface Token {
    ethereumBlockchainId?: string;
    blockchainType: BlockchainType;
    eosBlockchainId?: EOSToken;
}

function isAnchorToken(token: Token) {
    if (token.blockchainType == 'ethereum' && token.ethereumBlockchainId.toLowerCase() == ETHBlockchainId.toLowerCase())
        return true;
    if (token.blockchainType == 'eos' && token.eosBlockchainId.tokenAccount == anchorTokens['eos'].tokenAccount)
        return true;
    return false;
}

function getTokenBlockchainId(token: Token) {
    if (token.blockchainType == 'ethereum') return token.ethereumBlockchainId.toLowerCase();
    return token.eosBlockchainId.tokenAccount.toLowerCase();
}

function isReserveToken(reserveToken: Token, token: Token) {
    if (token.blockchainType == 'ethereum' && token.ethereumBlockchainId == reserveToken.ethereumBlockchainId)
        return true;
    if (token.blockchainType == 'eos' && token.eosBlockchainId.tokenAccount == reserveToken.eosBlockchainId.tokenAccount)
        return true;
    return false;
}

async function getConverterBlockchainId(token: Token) {
    if (token.blockchainType == 'ethereum')
        return await getEthConverterBlockchainId(token.ethereumBlockchainId);
    return await getEosConverterBlockchainId(token.eosBlockchainId);
}

async function getReserveCount(reserves, blockchainType: BlockchainType) {
    if (blockchainType == 'ethereum')
        return await getEthReservesCount(reserves);
    return await getEOSReservesCount(reserves);
}

async function getReserves(blockchainId, blockchainType: BlockchainType) {
    if (blockchainType == 'ethereum')
        return await getEthReserves(blockchainId);
    return await getEOSReserves(blockchainId);
}

async function getReserveToken(token, index, blockchainType: BlockchainType) {
    if (blockchainType == 'ethereum')
        return await getEthereumReserveBlockchainId(token, index);
    return await getEosReserveBlockchainId(token, index);
}

export async function getConverterToken(blockchainId, connector, blockchainType: BlockchainType) {
    if (blockchainType == 'ethereum') return await getEthConverterSmartToken(connector);
    return blockchainId;
}

export async function generatePathByBlockchainIds(sourceToken: Token, targetToken: Token) {
    const pathObjects: ConversionPaths = { paths: []};

    if (sourceToken.blockchainType == targetToken.blockchainType) {
        pathObjects.paths.push({ type: sourceToken.blockchainType, path: await getConversionPath(sourceToken, targetToken) });
    }
    else {
        pathObjects.paths.push({ type: sourceToken.blockchainType, path: await getConversionPath(sourceToken, null) });
        pathObjects.paths.push({ type: targetToken.blockchainType, path: await getConversionPath(null, targetToken) });
    }

    return pathObjects;
}

function getPath(from: Token, to: Token) {
    const blockchainType: BlockchainType = from ? from.blockchainType : to.blockchainType;
    const path: ConversionPathsTokens = {
        from: from ? { blockchainType, [`${blockchainType}BlockchainId`]: from[`${blockchainType}BlockchainId`] } : null,
        to: to ? { blockchainType, [`${blockchainType}BlockchainId`]: to[`${blockchainType}BlockchainId`] } : null
    };

    if (!path.to)
        path.to = { blockchainType, [`${blockchainType}BlockchainId`]: anchorTokens[`${blockchainType}`] };

    if (!path.from)
        path.from = { blockchainType, [`${blockchainType}BlockchainId`]: anchorTokens[`${blockchainType}`] };

    return path;
}

export async function getConversionPath(from: Token, to: Token) {
    const blockchainType = from ? from.blockchainType : to.blockchainType;

    const path = getPath(from, to);
    return findPath(path, blockchainType);
}

export async function findPath(pathObject: ConversionPathsTokens, blockchainType: BlockchainType) {
    const from = await getPathToAnchorByBlockchainId({ blockchainType: blockchainType, [`${blockchainType}BlockchainId`]: pathObject.from[`${blockchainType}BlockchainId`] }, { blockchainType, [`${blockchainType}BlockchainId`]: anchorTokens[blockchainType] });
    const to = await getPathToAnchorByBlockchainId({ blockchainType: blockchainType, [`${blockchainType}BlockchainId`]: pathObject.to[`${blockchainType}BlockchainId`] }, { blockchainType, [`${blockchainType}BlockchainId`]: anchorTokens[blockchainType] });
    return getShortestPath(from, to);
}

export async function getPathToAnchorByBlockchainId(token: Token, anchorToken: Token) {
    if (isAnchorToken(token))
        return [getTokenBlockchainId(token)];

    const smartTokens = token.blockchainType == 'eos' ? [token.eosBlockchainId.tokenAccount] : await getSmartTokens(token);
    let response = [];
    for (const smartToken of smartTokens) {
        const blockchainId = await getConverterBlockchainId(token.blockchainType == 'ethereum' ? { blockchainType: token.blockchainType, [`${token.blockchainType}BlockchainId`]: smartToken } : token);
        const { reserves } = await getReserves(blockchainId, token.blockchainType);
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
        while (i >= 0 && j >= 0 && sourcePath[i] == targetPath[j]) {
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
