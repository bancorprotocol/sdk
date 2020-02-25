import { buildPathsFile } from './blockchains/eos';
import { Token, ConversionPaths } from './path_generation';
interface Settings {
    ethereumNodeEndpoint: string;
    eosNodeEndpoint: string;
    ethereumContractRegistryAddress?: string;
}
export declare function init(args: Settings): Promise<void>;
export declare function generateEosPaths(): Promise<void>;
export declare function generatePath(sourceToken: Token, targetToken: Token, amount?: string, getBestPath?: (paths: string[][], rates: string[]) => string[]): Promise<ConversionPaths>;
export declare const calculateRateFromPaths: (paths: ConversionPaths, amount: any) => any;
export declare function calculateRateFromPath(paths: ConversionPaths, amount: any): Promise<any>;
export declare const getRateByPath: (paths: ConversionPaths, amount: any) => Promise<any>;
export declare function getRate(sourceToken: Token, targetToken: Token, amount: string): Promise<any>;
export declare function getAllPathsAndRates(sourceToken: Token, targetToken: Token, amount?: string): Promise<any[]>;
export declare function getEthShortestPath(paths: string[][], rates: string[]): string[];
export declare function getEthCheapestPath(paths: string[][], rates: string[]): string[];
declare const _default: {
    init: typeof init;
    generateEosPaths: typeof generateEosPaths;
    getRate: typeof getRate;
    generatePath: typeof generatePath;
    getRateByPath: (paths: ConversionPaths, amount: any) => Promise<any>;
    buildPathsFile: typeof buildPathsFile;
    getAllPathsAndRates: typeof getAllPathsAndRates;
    getEthShortestPath: typeof getEthShortestPath;
    getEthCheapestPath: typeof getEthCheapestPath;
};
export default _default;
