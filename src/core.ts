import * as helpers from './helpers';
import { Ethereum } from './blockchains/ethereum';
import { EOS } from './blockchains/eos';
import { Settings, BlockchainType, Token, Blockchain } from './types';

export class Core {
    blockchains: Partial<Record<BlockchainType, Blockchain>> = {};

    async create(settings: Settings) {
        if (settings.ethereumNodeEndpoint)
            this.blockchains[BlockchainType.Ethereum] = await Ethereum.create(settings.ethereumNodeEndpoint);
        if (settings.eosNodeEndpoint)
            this.blockchains[BlockchainType.EOS] = await EOS.create(settings.eosNodeEndpoint);
    }

    async destroy(): Promise<void> {
        if (this.blockchains[BlockchainType.Ethereum])
            await Ethereum.destroy(this.blockchains[BlockchainType.Ethereum] as Ethereum);
        if (this.blockchains[BlockchainType.EOS])
            await EOS.destroy(this.blockchains[BlockchainType.EOS] as EOS);
    }

    async refresh(): Promise<void> {
        for (let blockchainType in this.blockchains)
            await this.blockchains[blockchainType].refresh();
    }

    async getPathAndRate(sourceToken: Token, targetToken: Token, amount: string = '1'): Promise<{path: Token[], rate: string}> {
        const sourceBlockchain = this.blockchains[sourceToken.blockchainType];
        const targetBlockchain = this.blockchains[targetToken.blockchainType];

        // single blockchain path - get the path/rate from that blockchain
        if (sourceBlockchain == targetBlockchain) {
            const paths = await this.getPaths(sourceToken.blockchainType, sourceToken, targetToken);
            const rates = await this.getRates(sourceToken.blockchainType, paths, amount);
            const index = Core.getBest(paths, rates);
            return {
                path: paths[index],
                rate: rates[index]
            };
        }

        // cross blockchain path
        // source blockchain - get the paths from the source token to the anchor token
        const sourcePaths = await this.getPaths(sourceToken.blockchainType, sourceToken, sourceBlockchain.getAnchorToken());
        // source blockchain - get the rates
        const sourceRates = await this.getRates(sourceToken.blockchainType, sourcePaths, amount);
        const sourceIndex = Core.getBest(sourcePaths, sourceRates);

        // target blockchain - get the paths from the anchor to the target token
        const targetPaths = await this.getPaths(targetToken.blockchainType, targetBlockchain.getAnchorToken(), targetToken);
        // target blockchain - get the rates
        const targetRates = await this.getRates(targetToken.blockchainType, targetPaths, sourceRates[sourceIndex]);
        const targetIndex = Core.getBest(targetPaths, targetRates);

        return {
            path: [...sourcePaths[sourceIndex], ...targetPaths[targetIndex]],
            rate: targetRates[targetIndex],
        };
    }

    async getRateByPath(path: Token[], amount: string = '1'): Promise<string> {
        const sourceBlockchainType = path[0].blockchainType;
        const targetBlockchainType = path[path.length - 1].blockchainType;

        // single blockchain path - get the rate from that blockchain
        if (sourceBlockchainType == targetBlockchainType)
            return (await this.getRates(sourceBlockchainType, [path], amount))[0];

        // cross blockchain path - split the path in two
        const index = path.findIndex(item => item.blockchainType == targetBlockchainType);
        const sourceBlockchainPath = path.slice(0, index);
        const targetBlockchainPath = path.slice(index);

        // get the rate from the source blockchain and pass it as the input for the target blockchain
        const sourceBlockchainRate = (await this.getRates(sourceBlockchainType, [sourceBlockchainPath], amount))[0];
        return (await this.getRates(targetBlockchainType, [targetBlockchainPath], sourceBlockchainRate))[0];
    }

    private async getPaths(blockchainType: BlockchainType, sourceToken: Token, targetToken: Token): Promise<Token[][]> {
        // special case for source token == target token
        if (helpers.isTokenEqual(sourceToken, targetToken))
            return [[sourceToken]];

        return await this.blockchains[blockchainType].getPaths(sourceToken, targetToken);
    }

    private async getRates(blockchainType: BlockchainType, paths: Token[][], amount: string = '1'): Promise<string[]> {
        // special case for single path and source token == target token
        if (paths.length == 1 && helpers.isTokenEqual(paths[0][0], paths[0][paths[0].length - 1]))
            return [amount];

        return await this.blockchains[blockchainType].getRates(paths, amount);
    }

    private static getBest(paths: Token[][], rates: string[]): number {
        let index = 0;
        for (let i = 1; i < rates.length; i++) {
            if (Core.betterRate(rates, index, i) || (Core.equalRate(rates, index, i) && Core.betterPath(paths, index, i)))
                index = i;
        }
        return index;
    }

    private static betterRate(rates: string[], index1: number, index2: number): boolean {
        // return Number(rates[index1]) < Number(rates[index2]);
        const rate1 = rates[index1].split('.').concat('');
        const rate2 = rates[index2].split('.').concat('');
        rate1[0] = rate1[0].padStart(rate2[0].length, '0');
        rate2[0] = rate2[0].padStart(rate1[0].length, '0');
        rate1[1] = rate1[1].padEnd(rate2[1].length, '0');
        rate2[1] = rate2[1].padEnd(rate1[1].length, '0');
        return rate1.join('') < rate2.join('');
    }

    private static equalRate(rates: string[], index1: number, index2: number): boolean {
        return rates[index1] == rates[index2];
    }

    private static betterPath(paths: Token[][], index1: number, index2: number): boolean {
        return paths[index1].length > paths[index2].length;
    }
}
