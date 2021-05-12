import { JsonRpc } from 'eosjs';
import { Blockchain, Converter, ConversionEvent, TokenRateEvent, Token } from '../../types';
export declare class EOS implements Blockchain {
    jsonRpc: JsonRpc;
    static create(nodeEndpoint: string): Promise<EOS>;
    static destroy(eos: EOS): Promise<void>;
    refresh(): Promise<void>;
    getAnchorToken(): Token;
    getPaths(from: Token, to: Token): Promise<Token[][]>;
    getRates(paths: Token[][], amounts: string[]): Promise<string[][]>;
    getConverterVersion(converter: Converter): Promise<string>;
    getConversionEvents(token: Token, fromBlock: number, toBlock: number): Promise<ConversionEvent[]>;
    getConversionEventsByTimestamp(token: Token, fromTimestamp: number, toTimestamp: number): Promise<ConversionEvent[]>;
    getTokenRateEvents(token: Token, fromBlock: number, toBlock: number): Promise<TokenRateEvent[]>;
    getTokenRateEventsByTimestamp(token: Token, fromTimestamp: number, toTimestamp: number): Promise<TokenRateEvent[]>;
    private getRateByPath;
    private getConverterSettings;
    private getSmartTokenStat;
    private getReserves;
    private getReserveBalance;
    private getConversionRate;
    private getTokenSmartTokens;
    private getPathToAnchor;
    private static getShortestPath;
    private static getReserve;
    private static getBalance;
    private static getSymbol;
    private static getDecimals;
}
