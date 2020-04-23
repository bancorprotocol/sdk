import { SDKModule } from './sdk_module';
import { Token } from './types';
export declare class Pricing extends SDKModule {
    getRate(sourceToken: Token, targetToken: Token, amount?: string): Promise<string>;
    getRateByPath(path: Token[], amount?: string): Promise<string>;
}
