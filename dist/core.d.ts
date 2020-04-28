import { Settings, BlockchainType, Token, Blockchain } from './types';
export declare class Core {
    blockchains: Partial<Record<BlockchainType, Blockchain>>;
    create(settings: Settings): Promise<void>;
    destroy(): Promise<void>;
    refresh(): Promise<void>;
    getPathAndRate(sourceToken: Token, targetToken: Token, amount?: string): Promise<{
        path: Token[];
        rate: string;
    }>;
    getRateByPath(path: Token[], amount?: string): Promise<string>;
    private getPaths;
    private getRates;
    private static getBest;
    private static betterRate;
    private static equalRate;
    private static betterPath;
}
