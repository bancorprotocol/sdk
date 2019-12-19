import { IConversionPathStep, IToken } from '../../path_generation';
export declare function init(ethereumNodeUrl: any): Promise<void>;
export declare function getPathStepRate(converterPair: IConversionPathStep, amount: string): Promise<any>;
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
export declare function getReserveBlockchainId(converter: any, position: any): Promise<IToken>;
export declare function getConverterSmartToken(converter: any): Promise<any>;
export declare function getReserveToken(converterContract: any, i: any): Promise<IToken>;
export declare function getSmartTokens(token: IToken): Promise<any>;
