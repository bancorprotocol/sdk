export { init, getAnchorToken, getRateByPath, getAllPathsAndRates, retrieveConverterVersion, fetchConversionEvents, fetchConversionEventsByTimestamp };
declare function init(nodeAddress: any): Promise<void>;
declare function getAnchorToken(): any;
declare function getRateByPath(path: any, amount: any): Promise<any>;
declare function getAllPathsAndRates(sourceToken: any, targetToken: any, amount: any): Promise<any[]>;
declare function retrieveConverterVersion(converter: any): Promise<{
    type: string;
    value: any;
}>;
declare function fetchConversionEvents(token: any, fromBlock: any, toBlock: any): Promise<any[]>;
declare function fetchConversionEventsByTimestamp(token: any, fromTimestamp: any, toTimestamp: any): Promise<any[]>;
export declare const getContractAddresses: () => any;
export declare const toWei: (token: any, amount: any) => Promise<string>;
export declare const fromWei: (token: any, amount: any) => Promise<string>;
export declare const getReturn: (path: any, amount: any) => Promise<any>;
export declare const getDecimals: (token: any) => Promise<any>;
export declare const getRates: (paths: any, amount: any) => Promise<any>;
export declare const getGraph: () => Promise<{}>;
