import { JsonRpc } from 'eosjs';
import { Token } from '../../path_generation';
interface Reserve {
    contract: string;
    currency: string;
    ratio: number;
}
export declare class EOS {
    jsonRpc: JsonRpc;
    constructor(nodeAddress: string);
    close(): void;
    getAnchorToken(): Token;
    getConversionPath(from: Token, to: Token): Promise<any[]>;
    getRateByPath(path: any, amount: any): Promise<any>;
    buildPathsFile(): Promise<void>;
}
export declare const getReservesFromCode: (jsonRpc: any, code: any, symbol?: any) => Promise<any>;
export declare const getConverterSettings: (jsonRpc: any, code: any) => Promise<any>;
export declare const getSmartToken: (jsonRpc: any, code: any) => Promise<any>;
export declare const getSmartTokenSupply: (jsonRpc: any, account: any, code: any) => Promise<any>;
export declare const isMultiConverter: (blockchhainId: any) => any;
export declare const getReserveBalances: (jsonRpc: any, code: any, scope: any, table?: string) => Promise<any>;
export declare const getReserveTokenSymbol: (reserve: Reserve) => any;
export declare function getSymbol(string: any): any;
export declare function getBalance(string: any): any;
export declare function getConverterBlockchainId(token: Token): any;
export {};
