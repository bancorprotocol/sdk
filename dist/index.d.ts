import { EOS } from './blockchains/eos/index';
import { Ethereum } from './blockchains/ethereum/index';
import { Token, Converter } from './path_generation';
export declare class SDK {
    eos: EOS;
    ethereum: Ethereum;
    constructor({ eosNodeEndpoint, ethNodeEndpoint }?: {
        eosNodeEndpoint?: string;
        ethNodeEndpoint?: string;
    });
    close(): void;
    init(): Promise<void>;
    getShortestPath(sourceToken: Token, targetToken: Token, amount?: string): Promise<Token[]>;
    getCheapestPath(sourceToken: Token, targetToken: Token, amount?: string): Promise<Token[]>;
    getRateByPath(path: Token[], amount: string): Promise<string>;
    getShortestPathRate(sourceToken: Token, targetToken: Token, amount?: string): Promise<string>;
    getCheapestPathRate(sourceToken: Token, targetToken: Token, amount?: string): Promise<string>;
    getAllPathsAndRates(sourceToken: Token, targetToken: Token, amount?: string): Promise<{
        path: Token[];
        rate: string;
    }>;
    getConverterVersion(converter: Converter): Promise<string>;
    getConversionEvents(token: Token, fromBlock: number, toBlock: number): Promise<object[]>;
    getConversionEventsByTimestamp(token: Token, fromTimestamp: number, toTimestamp: number): Promise<object[]>;
    buildPathsFile(): Promise<void>;
}
