import { Token, Converter } from './path_generation';
export { init, generatePath, getRateByPath, getRate, getAllPathsAndRates, getEthShortestPath, getEthCheapestPath, retrieveConverterVersion, fetchConversionEvents, fetchConversionEventsByTimestamp, buildPathsFile };
interface Settings {
    ethereumNodeEndpoint: string;
    eosNodeEndpoint: string;
}
declare function init(args: Settings): Promise<void>;
declare function generatePath(sourceToken: Token, targetToken: Token, amount?: string, getEthBestPath?: (paths: string[][], rates: string[]) => string[]): Promise<Token[][]>;
declare function getRateByPath(paths: Token[][], amount: string): Promise<string>;
declare function getRate(sourceToken: Token, targetToken: Token, amount: string): Promise<string>;
declare function getAllPathsAndRates(sourceToken: Token, targetToken: Token, amount?: string): Promise<any[]>;
declare function retrieveConverterVersion(converter: Converter): Promise<{
    type: string;
    value: string;
}>;
declare function fetchConversionEvents(token: Token, fromBlock: any, toBlock: any): Promise<any[]>;
declare function fetchConversionEventsByTimestamp(token: Token, fromTimestamp: any, toTimestamp: any): Promise<any[]>;
declare function buildPathsFile(): Promise<void>;
declare function getEthShortestPath(paths: string[][], rates: string[]): string[];
declare function getEthCheapestPath(paths: string[][], rates: string[]): string[];
