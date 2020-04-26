import { Settings, BlockchainType, Token, Blockchain } from './types';
export declare class Core {
    blockchains: Partial<Record<BlockchainType, Blockchain>>;
    create(settings: Settings): Promise<void>;
    destroy(): Promise<void>;
    refresh(): Promise<void>;
    getPaths(sourceToken: Token, targetToken: Token): Promise<Token[][]>;
    getRates(paths: Token[][], amount?: string): Promise<string[]>;
    private pathType;
    private pathForm;
}
