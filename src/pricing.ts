import { SDKModule } from './sdk_module';
import { Token } from './types';

/**
 * The Pricing module provides access to pricing and rates logic for tokens in the bancor network
 */
export class Pricing extends SDKModule {
    /**
    * returns the best conversion path and rate for a given pair of tokens in the bancor network
    * 
    * @param sourceToken    source token
    * @param targetToken    target token
    * @param amount         input amount
    * 
    * @returns  the best path and rate between the source token and the target token
    */
    async getPathAndRate(sourceToken: Token, targetToken: Token, amount: string = '1'): Promise<{path: Token[], rate: string}> {
        return (await this.core.getPathsAndRates(sourceToken, targetToken, [amount]))[0];
    }

    /**
    * returns the best conversion paths and rates for a given pair of tokens and input amounts in the bancor network
    * 
    * @param sourceToken    source token
    * @param targetToken    target token
    * @param amounts         input amounts
    * 
    * @returns  the best paths and rates between the source token and the target token for each input amount
    */
   async getPathsAndRates(sourceToken: Token, targetToken: Token, amounts: string[] = ['1']): Promise<Array<{path: Token[], rate: string}>> {
    return await this.core.getPathsAndRates(sourceToken, targetToken, amounts);
}

    /**
    * returns the rate for a given conversion path in the bancor network 
    * 
    * @param path    conversion path
    * @param amount  input amount
    * 
    * @returns  output amount for a conversion on the given path
    */
    async getRateByPath(path: Token[], amount: string = '1'): Promise<string> {
        return await this.core.getRateByPath(path, amount);
    }
}
