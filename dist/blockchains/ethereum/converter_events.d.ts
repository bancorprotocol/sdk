import { ConversionEvent, TokenRateEvent } from '../../types';
export declare function getConversionEvents(web3: any, decimals: any, token: any, fromBlock: any, toBlock: any): Promise<ConversionEvent[]>;
export declare function getTokenRateEvents(web3: any, decimals: any, token: any, fromBlock: any, toBlock: any): Promise<TokenRateEvent[]>;
