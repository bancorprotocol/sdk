import { SDKModule } from './sdk_module';
import { ConversionEvent, Token } from './types';
export declare class History extends SDKModule {
    getConversionEvents(token: Token, fromBlock: number, toBlock: number): Promise<ConversionEvent[]>;
    getConversionEventsByTimestamp(token: Token, fromTimestamp: number, toTimestamp: number): Promise<ConversionEvent[]>;
}
