import { buildPathsFile } from './blockchains/eos';
import { testConversionTypes } from '../example/example';
import { Token, ConversionPaths } from './path_generation';
interface Settings {
    ethereumNodeEndpointUrl: string;
    eosNodeEndpointUrl: string;
}
export declare function init({ ethereumNodeEndpointUrl, eosNodeEndpointUrl }: Settings): Promise<void>;
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
    testConversionTypes: typeof testConversionTypes;
};
export default _default;
