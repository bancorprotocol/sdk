import { JsonRpc } from 'eosjs';
import { Token } from '../../path_generation';
export declare class EOS {
    jsonRpc: JsonRpc;
    constructor(nodeEndpoint: string);
    close(): void;
    init(): Promise<void>;
    getAnchorToken(): Token;
    getRateByPath(path: Token[], amount: string): Promise<string>;
    getConversionPath(from: Token, to: Token): Promise<Token[]>;
    getConverterVersion(converter: string): Promise<string>;
    buildPathsFile(): Promise<void>;
}
export declare const getReservesFromCode: (jsonRpc: any, code: any, symbol?: any) => Promise<any>;
export declare const getConverterSettings: (jsonRpc: any, code: any) => Promise<any>;
export declare const getSmartToken: (jsonRpc: any, code: any) => Promise<any>;
export declare const getSmartTokenSupply: (jsonRpc: any, account: any, code: any) => Promise<any>;
export declare const getReserveBalances: (jsonRpc: any, code: any, scope: any, table?: string) => Promise<any>;
export declare const getAnchorToken: () => Token;
export declare const getConvertibleTokens: (blockchainId: any) => any;
export declare const getSmartTokens: (blockchainId: any) => any;
