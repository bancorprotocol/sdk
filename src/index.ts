import { EOS } from './blockchains/eos/index';
import { Ethereum } from './blockchains/ethereum/index';
import { Token, Converter } from './path_generation';

export class SDK {
    eos: EOS;
    ethereum: Ethereum;

    constructor({eosNodeEndpoint = "", ethNodeEndpoint = ""} = {}) {
        this.eos = new EOS(eosNodeEndpoint);
        this.ethereum = new Ethereum(ethNodeEndpoint);
    }

    close() {
        this.eos.close();
        this.ethereum.close();
    }

    async init() {
        await this.ethereum.init();
    }

    async generatePath(sourceToken: Token, targetToken: Token, {amount = '1', getBestPath = this.getCheapestPath} = {}): Promise<Token[][]> {
        let eosPath;
        let ethPaths;
        let ethRates;

        switch (sourceToken.blockchainType + ',' + targetToken.blockchainType) {
        case 'eos,eos':
            eosPath = await this.eos.getConversionPath(sourceToken, targetToken);
            return [eosPath];
        case 'ethereum,ethereum':
            [ethPaths, ethRates] = await this.ethereum.getAllPathsAndRates(sourceToken.blockchainId, targetToken.blockchainId, amount);
            return [getBestPath(ethPaths, ethRates).map(x => ({blockchainType: 'ethereum', blockchainId: x}))];
        case 'eos,ethereum':
            eosPath = await this.eos.getConversionPath(sourceToken, this.eos.getAnchorToken());
            [ethPaths, ethRates] = await this.ethereum.getAllPathsAndRates(this.ethereum.getAnchorToken(), targetToken.blockchainId, amount);
            return [eosPath, getBestPath(ethPaths, ethRates).map(x => ({blockchainType: 'ethereum', blockchainId: x}))];
        case 'ethereum,eos':
            [ethPaths, ethRates] = await this.ethereum.getAllPathsAndRates(sourceToken.blockchainId, this.ethereum.getAnchorToken(), amount);
            eosPath = await this.eos.getConversionPath(this.eos.getAnchorToken(), targetToken);
            return [getBestPath(ethPaths, ethRates).map(x => ({blockchainType: 'ethereum', blockchainId: x})), eosPath];
        }

        throw new Error(sourceToken.blockchainType + ' blockchain to ' + targetToken.blockchainType + ' blockchain not supported');
    }

    async getRateByPath(paths: Token[][], amount: string): Promise<string> {
        for (const path of paths) {
            switch (path[0].blockchainType) {
            case 'eos':
                amount = await this.eos.getRateByPath(path, amount);
                break;
            case 'ethereum':
                amount = await this.ethereum.getRateByPath(path.map(token => token.blockchainId), amount);
                break;
            default:
                throw new Error(path[0].blockchainType + ' blockchain not supported');
            }
        }
        return amount;
    }

    async getRate(sourceToken: Token, targetToken: Token, amount: string): Promise<string> {
        const paths = await this.generatePath(sourceToken, targetToken);
        return await this.getRateByPath(paths, amount);
    }

    async getAllPathsAndRates(sourceToken: Token, targetToken: Token, amount: string = '1'): Promise<{path: Token[], rate: string}> {
        if (sourceToken.blockchainType == 'ethereum' && targetToken.blockchainType == 'ethereum') {
            const [paths, rates] = await this.ethereum.getAllPathsAndRates(sourceToken.blockchainId, targetToken.blockchainId, amount);
            return paths.map((path, i) => ({path: path.map(x => ({blockchainType: 'ethereum', blockchainId: x})), rate: rates[i]}));
        }
        throw new Error(sourceToken.blockchainType + ' blockchain to ' + targetToken.blockchainType + ' blockchain not supported');
    }

    async getConverterVersion(converter: Converter): Promise<string> {
        switch (converter.blockchainType) {
        case 'eos':
            return await this.eos.getConverterVersion(converter.blockchainId);
        case 'ethereum':
            return await this.ethereum.getConverterVersion(converter.blockchainId);
        }
        throw new Error(converter.blockchainType + ' blockchain not supported');
    }

    async getConversionEvents(token: Token, fromBlock: number, toBlock: number): Promise<object[]> {
        if (token.blockchainType == 'ethereum')
            return await this.ethereum.getConversionEvents(token.blockchainId, fromBlock, toBlock);
        throw new Error(token.blockchainType + ' blockchain not supported');
    }

    async getConversionEventsByTimestamp(token: Token, fromTimestamp: number, toTimestamp: number): Promise<object[]> {
        if (token.blockchainType == 'ethereum')
            return await this.ethereum.getConversionEventsByTimestamp(token.blockchainId, fromTimestamp, toTimestamp);
        throw new Error(token.blockchainType + ' blockchain not supported');
    }

    async buildPathsFile(): Promise<void> {
        await this.eos.buildPathsFile();
    }

    getShortestPath(paths: string[][], rates: string[]): string[] {
        let index = 0;
        for (let i = 1; i < paths.length; i++) {
            if (betterPath(paths, index, i) || (equalPath(paths, index, i) && betterRate(rates, index, i)))
                index = i;
        }
        return paths[index];
    }

    getCheapestPath(paths: string[][], rates: string[]): string[] {
        let index = 0;
        for (let i = 1; i < rates.length; i++) {
            if (betterRate(rates, index, i) || (equalRate(rates, index, i) && betterPath(paths, index, i)))
                index = i;
        }
        return paths[index];
    }
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
