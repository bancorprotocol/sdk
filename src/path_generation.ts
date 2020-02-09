import * as eos from './blockchains/eos/index';
import * as ethereum from './blockchains/ethereum/index';

export type BlockchainType = 'ethereum' | 'eos';

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

export const getConverterBlockchainId = async (token: Token) => {
    if (token.blockchainType == 'ethereum')
        return await ethereum.getConverterBlockchainId(token.blockchainId);
    return await eos.getConverterBlockchainId(token);
};

export async function getConverterToken(blockchainId, connector, blockchainType: BlockchainType) {
    if (blockchainType == 'ethereum') return await ethereum.getConverterSmartToken(connector);
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
    const anchorToken = {eos, ethereum}[blockchainType].anchorToken;
    const path: ConversionPathsTokens = {
        from: from ? from : anchorToken,
        to: to ? to : anchorToken
    };
    return path;
}

export async function getConversionPath(from: Token, to: Token) {
    const blockchainType = from ? from.blockchainType : to.blockchainType;

    const path = getPath(from, to);
    return findPath(path, blockchainType);
}

export async function findPath(pathObject: ConversionPathsTokens, blockchainType: BlockchainType) {
    const anchorToken = {eos, ethereum}[blockchainType].anchorToken;
    const from = await getPathToAnchorByBlockchainId({ ...pathObject.from }, anchorToken);
    const to = await getPathToAnchorByBlockchainId({ ...pathObject.to }, anchorToken);
    return getShortestPath(from, to);
}

export async function getPathToAnchorByBlockchainId(token: Token, anchorToken: Token) {
    const module = {eos, ethereum}[token.blockchainType];
    if (module.isAnchorToken(token))
        return [module.getTokenBlockchainId(token)];

    const smartTokens = token.blockchainType == 'eos' ? [token.blockchainId] : await ethereum.getSmartTokens(token);
    const isMulti = token.blockchainType == 'eos' ? eos.isMultiConverter(token.blockchainId) : false;

    for (const smartToken of smartTokens) {
        const blockchainId = await getConverterBlockchainId(token.blockchainType == 'ethereum' ? { blockchainType: 'ethereum', blockchainId: smartToken } : token);
        const converterBlockchainId = token.blockchainType == 'ethereum' ? blockchainId : Object.values(blockchainId)[0];
        const reserveTokens = await {eos, ethereum}[token.blockchainType].getReserveTokens(converterBlockchainId, token.symbol, isMulti);
        for (const reserveToken of reserveTokens.filter(reserveToken => reserveToken.blockchainId != token.blockchainId)) {
            const path = await getPathToAnchorByBlockchainId(reserveToken, anchorToken);
            if (path.length > 0)
                return [module.getTokenBlockchainId(token), token.blockchainType == 'eos' ? blockchainId : smartToken, ...path];
        }
    }

    return [];
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
