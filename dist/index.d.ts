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
    getRateByPath(path: Token[], amount: string): Promise<string>;
    getRate(sourceToken: Token, targetToken: Token, amount: string): Promise<string>;
    getAllPathsAndRates(sourceToken: Token, targetToken: Token, amount?: string): Promise<{
        path: Token[];
        rate: string;
    }>;
    getConverterVersion(converter: Converter): Promise<string>;
    getConversionEvents(token: Token, fromBlock: number, toBlock: number): Promise<object[]>;
    getConversionEventsByTimestamp(token: Token, fromTimestamp: number, toTimestamp: number): Promise<object[]>;
    buildPathsFile(): Promise<void>;
    generatePath(sourceToken: Token, targetToken: Token, { amount, getBestPath }?: {
        amount?: string;
        getBestPath?: (paths: string[][], rates: string[]) => string[];
    }): Promise<Token[]>;
    getShortestPath(paths: string[][], rates: string[]): string[];
    getCheapestPath(paths: string[][], rates: string[]): string[];
}
