import { SDKModule } from './sdk_module';
import { ConversionEvent, Token } from './types';

export class History extends SDKModule {
    async getConversionEvents(token: Token, fromBlock: number, toBlock: number): Promise<ConversionEvent[]> {
        return await this.core.blockchains[token.blockchainType].getConversionEvents(token, fromBlock, toBlock);
    }

    async getConversionEventsByTimestamp(token: Token, fromTimestamp: number, toTimestamp: number): Promise<ConversionEvent[]> {
        return await this.core.blockchains[token.blockchainType].getConversionEventsByTimestamp(token, fromTimestamp, toTimestamp);
    }
}
