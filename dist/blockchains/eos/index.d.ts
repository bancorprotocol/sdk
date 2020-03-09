import { JsonRpc } from 'eosjs';
import { Token, Converter, ConversionEvent } from '../../types';
export declare class EOS {
    jsonRpc: JsonRpc;
    static create(nodeEndpoint: string): Promise<EOS>;
    static destroy(eos: EOS): Promise<void>;
    getAnchorToken(): Token;
    getPath(from: Token, to: Token): Promise<Token[]>;
    getRateByPath(path: Token[], amount: string): Promise<string>;
    getConverterVersion(converter: Converter): Promise<string>;
    getConversionEvents(token: Token, fromBlock: number, toBlock: number): Promise<ConversionEvent[]>;
    getConversionEventsByTimestamp(token: Token, fromTimestamp: number, toTimestamp: number): Promise<ConversionEvent[]>;
    buildPathsFile(): Promise<void>;
}
export declare const getReservesFromCode: (jsonRpc: any, code: any, symbol: any) => Promise<any>;
export declare const getConverterSettings: (jsonRpc: any, code: any) => Promise<any>;
export declare const getSmartToken: (jsonRpc: any, code: any) => Promise<any>;
export declare const getSmartTokenSupply: (jsonRpc: any, account: any, code: any) => Promise<any>;
export declare const getReserveBalances: (jsonRpc: any, code: any, scope: any, table: any) => Promise<any>;
export declare const getAnchorToken: () => Token;
export declare const getConvertibleTokens: (blockchainId: any) => any;
export declare const getSmartTokens: (blockchainId: any) => any;
