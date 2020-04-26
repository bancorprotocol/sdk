import { Core } from './core';
import { Settings } from './types';
/**
 * Main SDK object, should be instantiated using the `create` static method
 */
export declare class SDK {
    conversionPaths: any;
    history: any;
    pricing: any;
    utils: any;
    _core: Core;
    /**
    * creates and initializes a new SDK object
    * should be called as the first step before using the SDK
    *
    * @param settings   initialization settings
    *
    * @returns  new SDK object
    */
    static create(settings: Settings): Promise<SDK>;
    /**
    * cleans up and destroys an existing SDK object
    * should be called as the last step after the SDK work is complete to free up resources
    *
    * @param sdk   sdk object
    */
    static destroy(sdk: SDK): Promise<void>;
    refresh(): Promise<void>;
}
