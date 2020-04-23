import { SDKModule } from './sdk_module';
import { Token } from './types';
export declare class ConversionPaths extends SDKModule {
    getPath(sourceToken: Token, targetToken: Token, amount?: string): Promise<Token[]>;
}
