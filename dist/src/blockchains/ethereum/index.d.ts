import { ConversionPathStep, Token } from '../../path_generation';
export declare function init(ethereumNodeUrl: any): Promise<void>;
export declare function getPathStepRate(converterPair: ConversionPathStep, amount: string): Promise<any>;
export declare function getRegistry(): Promise<any>;
export declare function getConverterBlockchainId(blockchainId: any): Promise<any>;
export declare function getSourceAndTargetTokens(srcToken: string, trgToken: string): {
    srcToken: string;
    trgToken: string;
};
export declare function getReserves(converterBlockchainId: any): Promise<{
    reserves: any;
}>;
export declare function getReservesCount(reserves: any): Promise<any>;
export declare function getReserveBlockchainId(converter: any, position: any): Promise<Token>;
export declare function getConverterSmartToken(converter: any): Promise<any>;
export declare function getReserveToken(converterContract: any, i: any): Promise<Token>;
export declare function getSmartTokens(token: Token): Promise<any>;
