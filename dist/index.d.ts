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
    * creates an initializes a new SDK object
    *
    * @param settings   initialization settings
    */
    static create(settings: Settings): Promise<SDK>;
    /**
    * deinitializes and destroys an existing SDK object
    *
    * @param sdk   sdk object
    */
    static destroy(sdk: SDK): Promise<void>;
    refresh(): Promise<void>;
}
