import { Token, Converter } from './path_generation';
export { init, generatePath, getRateByPath, getRate, getAllPathsAndRates, getEthShortestPath, getEthCheapestPath, retrieveConverterVersion, fetchConversionEvents, fetchConversionEventsByTimestamp, buildPathsFile };
interface Settings {
    ethereumNodeEndpoint: string;
    eosNodeEndpoint: string;
}
declare function init(args: Settings): Promise<void>;
declare function generatePath(sourceToken: Token, targetToken: Token, getEthBestPath?: (paths: string[], rates: string[]) => string[]): Promise<any[]>;
declare function getRateByPath(paths: Token[][], amount: string): Promise<string>;
declare function getRate(sourceToken: Token, targetToken: Token, amount: string): Promise<string>;
declare function getAllPathsAndRates(sourceToken: Token, targetToken: Token): Promise<any[]>;
declare function retrieveConverterVersion(converter: Converter): Promise<{
    type: string;
    value: any;
}>;
declare function fetchConversionEvents(token: Token, fromBlock: any, toBlock: any): Promise<any[]>;
declare function fetchConversionEventsByTimestamp(token: Token, fromTimestamp: any, toTimestamp: any): Promise<any[]>;
declare function buildPathsFile(): Promise<void>;
declare function getEthShortestPath(paths: any, rates: any): any;
declare function getEthCheapestPath(paths: any, rates: any): any;
