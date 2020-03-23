import { buildPathsFile } from './blockchains/eos';
import { Token, ConversionPaths } from './path_generation';
interface Settings {
    ethereumNodeEndpoint: string;
    eosNodeEndpoint: string;
    ethereumContractRegistryAddress?: string;
}
export declare function init(args: Settings): Promise<void>;
export declare function deinit(): Promise<void>;
export declare function generateEosPaths(): Promise<void>;
export declare function generatePath(sourceToken: Token, targetToken: Token, amount?: string, getBestPath?: typeof getCheapestPath): Promise<ConversionPaths>;
export declare const calculateRateFromPaths: (paths: ConversionPaths, amount: any) => any;
export declare function calculateRateFromPath(paths: ConversionPaths, amount: any): Promise<any>;
export declare const getRateByPath: (paths: ConversionPaths, amount: any) => Promise<any>;
export declare function getRate(sourceToken: Token, targetToken: Token, amount: string): Promise<any>;
export declare function getAllPathsAndRates(sourceToken: Token, targetToken: Token, amount?: string): Promise<any[]>;
declare function getShortestPath(paths: string[][], rates: string[]): string[];
declare function getCheapestPath(paths: string[][], rates: string[]): string[];
declare const _default: {
    init: typeof init;
    deinit: typeof deinit;
    generateEosPaths: typeof generateEosPaths;
    getRate: typeof getRate;
    generatePath: typeof generatePath;
    getRateByPath: (paths: ConversionPaths, amount: any) => Promise<any>;
    buildPathsFile: typeof buildPathsFile;
    getAllPathsAndRates: typeof getAllPathsAndRates;
    getShortestPath: typeof getShortestPath;
    getCheapestPath: typeof getCheapestPath;
};
export default _default;
