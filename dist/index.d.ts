import { EOS } from './blockchains/eos/index';
import { Ethereum } from './blockchains/ethereum/index';
import { Token, Converter, ConversionEvent } from './path_generation';
export declare class SDK {
    eos: EOS;
    ethereum: Ethereum;
    static create({ eosNodeEndpoint, ethNodeEndpoint }?: {
        eosNodeEndpoint?: string;
        ethNodeEndpoint?: string;
    }): Promise<SDK>;
    static destroy(sdk: SDK): Promise<void>;
    getShortestPath(sourceToken: Token, targetToken: Token, amount?: string): Promise<Token[]>;
    getCheapestPath(sourceToken: Token, targetToken: Token, amount?: string): Promise<Token[]>;
    getShortestPathRate(sourceToken: Token, targetToken: Token, amount?: string): Promise<string>;
    getCheapestPathRate(sourceToken: Token, targetToken: Token, amount?: string): Promise<string>;
    getRateByPath(path: Token[], amount?: string): Promise<string>;
    getAllPathsAndRates(sourceToken: Token, targetToken: Token, amount?: string): Promise<{
        path: Token[];
        rate: string;
    }>;
    getConverterVersion(converter: Converter): Promise<string>;
    getConversionEvents(token: Token, fromBlock: number, toBlock: number): Promise<ConversionEvent[]>;
    getConversionEventsByTimestamp(token: Token, fromTimestamp: number, toTimestamp: number): Promise<ConversionEvent[]>;
    buildPathsFile(): Promise<void>;
}
