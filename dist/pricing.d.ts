import { SDKModule } from './sdk_module';
import { Token } from './types';
/**
 * The Pricing module provides access to pricing and rates logic for tokens in the bancor network
 */
export declare class Pricing extends SDKModule {
    /**
    * returns the best conversion path and rate for a given pair of tokens in the bancor network
    *
    * @param sourceToken    source token
    * @param targetToken    target token
    * @param amount         input amount
    *
    * @returns  the best path and rate between the source token and the target token
    */
    getPathAndRate(sourceToken: Token, targetToken: Token, amount?: string): Promise<{
        path: Token[];
        rate: string;
    }>;
    /**
    * returns the best conversion paths and rates for a given pair of tokens and input amounts in the bancor network
    *
    * @param sourceToken    source token
    * @param targetToken    target token
    * @param amounts         input amounts
    *
    * @returns  the best paths and rates between the source token and the target token for each input amount
    */
    getPathsAndRates(sourceToken: Token, targetToken: Token, amounts?: string[]): Promise<Array<{
        path: Token[];
        rate: string;
    }>>;
    /**
    * returns the rate for a given conversion path in the bancor network
    *
    * @param path    conversion path
    * @param amount  input amount
    *
    * @returns  output amount for a conversion on the given path
    */
    getRateByPath(path: Token[], amount?: string): Promise<string>;
}
