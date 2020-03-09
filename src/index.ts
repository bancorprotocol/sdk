import { EOS } from './blockchains/eos/index';
import { Ethereum } from './blockchains/ethereum/index';
import { Settings, Token, Converter, ConversionEvent } from './types';

export class SDK {
    eos: EOS;
    ethereum: Ethereum;

    static async create(settings: Settings): Promise<SDK> {
        const sdk = new SDK();
        if (settings.eosNodeEndpoint)
            sdk.eos = await EOS.create(settings.eosNodeEndpoint);
        if (settings.ethereumNodeEndpoint)
            sdk.ethereum = await Ethereum.create(settings.ethereumNodeEndpoint);
        return sdk;
    }

    static async destroy(sdk: SDK): Promise<void> {
        if (sdk.eos)
            await EOS.destroy(sdk.eos);
        if (sdk.ethereum)
            await Ethereum.destroy(sdk.ethereum);
    }

    async getShortestPath(sourceToken: Token, targetToken: Token, amount: string = '1'): Promise<Token[]> {
        return await getPath(this, sourceToken, targetToken, amount, getShortestPath);
    }

    async getCheapestPath(sourceToken: Token, targetToken: Token, amount: string = '1'): Promise<Token[]> {
        return await getPath(this, sourceToken, targetToken, amount, getCheapestPath);
    }

    async getShortestPathRate(sourceToken: Token, targetToken: Token, amount: string = '1'): Promise<string> {
        const path = await this.getShortestPath(sourceToken, targetToken, amount);
        return await this.getRateByPath(path, amount);
    }

    async getCheapestPathRate(sourceToken: Token, targetToken: Token, amount: string = '1'): Promise<string> {
        const path = await this.getCheapestPath(sourceToken, targetToken, amount);
        return await this.getRateByPath(path, amount);
    }

    async getRateByPath(path: Token[], amount: string = '1'): Promise<string> {
        let bgn = 0;
        while (bgn < path.length) {
            const end = path.slice(bgn).findIndex(token => token.blockchainType != path[bgn].blockchainType) >>> 0;
            amount = await this[path[bgn].blockchainType].getRateByPath(path.slice(bgn, end), amount);
            bgn = end;
        }
        return amount;
    }

    async getAllPathsAndRates(sourceToken: Token, targetToken: Token, amount: string = '1'): Promise<{path: Token[], rate: string}> {
        if (sourceToken.blockchainType == 'ethereum' && targetToken.blockchainType == 'ethereum') {
            const [paths, rates] = await this.ethereum.getAllPathsAndRates(sourceToken.blockchainId, targetToken.blockchainId, amount);
            return paths.map((path, i) => ({path: path.map(x => ({blockchainType: 'ethereum', blockchainId: x})), rate: rates[i]}));
        }
        throw new Error(sourceToken.blockchainType + ' blockchain to ' + targetToken.blockchainType + ' blockchain not supported');
    }

    async getConverterVersion(converter: Converter): Promise<string> {
        return await this[converter.blockchainType].getConverterVersion(converter);
    }

    async getConversionEvents(token: Token, fromBlock: number, toBlock: number): Promise<ConversionEvent[]> {
        return await this[token.blockchainType].getConversionEvents(token, fromBlock, toBlock);
    }

    async getConversionEventsByTimestamp(token: Token, fromTimestamp: number, toTimestamp: number): Promise<ConversionEvent[]> {
        return await this[token.blockchainType].getConversionEventsByTimestamp(token, fromTimestamp, toTimestamp);
    }

    async buildPathsFile(): Promise<void> {
        await this.eos.buildPathsFile();
    }
}

async function getPath(sdk: SDK, sourceToken: Token, targetToken: Token, amount: string, getBestPath: (paths: string[][], rates: string[]) => string[]): Promise<Token[]> {
    let eosPath;
    let ethPaths;
    let ethRates;

    switch (sourceToken.blockchainType + ',' + targetToken.blockchainType) {
    case 'eos,eos':
        eosPath = await sdk.eos.getPath(sourceToken, targetToken);
        return eosPath;
    case 'eos,ethereum':
        eosPath = await sdk.eos.getPath(sourceToken, sdk.eos.getAnchorToken());
        [ethPaths, ethRates] = await sdk.ethereum.getAllPathsAndRates(sdk.ethereum.getAnchorToken(), targetToken.blockchainId, amount);
        return [...eosPath, ...getBestPath(ethPaths, ethRates).map(x => ({blockchainType: 'ethereum', blockchainId: x}))];
    case 'ethereum,eos':
        [ethPaths, ethRates] = await sdk.ethereum.getAllPathsAndRates(sourceToken.blockchainId, sdk.ethereum.getAnchorToken(), amount);
        eosPath = await sdk.eos.getPath(sdk.eos.getAnchorToken(), targetToken);
        return [...getBestPath(ethPaths, ethRates).map(x => ({blockchainType: 'ethereum', blockchainId: x})), ...eosPath];
    case 'ethereum,ethereum':
        [ethPaths, ethRates] = await sdk.ethereum.getAllPathsAndRates(sourceToken.blockchainId, targetToken.blockchainId, amount);
        return getBestPath(ethPaths, ethRates).map(x => ({blockchainType: 'ethereum', blockchainId: x}));
    }

    throw new Error(sourceToken.blockchainType + ' blockchain to ' + targetToken.blockchainType + ' blockchain not supported');
}

function getShortestPath(paths: string[][], rates: string[]): string[] {
    let index = 0;
    for (let i = 1; i < paths.length; i++) {
        if (betterPath(paths, index, i) || (equalPath(paths, index, i) && betterRate(rates, index, i)))
            index = i;
    }
    return paths[index];
}

function getCheapestPath(paths: string[][], rates: string[]): string[] {
    let index = 0;
    for (let i = 1; i < rates.length; i++) {
        if (betterRate(rates, index, i) || (equalRate(rates, index, i) && betterPath(paths, index, i)))
            index = i;
    }
    return paths[index];
}

function betterPath(paths: string[][], index1: number, index2: number): boolean {
    return paths[index1].length > paths[index2].length;
}

function betterRate(rates: string[], index1: number, index2: number): boolean {
    // return Number(rates[index1]) < Number(rates[index2]);
    const rate1 = rates[index1].split('.').concat('');
    const rate2 = rates[index2].split('.').concat('');
    rate1[0] = rate1[0].padStart(rate2[0].length, '0');
    rate2[0] = rate2[0].padStart(rate1[0].length, '0');
    rate1[1] = rate1[1].padEnd(rate2[1].length, '0');
    rate2[1] = rate2[1].padEnd(rate1[1].length, '0');
    return rate1.join('') < rate2.join('');
}

function equalPath(paths: string[][], index1: number, index2: number): boolean {
    return paths[index1].length == paths[index2].length;
}

function equalRate(rates: string[], index1: number, index2: number): boolean {
    return rates[index1] == rates[index2];
}
