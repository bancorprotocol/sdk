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

export async function getConverterToken(blockchainId, connector, blockchainType: BlockchainType) {
    if (blockchainType == 'ethereum') return await ethereum.getConverterSmartToken(connector);
    return blockchainId;
}

export async function generatePathByBlockchainIds(sourceToken: Token, targetToken: Token) {
    const pathObjects: ConversionPaths = { paths: []};
    let paths;

    switch (sourceToken.blockchainType + ',' + targetToken.blockchainType) {
        case 'eos,eos':
            pathObjects.paths.push({ type: 'eos', path: await getConversionPath(sourceToken, targetToken) });
            break;
        case 'ethereum,ethereum':
            paths = await ethereum.getAllPaths(sourceToken.blockchainId, targetToken.blockchainId);
            pathObjects.paths.push({ type: 'ethereum', path: paths.reduce((a, b) => a.length < b.length ? a : b)});
            break;
        case 'eos,ethereum':
            paths = await ethereum.getAllPaths(sourceToken.blockchainId, ethereum.anchorToken.blockchainId);
            pathObjects.paths.push({ type: 'eos', path: await getConversionPath(sourceToken, eos.anchorToken) });
            pathObjects.paths.push({ type: 'ethereum', path: paths.reduce((a, b) => a.length < b.length ? a : b)});
            break;
        case 'ethereum,eos':
            paths = await ethereum.getAllPaths(ethereum.anchorToken.blockchainId, targetToken.blockchainId);
            pathObjects.paths.push({ type: 'ethereum', path: paths.reduce((a, b) => a.length < b.length ? a : b)});
            pathObjects.paths.push({ type: 'eos', path: await getConversionPath(eos.anchorToken, targetToken) });
            break;
    }

    return pathObjects;
}

async function getConversionPath(from: Token, to: Token) {
    const sourcePath = await getPathToAnchorByBlockchainId(from, eos.anchorToken);
    const targetPath = await getPathToAnchorByBlockchainId(to, eos.anchorToken);
    return getShortestPath(sourcePath, targetPath);
}

async function getPathToAnchorByBlockchainId(token: Token, anchorToken: Token) {
    if (eos.isAnchorToken(token))
        return [eos.getTokenBlockchainId(token)];

    const isMulti = eos.isMultiConverter(token.blockchainId);

    for (const smartToken of token.blockchainId) {
        const blockchainId = await eos.getConverterBlockchainId(token);
        const converterBlockchainId = Object.values(blockchainId)[0];
        const reserveTokens = await eos.getReserveTokens(converterBlockchainId, token.symbol, isMulti);
        for (const reserveToken of reserveTokens.filter(reserveToken => reserveToken.blockchainId != token.blockchainId)) {
            const path = await getPathToAnchorByBlockchainId(reserveToken, anchorToken);
            if (path.length > 0)
                return [eos.getTokenBlockchainId(token), blockchainId, ...path];
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
