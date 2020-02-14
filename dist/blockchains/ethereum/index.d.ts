import { ConversionStep, Token } from '../../path_generation';
export declare const anchorToken: Token;
export declare function init(ethereumNodeUrl: any, ethereumContractRegistryAddress: any): Promise<void>;
export declare const getAmountInTokenWei: (token: Token, amount: string, web3: any) => Promise<string>;
export declare const getConversionReturn: (converterPair: ConversionStep, amount: string, ABI: any, web3: any) => Promise<any>;
export declare function getConversionSteps(path: Token[]): Promise<ConversionStep[]>;
export declare const getConverterBlockchainId: (token: Token) => Promise<any>;
export declare function getPathStepRate(converterPair: ConversionStep, amount: string): Promise<string>;
export declare function retrieveConverterVersion(converter: any): Promise<{
    type: string;
    value: any;
}>;
export declare function fetchConversionEvents(token: any, fromBlock: any, toBlock: any): Promise<any[]>;
export declare function fetchConversionEventsByTimestamp(token: any, fromTimestamp: any, toTimestamp: any): Promise<any[]>;
export declare function getAllPaths(sourceToken: any, targetToken: any): Promise<any[]>;
