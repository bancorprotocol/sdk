import * as eos from './blockchains/eos/index';
import * as ethereum from './blockchains/ethereum/index';

export type BlockchainType = 'ethereum' | 'eos';

export interface ConversionPath {
    type: BlockchainType;
    path: string[] | ConversionToken[];
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
