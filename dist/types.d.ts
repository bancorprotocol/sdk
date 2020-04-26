/**
* blockchain types supported by the SDK
*/
export declare enum BlockchainType {
    Ethereum = "ethereum",
    EOS = "eos"
}
/**
* SDK initialization settings
*/
export interface Settings {
    ethereumNodeEndpoint?: string | Object;
    eosNodeEndpoint?: string;
}
/**
* Token object
*/
export interface Token {
    blockchainType: BlockchainType;
    blockchainId: string;
    symbol?: string;
}
/**
* Converter object
*/
export interface Converter {
    blockchainType: BlockchainType;
    blockchainId: string;
    symbol?: string;
}
/**
* ConversionEvent object
*/
export interface ConversionEvent {
    fromToken: string;
    toToken: string;
    trader: string;
    inputAmount: string;
    outputAmount: string;
    conversionFee?: string;
    blockNumber: number;
}
