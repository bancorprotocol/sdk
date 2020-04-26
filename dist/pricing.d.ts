import { SDKModule } from './sdk_module';
import { Token } from './types';
/**
 * The Pricing module provides access to pricing and rates logic for tokens in the bancor network
 */
export declare class Pricing extends SDKModule {
    /**
    * returns the cheapest rate between any two tokens in the bancor network
    *
    * @param sourceToken    source token
    * @param targetToken    target token
    * @param amount         input amount in decimal string
    *
    * @returns  rate between the source token and the target token in decimal string
    */
    getRate(sourceToken: Token, targetToken: Token, amount?: string): Promise<string>;
    /**
    * returns the rate between any two tokens in the bancor network for a given conversion path
    *
    * @param path    conversion path
    * @param amount  input amount in decimal string
    *
    * @returns  rate between the first token in the path and the last token in the path in decimal string
    */
    getRateByPath(path: Token[], amount?: string): Promise<string>;
}
