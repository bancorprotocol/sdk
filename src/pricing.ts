import { SDKModule } from './sdk_module';
import { Token } from './types';

export class Pricing extends SDKModule {
    async getRate(sourceToken: Token, targetToken: Token, amount: string = '1'): Promise<string> {
        const path = await this.core.getPath(sourceToken, targetToken, amount);
        return await this.getRateByPath(path, amount);
    }

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
