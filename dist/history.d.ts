import { SDKModule } from './sdk_module';
import { ConversionEvent, TokenRateEvent, Token } from './types';
/**
 * The History module allows querying historical data in the bancor network
 */
export declare class History extends SDKModule {
    /**
    * returns all Conversion events for a given liquidity pool / liquid token between two block numbers
    *
    * @param token      smart token
    * @param fromBlock  start block number
    * @param toBlock    end block number
    *
    * @returns  list of Conversion events
    */
    getConversionEvents(token: Token, fromBlock: number, toBlock: number): Promise<ConversionEvent[]>;
    /**
    * returns all Conversion events for a given liquidity pool / liquid token between two points in time
    *
    * @param token          smart token
    * @param fromTimestamp  start time
    * @param toTimestamp    end time
    *
    * @returns  list of Conversion events
    */
    getConversionEventsByTimestamp(token: Token, fromTimestamp: number, toTimestamp: number): Promise<ConversionEvent[]>;
    /**
    * returns all TokenRate events for a given liquidity pool / liquid token between two block numbers
    *
    * @param token      smart token
    * @param fromBlock  start block number
    * @param toBlock    end block number
    *
    * @returns  list of TokenRate events
    */
    getTokenRateEvents(token: Token, fromBlock: number, toBlock: number): Promise<TokenRateEvent[]>;
    /**
    * returns all TokenRate events for a given liquidity pool / liquid token between two points in time
    *
    * @param token          smart token
    * @param fromTimestamp  start time
    * @param toTimestamp    end time
    *
    * @returns  list of TokenRate events
    */
    getTokenRateEventsByTimestamp(token: Token, fromTimestamp: number, toTimestamp: number): Promise<TokenRateEvent[]>;
}
