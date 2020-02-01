import { buildPathsFile } from './blockchains/eos';
import { Token, Contract, ConversionPaths } from './path_generation';
interface Settings {
    ethereumNodeEndpoint: string;
    eosNodeEndpoint: string;
    ethereumContractRegistryAddress?: string;
}
export declare function init(args: Settings): Promise<void>;
export declare function generateEosPaths(): Promise<void>;
export declare function generatePath(sourceToken: Token, targetToken: Token): Promise<ConversionPaths>;
export declare const calculateRateFromPaths: (paths: ConversionPaths, amount: any) => any;
export declare function calculateRateFromPath(paths: ConversionPaths, amount: any): Promise<any>;
export declare const getRateByPath: (paths: ConversionPaths, amount: any) => Promise<any>;
export declare function getRate(sourceToken: Token, targetToken: Token, amount: string): Promise<any>;
export declare function fetchConversionEvents(nodeAddress: any, token: Token, fromBlock: any, toBlock: any): Promise<any[]>;
export declare function fetchConversionEventsByTimestamp(nodeAddress: any, token: Token, fromTimestamp: any, toTimestamp: any): Promise<any[]>;
export declare function retrieveContractVersion(nodeAddress: any, contract: Contract): Promise<{
    type: string;
    value: any;
}>;
declare const _default: {
    init: typeof init;
    generateEosPaths: typeof generateEosPaths;
    getRate: typeof getRate;
    generatePath: typeof generatePath;
    getRateByPath: (paths: ConversionPaths, amount: any) => Promise<any>;
    buildPathsFile: typeof buildPathsFile;
    fetchConversionEvents: typeof fetchConversionEvents;
    fetchConversionEventsByTimestamp: typeof fetchConversionEventsByTimestamp;
    retrieveContractVersion: typeof retrieveContractVersion;
};
export default _default;
