import { Settings, Token } from './types';
export declare class Core {
    blockchains: {};
    create(settings: Settings): Promise<void>;
    destroy(): Promise<void>;
    refresh(): Promise<void>;
    getPaths(sourceToken: Token, targetToken: Token): Promise<Token[][]>;
    getRates(paths: Token[][], amount?: string): Promise<string[]>;
    private pathType;
    private pathForm;
}
