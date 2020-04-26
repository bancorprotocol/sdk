import { SDKModule } from './sdk_module';
import { Token } from './types';
/**
 * The ConversionPaths module provides an interface to path generation logic
 */
export declare class ConversionPaths extends SDKModule {
    /**
    * finds the cheapest path between any two tokens in the bancor network
    *
    * @param sourceToken    source token
    * @param targetToken    target token
    * @param amount         input amount in decimal string
    *
    * @returns  conversion path
    */
    getPath(sourceToken: Token, targetToken: Token, amount?: string): Promise<Token[]>;
}
