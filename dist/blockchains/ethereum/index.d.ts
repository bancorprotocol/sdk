import Web3 from 'web3';
import { Token, Converter } from '../../path_generation';
export declare class Ethereum {
    web3: Web3;
    networkType: string;
    bancorNetwork: Web3.eth.Contract;
    converterRegistry: Web3.eth.Contract;
    multicallContract: Web3.eth.Contract;
    decimals: {};
    constructor(nodeEndpoint: any);
    close(): void;
    init(): Promise<void>;
    getAnchorToken(): any;
    getRateByPath(path: Token[], amount: string): Promise<string>;
    getAllPathsAndRates(sourceToken: any, targetToken: any, amount: any): Promise<any[]>;
    getConverterVersion(converter: Converter): Promise<string>;
    getConversionEvents(token: Token, fromBlock: number, toBlock: number): Promise<object[]>;
    getConversionEventsByTimestamp(token: Token, fromTimestamp: number, toTimestamp: number): Promise<object[]>;
}
export declare const getContractAddresses: (_this: any) => any;
export declare const getReturn: (_this: any, path: any, amount: any) => Promise<any>;
export declare const getDecimals: (_this: any, token: any) => Promise<any>;
export declare const getRates: (_this: any, paths: any, amount: any) => Promise<any>;
export declare const getGraph: (_this: any) => Promise<{}>;
