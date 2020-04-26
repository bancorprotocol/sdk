import { SDKModule } from './sdk_module';
import { Token } from './types';

/**
 * The Pricing module provides access to pricing and rates logic for tokens in the bancor network
 */
export class Pricing extends SDKModule {
    /**
    * returns the cheapest rate between any two tokens in the bancor network
    * 
    * @param sourceToken    source token
    * @param targetToken    target token
    * @param amount         input amount in decimal string
    * 
    * @returns  rate between the source token and the target token in decimal string
    */
    async getRate(sourceToken: Token, targetToken: Token, amount: string = '1'): Promise<string> {
        const path = await this.core.getPath(sourceToken, targetToken, amount);
        return await this.getRateByPath(path, amount);
    }

    /**
    * returns the rate between any two tokens in the bancor network for a given conversion path
    * 
    * @param path    conversion path
    * @param amount  input amount in decimal string
    * 
    * @returns  rate between the first token in the path and the last token in the path in decimal string
    */
    async getRateByPath(path: Token[], amount: string = '1'): Promise<string> {
        if (path.length == 1)
            return amount;

        let bgn = 0;
        while (bgn < path.length) {
            const end = path.slice(bgn).findIndex(token => token.blockchainType != path[bgn].blockchainType) >>> 0;
            amount = await this.core.blockchains[path[bgn].blockchainType].getRateByPath(path.slice(bgn, end), amount);
            bgn = end;
        }
        return amount;
    }
}
