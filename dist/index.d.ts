import { buildPathsFile } from './blockchains/eos';
import { Token, ConversionPaths } from './path_generation';
import { run as fetchConversionEvents } from './blockchains/ethereum/fetch_conversion_events';
import { run as retrieveContractVersion } from './blockchains/ethereum/retrieve_contract_version';
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
declare const _default: {
    init: typeof init;
    generateEosPaths: typeof generateEosPaths;
    getRate: typeof getRate;
    generatePath: typeof generatePath;
    getRateByPath: (paths: ConversionPaths, amount: any) => Promise<any>;
    buildPathsFile: typeof buildPathsFile;
    fetchConversionEvents: typeof fetchConversionEvents;
    retrieveContractVersion: typeof retrieveContractVersion;
};
export default _default;
