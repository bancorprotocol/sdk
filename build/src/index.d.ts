import { buildPathsFile } from './blockchains/eos';
import { testConversionTypes } from '../example/example';
import { IToken, IConversionPaths } from './path_generation';
interface ISettings {
    ethereumNodeEndpointUrl: string;
    eosNodeEndpointUrl: string;
}
export declare function init({ ethereumNodeEndpointUrl, eosNodeEndpointUrl }: ISettings): Promise<void>;
export declare function generateEosPaths(): Promise<void>;
export declare function generatePath(sourceToken: IToken, targetToken: IToken): Promise<IConversionPaths>;
export declare function getRateByPath(paths: IConversionPaths, amount: any): Promise<any>;
export declare function getRate(sourceToken: IToken, targetToken: IToken, amount: string): Promise<any>;
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
