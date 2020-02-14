import { Token, Converter } from './path_generation';
interface Settings {
    ethereumNodeEndpoint: string;
    eosNodeEndpoint: string;
    ethereumContractRegistryAddress?: string;
}
export declare function init(args: Settings): Promise<void>;
export declare function buildPathsFile(): Promise<void>;
export declare function generatePath(sourceToken: Token, targetToken: Token): Promise<any[]>;
export declare function getRateByPath(paths: Token[][], amount: any): Promise<any>;
export declare function getRate(sourceToken: Token, targetToken: Token, amount: string): Promise<any>;
export declare function retrieveConverterVersion(converter: Converter): Promise<{
    type: string;
    value: any;
}>;
export declare function fetchConversionEvents(token: Token, fromBlock: any, toBlock: any): Promise<any[]>;
export declare function fetchConversionEventsByTimestamp(token: Token, fromTimestamp: any, toTimestamp: any): Promise<any[]>;
export declare function getAllPaths(sourceToken: Token, targetToken: Token): Promise<any[]>;
declare const _default: {
    init: typeof init;
    getRate: typeof getRate;
    generatePath: typeof generatePath;
    getRateByPath: typeof getRateByPath;
    buildPathsFile: typeof buildPathsFile;
    retrieveConverterVersion: typeof retrieveConverterVersion;
    fetchConversionEvents: typeof fetchConversionEvents;
    fetchConversionEventsByTimestamp: typeof fetchConversionEventsByTimestamp;
    getAllPaths: typeof getAllPaths;
};
export default _default;
