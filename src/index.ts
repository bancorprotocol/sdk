import { Core } from './core';
import { ConversionPaths } from './conversion_paths';
import { History } from './history';
import { Pricing } from './pricing';
import { Utils } from './utils';
import { Settings } from './types';

/**
 * Main SDK object, should be instantiated using the `create` static method
 */
export class SDK {
    conversionPaths = null;
    history = null;
    pricing = null;
    utils = null;
    _core = new Core();

    /**
    * creates and initializes a new SDK object
    * should be called as the first step before using the SDK
    * 
    * @param settings   initialization settings
    * 
    * @returns  new SDK object
    */
    static async create(settings: Settings): Promise<SDK> {
        const sdk = new SDK();
        await sdk._core.create(settings);
        sdk.conversionPaths = new ConversionPaths(sdk._core);
        sdk.history = new History(sdk._core);
        sdk.pricing = new Pricing(sdk._core);
        sdk.utils = new Utils(sdk._core);
        return sdk;
    }

    /**
    * cleans up and destroys an existing SDK object
    * should be called as the last step after the SDK work is complete to free up resources
    * 
    * @param sdk   sdk object
    */
    static async destroy(sdk: SDK): Promise<void> {
        sdk.conversionPaths = null;
        sdk.history = null;
        sdk.pricing = null;
        sdk.utils = null;
        await sdk._core.destroy();
    }

    async refresh(): Promise<void> {
        await this._core.refresh();
    }
}
