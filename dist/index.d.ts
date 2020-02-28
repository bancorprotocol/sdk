import { ETH } from './blockchains/ethereum/index';
import { Token, Converter } from './path_generation';
interface Settings {
    ethereumNodeEndpoint: string;
    eosNodeEndpoint: string;
}
export declare class SDK {
    ethereum: ETH;
    init(args: Settings): Promise<void>;
    generatePath(sourceToken: Token, targetToken: Token, { amount, getEthBestPath }?: {
        amount?: string;
        getEthBestPath?: (paths: string[][], rates: string[]) => string[];
    }): Promise<Token[][]>;
    getRateByPath(paths: Token[][], amount: string): Promise<string>;
    getRate(sourceToken: Token, targetToken: Token, amount: string): Promise<string>;
    getAllPathsAndRates(sourceToken: Token, targetToken: Token, amount?: string): Promise<{
        path: Token[];
        rate: string;
    }>;
    retrieveConverterVersion(converter: Converter): Promise<{
        type: string;
        value: string;
    }>;
    fetchConversionEvents(token: Token, fromBlock: any, toBlock: any): Promise<any[]>;
    fetchConversionEventsByTimestamp(token: Token, fromTimestamp: any, toTimestamp: any): Promise<any[]>;
    buildPathsFile(): Promise<void>;
    getEthShortestPath(paths: string[][], rates: string[]): string[];
    getEthCheapestPath(paths: string[][], rates: string[]): string[];
}
export {};
