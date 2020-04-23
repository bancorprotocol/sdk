import { SDKModule } from './sdk_module';
import { Converter } from './types';
export declare class Utils extends SDKModule {
    getConverterVersion(converter: Converter): Promise<string>;
}
