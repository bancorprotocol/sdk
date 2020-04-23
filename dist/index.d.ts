import { Core } from './core';
import { Settings } from './types';
export declare class SDK {
    conversionPaths: any;
    history: any;
    pricing: any;
    utils: any;
    _core: Core;
    static create(settings: Settings): Promise<SDK>;
    static destroy(sdk: SDK): Promise<void>;
    refresh(): Promise<void>;
}
