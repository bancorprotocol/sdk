export type BlockchainType = 'ethereum' | 'eos';

export interface Token {
    blockchainType: BlockchainType;
    blockchainId: string;
    symbol?: string;
}

export interface Converter {
    blockchainType: BlockchainType;
    blockchainId: string;
    symbol?: string;
}

export interface ConversionEvent {
    fromToken: string;
    toToken: string;
    trader: string;
    inputAmount: string;
    outputAmount: string;
    conversionFee?: string;
    blockNumber: number;
}
