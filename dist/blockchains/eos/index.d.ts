import { JsonRpc } from 'eosjs';
import { Token, Converter, ConversionEvent } from '../../types';
export declare class EOS {
    jsonRpc: JsonRpc;
    static create(nodeEndpoint: string): Promise<EOS>;
    static destroy(eos: EOS): Promise<void>;
    refresh(): Promise<void>;
    getAnchorToken(): Token;
    getPath(from: Token, to: Token): Promise<Token[]>;
    getRateByPath(path: Token[], amount: string): Promise<string>;
    getRate(from: Token, to: Token, amount: string): Promise<string>;
    getConverterVersion(converter: Converter): Promise<string>;
    getConversionEvents(token: Token, fromBlock: number, toBlock: number): Promise<ConversionEvent[]>;
    getConversionEventsByTimestamp(token: Token, fromTimestamp: number, toTimestamp: number): Promise<ConversionEvent[]>;
    private getConverterSettings;
    private getSmartTokenStat;
    private getReserves;
    private getReserveBalance;
    private getReserve;
    private getBalance;
    private getSymbol;
    private getDecimals;
    private getConversionRate;
    private getTokenSmartTokens;
    private getPathToAnchor;
    private getShortestPath;
}
