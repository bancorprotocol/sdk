export declare type BlockchainType = 'ethereum' | 'eos';
export interface ConversionPath {
    type: BlockchainType;
    path: Token[];
}
export interface ConversionToken {
    [key: string]: string;
}
export interface ConversionPathStep {
    converterBlockchainId: string | ConversionToken;
    fromToken: string | ConversionToken;
    toToken: string | ConversionToken;
}
export interface Token {
    blockchainType: BlockchainType;
    blockchainId: string;
    symbol?: string;
}
