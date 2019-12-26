import { ConversionPathStep, Token } from '../../path_generation';
interface Reserve {
    contract: string;
    currency: string;
    ratio: number;
}
export interface EOSToken {
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
export declare function getReserveTokenSymbol(reserve: Reserve): any;
export declare function getSymbol(string: any): any;
export declare function getBalance(string: any): any;
export declare function buildPathsFile(): Promise<void>;
export declare function getPathStepRate(pair: ConversionPathStep, amount: string): Promise<number>;
export declare function getConverterBlockchainId(token: EOSToken): Promise<any>;
export declare function getReserveBlockchainId(reserves: EOSToken[], position: any): Promise<Token>;
export declare function getReserves(converterBlockchainId: any): Promise<{
    reserves: any[];
}>;
export declare function getReservesCount(reserves: EOSToken[]): Promise<number>;
export {};
