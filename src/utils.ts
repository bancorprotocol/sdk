import { SDKModule } from './sdk_module';
import { Converter } from './types';

/**
 * The Utils module provides various utility and helper functions
 */
export class Utils extends SDKModule {
    /**
    * returns the version number of a converter in the bancor network
    * 
    * @param converter    converter
    * 
    * @returns  converter version
    */
    async getConverterVersion(converter: Converter): Promise<string> {
        return await this.core.blockchains[converter.blockchainType].getConverterVersion(converter);
    }
}
