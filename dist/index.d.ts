import { Core } from './core';
import { History } from './history';
import { Pricing } from './pricing';
import { Utils } from './utils';
import { Settings } from './types';
/**
 * Main SDK object, should be instantiated using the `create` static method
 */
export declare class SDK {
    /** History module */
    history: History;
    /** Pricing module */
    pricing: Pricing;
    /** Utils module */
    utils: Utils;
    /** @internal */
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
    /**
    * refreshes the local cache with data from the converter registry
    * should be called periodically to support new pools
    */
    refresh(): Promise<void>;
}
