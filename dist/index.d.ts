import { buildPathsFile } from './blockchains/eos';
import { Token, ConversionPaths } from './path_generation';
interface Settings {
    ethereumNodeEndpoint: string;
    eosNodeEndpoint: string;
}
export declare function init({ ethereumNodeEndpoint, eosNodeEndpoint }: Settings): Promise<void>;
export declare function generateEosPaths(): Promise<void>;
export declare function generatePath(sourceToken: Token, targetToken: Token): Promise<ConversionPaths>;
export declare function getRateByPath(paths: ConversionPaths, amount: any): Promise<any>;
export declare function getRate(sourceToken: Token, targetToken: Token, amount: string): Promise<any>;
declare const _default: {
    init: typeof init;
    generateEosPaths: typeof generateEosPaths;
    getRate: typeof getRate;
    generatePath: typeof generatePath;
    getRateByPath: typeof getRateByPath;
    buildPathsFile: typeof buildPathsFile;
};
export default _default;
