export declare type BlockchainType = 'ethereum' | 'eos';
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
export declare const getConverterBlockchainId: (token: Token) => Promise<any>;
export declare const getReserveCount: (reserves: any, blockchainType: BlockchainType) => Promise<any>;
export declare const getReserves: (blockchainId: any, blockchainType: BlockchainType, symbol: string, isMulti: boolean) => Promise<{
    reserves: any;
}>;
export declare const getReserveToken: (token: any, index: any, blockchainType: BlockchainType) => Promise<Token>;
export declare function getConverterToken(blockchainId: any, connector: any, blockchainType: BlockchainType): Promise<any>;
export declare function generatePathByBlockchainIds(sourceToken: Token, targetToken: Token, amount: string, getBestPath: (paths: string[], rates: string[]) => string[]): Promise<ConversionPaths>;
export declare function getConversionPath(from: Token, to: Token): Promise<any[]>;
export declare function findPath(pathObject: ConversionPathsTokens, blockchainType: BlockchainType): Promise<any[]>;
export declare function getPathToAnchorByBlockchainId(token: Token, anchorToken: Token): any;
export declare function ethGetShortestPath(paths: any, rates: any): any;
export declare function ethGetCheapestPath(paths: any, rates: any): any;
