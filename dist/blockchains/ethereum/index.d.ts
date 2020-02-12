import { ConversionPathStep, Token } from '../../path_generation';
export declare const anchorToken: Token;
export declare function init(ethereumNodeUrl: any, ethereumContractRegistryAddress?: string): Promise<void>;
export declare function isAnchorToken(token: Token): boolean;
export declare function getTokenBlockchainId(token: Token): string;
export declare const getAmountInTokenWei: (token: string, amount: string, web3: any) => Promise<string>;
export declare const getConversionReturn: (converterPair: ConversionPathStep, amount: string, ABI: any, web3: any) => Promise<any>;
export declare function getPathStepRate(converterPair: ConversionPathStep, amount: string): Promise<string>;
export declare const getConverterBlockchainId: (blockchainId: any) => Promise<any>;
export declare function retrieveContractVersion(contract: any): Promise<{
    type: string;
    value: any;
}>;
export declare function fetchConversionEvents(token: any, fromBlock: any, toBlock: any): Promise<any[]>;
export declare function fetchConversionEventsByTimestamp(token: any, fromTimestamp: any, toTimestamp: any): Promise<any[]>;
export declare function getAllPaths(sourceToken: any, targetToken: any): Promise<any[]>;
