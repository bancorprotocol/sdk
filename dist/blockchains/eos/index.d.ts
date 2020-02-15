import { ConversionStep, Token } from '../../path_generation';
interface Reserve {
    contract: string;
    currency: string;
    ratio: number;
}
export declare function init(endpoint: any): void;
export declare function getAnchorToken(): Token;
export declare function isAnchorToken(token: Token): boolean;
export declare function getTokenBlockchainId(token: Token): {
    [x: string]: string;
};
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
export declare function getConversionSteps(path: Token[]): Promise<ConversionStep[]>;
export declare function getConversionRate(step: ConversionStep, amount: string): Promise<any>;
export declare function getConverterBlockchainId(token: Token): Promise<any>;
export declare function getConversionPath(from: Token, to: Token): Promise<any[]>;
export {};
