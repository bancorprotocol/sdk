import { ConversionPathStep, Token } from '../../path_generation';
interface Reserve {
    contract: string;
    currency: string;
    ratio: number;
}
export declare function initEOS(endpoint: any): void;
export declare function getEosjsRpc(): any;
export declare const getReservesFromCode: (code: any, symbol?: any) => Promise<any>;
export declare const getConverterSettings: (code: any) => Promise<any>;
export declare const getConverterFeeFromSettings: (code: any) => Promise<any>;
export declare function getSmartToken(code: any): Promise<any>;
export declare const getSmartTokenSupply: (account: any, code: any) => Promise<any>;
export declare const isMultiConverter: (blockchhainId: any) => any;
export declare const getReserveBalances: (code: any, scope: any, table?: string) => Promise<any>;
export declare const getReserveTokenSymbol: (reserve: Reserve) => any;
export declare function getSymbol(string: any): any;
export declare function getBalance(string: any): any;
export declare function buildPathsFile(): Promise<void>;
export declare function getPathStepRate(pair: ConversionPathStep, amount: string): Promise<number>;
export declare function getConverterBlockchainId(token: Token): Promise<any>;
export declare function getReserveBlockchainId(reserves: Token[], position: any): Promise<Token>;
export declare function getReserves(converterBlockchainId: any, symbol: any, isMulti?: boolean): Promise<{
    reserves: any[];
}>;
export declare function getReservesCount(reserves: Token[]): Promise<number>;
export {};
