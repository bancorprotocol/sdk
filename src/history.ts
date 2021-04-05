import { SDKModule } from './sdk_module';
import { ConversionEvent, TokenRateEvent, Token } from './types';

/**
 * The History module allows querying historical data in the bancor network
 */
export class History extends SDKModule {
    /**
    * returns all Conversion events for a given liquidity pool / liquid token between two block numbers
    * 
    * @param token      smart token
    * @param fromBlock  start block number
    * @param toBlock    end block number
    * 
    * @returns  list of Conversion events
    */
    async getConversionEvents(token: Token, fromBlock: number, toBlock: number): Promise<ConversionEvent[]> {
        return await this.core.blockchains[token.blockchainType].getConversionEvents(token, fromBlock, toBlock);
    }

    /**
    * returns all Conversion events for a given liquidity pool / liquid token between two points in time
    * 
    * @param token          smart token
    * @param fromTimestamp  start time
    * @param toTimestamp    end time
    * 
    * @returns  list of Conversion events
    */
    async getConversionEventsByTimestamp(token: Token, fromTimestamp: number, toTimestamp: number): Promise<ConversionEvent[]> {
        return await this.core.blockchains[token.blockchainType].getConversionEventsByTimestamp(token, fromTimestamp, toTimestamp);
    }

    /**
    * returns all TokenRate events for a given liquidity pool / liquid token between two block numbers
    * 
    * @param token      smart token
    * @param fromBlock  start block number
    * @param toBlock    end block number
    * 
    * @returns  list of TokenRate events
    */
    async getTokenRateEvents(token: Token, fromBlock: number, toBlock: number): Promise<TokenRateEvent[]> {
        return await this.core.blockchains[token.blockchainType].getTokenRateEvents(token, fromBlock, toBlock);
    }

    /**
    * returns all TokenRate events for a given liquidity pool / liquid token between two points in time
    * 
    * @param token          smart token
    * @param fromTimestamp  start time
    * @param toTimestamp    end time
    * 
    * @returns  list of TokenRate events
    */
    async getTokenRateEventsByTimestamp(token: Token, fromTimestamp: number, toTimestamp: number): Promise<TokenRateEvent[]> {
        return await this.core.blockchains[token.blockchainType].getTokenRateEventsByTimestamp(token, fromTimestamp, toTimestamp);
    }
}
