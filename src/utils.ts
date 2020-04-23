import { SDKModule } from './sdk_module';
import { Converter } from './types';

export class Utils extends SDKModule {
    async getConverterVersion(converter: Converter): Promise<string> {
        return await this.core.blockchains[converter.blockchainType].getConverterVersion(converter);
    }
}
