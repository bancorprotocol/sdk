import { IEOSToken } from './blockchains/eos';
export interface IConversionPathsTokens {
    from: IToken;
    to: IToken;
}
export declare type IBlockchainType = 'ethereum' | 'eos';
export interface IConversionPath {
    type: 'ethereum' | 'eos';
    path: string[];
}
export interface IConversionPathStep {
    converterBlockchainId: string;
    fromToken: string;
    toToken: string;
}
export interface IConversionPaths {
    paths: IConversionPath[];
}
export interface IToken {
    ethereumBlockchainId?: string;
    blockchainType: IBlockchainType;
    eosBlockchainId?: IEOSToken;
}
export declare function getConverterToken(blockchainId: any, connector: any, blockchainType: IBlockchainType): Promise<any>;
export declare function generatePathByBlockchainIds(sourceToken: IToken, targetToken: IToken): Promise<IConversionPaths>;
export declare function getConversionPath(from: IToken, to: IToken): Promise<any[]>;
export declare function findPath(pathObject: IConversionPathsTokens, blockchainType: IBlockchainType): Promise<any[]>;
export declare function getPathToAnchorByBlockchainId(token: IToken, anchorToken: IToken): any;
