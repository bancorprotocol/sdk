export declare const anchorToken = "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C";
export declare function init(ethereumNodeUrl: any, ethereumContractRegistryAddress: any): Promise<void>;
export declare const toWei: (token: any, amount: any) => Promise<string>;
export declare const fromWei: (token: any, amount: any) => Promise<string>;
export declare const getReturn: (smartToken: any, converterABI: any, fromToken: any, toToken: any, amount: any) => Promise<any>;
export declare function getPathStepRate(smartToken: any, fromToken: any, toToken: any, amount: any): Promise<string>;
export declare function retrieveConverterVersion(converter: any): Promise<{
    type: string;
    value: any;
}>;
export declare function fetchConversionEvents(token: any, fromBlock: any, toBlock: any): Promise<any[]>;
export declare function fetchConversionEventsByTimestamp(token: any, fromTimestamp: any, toTimestamp: any): Promise<any[]>;
export declare const getGraph: () => Promise<{}>;
export declare function getAllPaths(sourceToken: any, targetToken: any): Promise<any[]>;
