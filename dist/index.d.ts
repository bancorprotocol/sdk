import { Token, Converter } from './path_generation';
export { init, generatePath, getRateByPath, getRate, getAllPaths, retrieveConverterVersion, fetchConversionEvents, fetchConversionEventsByTimestamp, buildPathsFile };
interface Settings {
    ethereumNodeEndpoint: string;
    eosNodeEndpoint: string;
}
declare function init(args: Settings): Promise<void>;
declare function generatePath(sourceToken: Token, targetToken: Token): Promise<any[]>;
declare function getRateByPath(paths: Token[][], amount: any): Promise<any>;
declare function getRate(sourceToken: Token, targetToken: Token, amount: string): Promise<any>;
declare function getAllPaths(sourceToken: Token, targetToken: Token): Promise<any[]>;
declare function retrieveConverterVersion(converter: Converter): Promise<{
    type: string;
    value: any;
}>;
declare function fetchConversionEvents(token: Token, fromBlock: any, toBlock: any): Promise<any[]>;
declare function fetchConversionEventsByTimestamp(token: Token, fromTimestamp: any, toTimestamp: any): Promise<any[]>;
declare function buildPathsFile(): Promise<void>;
