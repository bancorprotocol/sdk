import { SDKModule } from './sdk_module';
import { Token } from './types';

export class ConversionPaths extends SDKModule {
    async getPath(sourceToken: Token, targetToken: Token, amount: string = '1'): Promise<Token[]> {
        return await this.core.getPath(sourceToken, targetToken, amount);
    }
}
