/**
* blockchain types supported by the SDK
*/
export enum BlockchainType {
    Ethereum = 'ethereum',
    EOS = 'eos'
}

/**
* SDK initialization settings interface
*/
export interface Settings {
    /** web3 endpoint - optional, mandatory when interacting with an Ethereum blockchain */
    ethereumNodeEndpoint?: string | Object; // Object in order to allow an existing web3 provider
    /** eosjs endpoint - optional, mandatory when interacting with an EOS blockchain */
    eosNodeEndpoint?: string;
    /** timeout before auto-refresh */
    refreshTimeout?: number; // number of seconds before auto-refresh
}

/**
* Token interface
*/
export interface Token {
    /** token blockchain type **/
    blockchainType: BlockchainType;
    /** token blockchain id - address for Ethereum blockchain, account name for EOS blockchain **/
    blockchainId: string;
    /** token symbol - optional, mandatory for EOS tokens **/
    symbol?: string;
}

/**
* Converter interface
*/
export interface Converter {
    /** converter blockchain type **/
    blockchainType: BlockchainType;
    /** converter blockchain id - address for Ethereum blockchain, account name for EOS blockchain **/
    blockchainId: string;
    /** converter symbol - optional, mandatory for EOS tokens **/
    symbol?: string;
}

/**
* ConversionEvent interface
*/
export interface ConversionEvent {
    blockNumber: number;
    sourceToken: string;
    targetToken: string;
    inputAmount: string;
    outputAmount: string;
    conversionFee?: string;
    trader: string;
}

/**
* TokenRateEvent interface
*/
export interface TokenRateEvent {
    blockNumber: number;
    sourceToken: string;
    targetToken: string;
    tokenRate: string;
}

/** @internal */
export interface Blockchain {
    getAnchorToken(): Token
    getPaths(sourceToken: Token, targetToken: Token): Promise<Token[][]>;
    getRates(tokenPaths: Token[][], tokenAmounts: string[]): Promise<string[][]>;
    getConverterVersion(converter: Converter): Promise<string>;
    getConversionEvents(token: Token, fromBlock: number, toBlock: number): Promise<ConversionEvent[]>;
    getConversionEventsByTimestamp(token: Token, fromTimestamp: number, toTimestamp: number): Promise<ConversionEvent[]>;
    getTokenRateEvents(token: Token, fromBlock: number, toBlock: number): Promise<TokenRateEvent[]>;
    getTokenRateEventsByTimestamp(token: Token, fromTimestamp: number, toTimestamp: number): Promise<TokenRateEvent[]>;
}
