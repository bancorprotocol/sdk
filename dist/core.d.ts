import { Settings, BlockchainType, Token, Blockchain } from './types';
export declare class Core {
    blockchains: Partial<Record<BlockchainType, Blockchain>>;
    refreshTimeout: number;
    refreshTimestamp: number;
    create(settings: Settings): Promise<void>;
    destroy(): Promise<void>;
    refresh(): Promise<void>;
    /**
     * @param sourceToken input token
     * @param targetToken output token
     * @param amounts input amounts in token decimals
     * @returns The best rate and corresponding path for each input amount
     */
    getPathsAndRates(sourceToken: Token, targetToken: Token, amounts?: string[]): Promise<Array<{
        path: Token[];
        rate: string;
    }>>;
    getRateByPath(path: Token[], amount?: string): Promise<string>;
    private refreshIfNeeded;
    private getPaths;
    private getRates;
    private static getBest;
    private static betterRate;
    private static equalRate;
    private static betterPath;
}
