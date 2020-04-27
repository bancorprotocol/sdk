import { SDKModule } from './sdk_module';
import { Token } from './types';

/**
 * The Pricing module provides access to pricing and rates logic for tokens in the bancor network
 */
export class Pricing extends SDKModule {
    /**
    * returns the best conversion path for a given pair of tokens in the bancor network, along with its rate
    * this function currently does not support tokens of different blockchains; use `getRateByPath` instead
    * 
    * @param sourceToken    source token
    * @param targetToken    target token
    * @param amount         input amount
    * 
    * @returns  the best rate between the source token and the target token, along with the conversion path used to produce that rate
    */
    async getPathAndRate(sourceToken: Token, targetToken: Token, amount: string = '1'): Promise<{path: Token[], rate: string}> {
        return await this.core.getPathAndRate(sourceToken, targetToken, amount);
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
