import Web3 from 'web3';
import { Blockchain, Converter, ConversionEvent, TokenRateEvent, Token } from '../../types';
export declare class Ethereum implements Blockchain {
    web3: Web3;
    contractAddresses: object;
    networkType: string;
    bancorNetwork: Web3.eth.Contract;
    converterRegistry: Web3.eth.Contract;
    multicallContract: Web3.eth.Contract;
    decimals: object;
    graph: object;
    trees: object;
    getPathsFunc: (sourceToken: string, targetToken: string) => string[][];
    static create(nodeEndpoint: string | Object): Promise<Ethereum>;
    static destroy(ethereum: Ethereum): Promise<void>;
    refresh(): Promise<void>;
    getAnchorToken(): Token;
    getPaths(sourceToken: Token, targetToken: Token): Promise<Token[][]>;
    /**
     * @param tokenPaths paths to get rates for
     * @param tokenAmounts input amounts to get rates for
     * @returns The rates for each path in order, grouped by input amounts in order
     */
    getRates(tokenPaths: Token[][], tokenAmounts: string[]): Promise<string[][]>;
    getConverterVersion(converter: Converter): Promise<string>;
    getConversionEvents(token: Token, fromBlock: number, toBlock: number): Promise<ConversionEvent[]>;
    getConversionEventsByTimestamp(token: Token, fromTimestamp: number, toTimestamp: number): Promise<ConversionEvent[]>;
    getTokenRateEvents(token: Token, fromBlock: number, toBlock: number): Promise<TokenRateEvent[]>;
    getTokenRateEventsByTimestamp(token: Token, fromTimestamp: number, toTimestamp: number): Promise<TokenRateEvent[]>;
    getAllPathsFunc(sourceToken: string, targetToken: string): string[][];
    getSomePathsFunc(sourceToken: string, targetToken: string): string[][];
}
export declare const getWeb3: (nodeEndpoint: any) => any;
export declare const getContractAddresses: (ethereum: any) => any;
export declare const getDecimals: (ethereum: any, token: any) => Promise<any>;
export declare const getRates: (ethereum: any, paths: any, amounts: any) => Promise<string[][]>;
export declare const getTokens: (ethereum: any) => Promise<any>;
