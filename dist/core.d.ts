import { Settings, Token } from './types';
export declare class Core {
    blockchains: {};
    create(settings: Settings): Promise<void>;
    destroy(): Promise<void>;
    refresh(): Promise<void>;
    getAllPathsAndRates(sourceToken: Token, targetToken: Token, amount?: string): Promise<[{
        path: Token[];
        rate: string;
    }]>;
    getPath(sourceToken: Token, targetToken: Token, amount: string): Promise<Token[]>;
}
