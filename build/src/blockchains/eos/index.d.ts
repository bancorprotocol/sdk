import { IConversionPathStep, IToken } from '../../path_generation';
interface IReserve {
    contract: string;
    currency: string;
    ratio: number;
}
export interface IEOSToken {
    tokenAccount: string;
    tokenSymbol: string;
}
export declare function initEOS(endpoint: any): void;
export declare function getEosjsRpc(): any;
export declare function getReservesFromCode(code: any): Promise<any>;
export declare function getConverterSettings(code: any): Promise<any>;
export declare function getSmartToken(code: any): Promise<any>;
export declare function getSmartTokenSupply(account: any, code: any): Promise<any>;
export declare function getReserveBalances(code: any, scope: any): Promise<any>;
export declare function getReserveTokenSymbol(reserve: IReserve): any;
export declare function getSymbol(string: any): any;
export declare function getBalance(string: any): any;
export declare function buildPathsFile(): Promise<void>;
export declare function getPathStepRate(pair: IConversionPathStep, amount: string): Promise<number>;
export declare function getConverterBlockchainId(token: IEOSToken): Promise<any>;
export declare function getReserveBlockchainId(reserves: IEOSToken[], position: any): Promise<IToken>;
export declare function getReserves(converterBlockchainId: any): Promise<{
    reserves: any[];
}>;
export declare function getReservesCount(reserves: IEOSToken[]): Promise<number>;
export {};
