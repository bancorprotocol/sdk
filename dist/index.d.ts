import { EOS } from './blockchains/eos/index';
import { ETH } from './blockchains/ethereum/index';
import { Token, Converter } from './path_generation';
export declare class SDK {
    eth: ETH;
    eos: EOS;
    constructor({ eosNodeAddress, ethNodeAddress }?: {
        eosNodeAddress?: string;
        ethNodeAddress?: string;
    });
    close(): void;
    init(): Promise<void>;
    generatePath(sourceToken: Token, targetToken: Token, { amount, getBestPath }?: {
        amount?: string;
        getBestPath?: (paths: string[][], rates: string[]) => string[];
    }): Promise<Token[][]>;
    getRateByPath(paths: Token[][], amount: string): Promise<string>;
    getRate(sourceToken: Token, targetToken: Token, amount: string): Promise<string>;
    getAllPathsAndRates(sourceToken: Token, targetToken: Token, amount?: string): Promise<{
        path: Token[];
        rate: string;
    }>;
    getConverterVersion(converter: Converter): Promise<{
        type: string;
        value: string;
    }>;
    getConversionEvents(token: Token, fromBlock: any, toBlock: any): Promise<any[]>;
    getConversionEventsByTimestamp(token: Token, fromTimestamp: any, toTimestamp: any): Promise<any[]>;
    buildPathsFile(): Promise<void>;
    getShortestPath(paths: string[][], rates: string[]): string[];
    getCheapestPath(paths: string[][], rates: string[]): string[];
}
