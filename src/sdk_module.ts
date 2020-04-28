import { Core } from './core';

export class SDKModule {
    public core = null;

    constructor(core: Core) {
        this.core = core;
    }
}
