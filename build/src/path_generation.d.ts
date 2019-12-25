import { EOSToken } from './blockchains/eos';
export interface ConversionPathsTokens {
    from: Token;
    to: Token;
}
export declare type BlockchainType = 'ethereum' | 'eos';
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
export declare function getConverterToken(blockchainId: any, connector: any, blockchainType: BlockchainType): Promise<any>;
export declare function generatePathByBlockchainIds(sourceToken: Token, targetToken: Token): Promise<ConversionPaths>;
export declare function getConversionPath(from: Token, to: Token): Promise<any[]>;
export declare function findPath(pathObject: ConversionPathsTokens, blockchainType: BlockchainType): Promise<any[]>;
export declare function getPathToAnchorByBlockchainId(token: Token, anchorToken: Token): any;
