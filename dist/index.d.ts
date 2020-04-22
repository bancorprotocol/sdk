import { Ethereum } from './blockchains/ethereum/index';
import { EOS } from './blockchains/eos/index';
import { Settings, Token, Converter, ConversionEvent } from './types';
export declare class SDK {
    ethereum: Ethereum;
    eos: EOS;
    static create(settings: Settings): Promise<SDK>;
    static destroy(sdk: SDK): Promise<void>;
    refresh(): Promise<void>;
    getShortestPath(sourceToken: Token, targetToken: Token, amount?: string): Promise<Token[]>;
    getCheapestPath(sourceToken: Token, targetToken: Token, amount?: string): Promise<Token[]>;
    getShortestPathRate(sourceToken: Token, targetToken: Token, amount?: string): Promise<string>;
    getCheapestPathRate(sourceToken: Token, targetToken: Token, amount?: string): Promise<string>;
    getRateByPath(path: Token[], amount?: string): Promise<string>;
    getAllPathsAndRates(sourceToken: Token, targetToken: Token, amount?: string): Promise<[{
        path: Token[];
        rate: string;
    }]>;
    getShortestPathAndRate(sourceToken: Token, targetToken: Token, amount?: string): Promise<{
        path: Token[];
        rate: string;
    }>;
    getCheapestPathAndRate(sourceToken: Token, targetToken: Token, amount?: string): Promise<{
        path: Token[];
        rate: string;
    }>;
    getConverterVersion(converter: Converter): Promise<string>;
    getConversionEvents(token: Token, fromBlock: number, toBlock: number): Promise<ConversionEvent[]>;
    getConversionEventsByTimestamp(token: Token, fromTimestamp: number, toTimestamp: number): Promise<ConversionEvent[]>;
}
