import Web3 from 'web3';
export declare class ETH {
    web3: Web3;
    networkType: string;
    bancorNetwork: Web3.eth.Contract;
    converterRegistry: Web3.eth.Contract;
    multicallContract: Web3.eth.Contract;
    decimals: {};
    init(nodeAddress: any): Promise<void>;
    getAnchorToken(): any;
    getRateByPath(path: any, amount: any): Promise<any>;
    getAllPathsAndRates(sourceToken: any, targetToken: any, amount: any): Promise<any[]>;
    retrieveConverterVersion(converter: any): Promise<{
        type: string;
        value: any;
    }>;
    fetchConversionEvents(token: any, fromBlock: any, toBlock: any): Promise<any[]>;
    fetchConversionEventsByTimestamp(token: any, fromTimestamp: any, toTimestamp: any): Promise<any[]>;
}
export declare const getContractAddresses: (_this: any) => any;
export declare const toWei: (_this: any, token: any, amount: any) => Promise<string>;
export declare const fromWei: (_this: any, token: any, amount: any) => Promise<string>;
export declare const getReturn: (_this: any, path: any, amount: any) => Promise<any>;
export declare const getDecimals: (_this: any, token: any) => Promise<any>;
export declare const getRates: (_this: any, paths: any, amount: any) => Promise<any>;
export declare const getGraph: (_this: any) => Promise<{}>;
