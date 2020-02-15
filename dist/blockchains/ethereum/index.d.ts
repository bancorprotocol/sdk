export { init, getAnchorToken, getConversionRate, getAllPaths, retrieveConverterVersion, fetchConversionEvents, fetchConversionEventsByTimestamp };
declare function init(nodeAddress: any, contractRegistryAddress: any): Promise<void>;
declare function getAnchorToken(): string;
declare function getConversionRate(smartToken: any, fromToken: any, toToken: any, amount: any): Promise<string>;
declare function getAllPaths(sourceToken: any, targetToken: any): Promise<any[]>;
declare function retrieveConverterVersion(converter: any): Promise<{
    type: string;
    value: any;
}>;
declare function fetchConversionEvents(token: any, fromBlock: any, toBlock: any): Promise<any[]>;
declare function fetchConversionEventsByTimestamp(token: any, fromTimestamp: any, toTimestamp: any): Promise<any[]>;
export declare const toWei: (token: any, amount: any) => Promise<string>;
export declare const fromWei: (token: any, amount: any) => Promise<string>;
export declare const getReturn: (smartToken: any, converterABI: any, fromToken: any, toToken: any, amount: any) => Promise<any>;
export declare const getGraph: () => Promise<{}>;
