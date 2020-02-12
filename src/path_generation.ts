import * as eos from './blockchains/eos/index';
import * as ethereum from './blockchains/ethereum/index';

export type BlockchainType = 'ethereum' | 'eos';

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

export async function generatePathByBlockchainIds(sourceToken: Token, targetToken: Token) {
    const pathObjects: ConversionPaths = { paths: []};
    let paths;

    switch (sourceToken.blockchainType + ',' + targetToken.blockchainType) {
        case 'eos,eos':
            pathObjects.paths.push({ type: 'eos', path: await eos.getConversionPath(sourceToken, targetToken) });
            break;
        case 'ethereum,ethereum':
            paths = await ethereum.getAllPaths(sourceToken.blockchainId, targetToken.blockchainId);
            pathObjects.paths.push({ type: 'ethereum', path: paths.reduce((a, b) => a.length < b.length ? a : b)});
            break;
        case 'eos,ethereum':
            paths = await ethereum.getAllPaths(sourceToken.blockchainId, ethereum.anchorToken.blockchainId);
            pathObjects.paths.push({ type: 'eos', path: await eos.getConversionPath(sourceToken, eos.anchorToken) });
            pathObjects.paths.push({ type: 'ethereum', path: paths.reduce((a, b) => a.length < b.length ? a : b)});
            break;
        case 'ethereum,eos':
            paths = await ethereum.getAllPaths(ethereum.anchorToken.blockchainId, targetToken.blockchainId);
            pathObjects.paths.push({ type: 'ethereum', path: paths.reduce((a, b) => a.length < b.length ? a : b)});
            pathObjects.paths.push({ type: 'eos', path: await eos.getConversionPath(eos.anchorToken, targetToken) });
            break;
    }

    return pathObjects;
}
