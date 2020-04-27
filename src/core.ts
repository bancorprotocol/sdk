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

        if (sourceBlockchain == targetBlockchain) {
            const paths = await sourceBlockchain.getPaths(sourceToken, targetToken);
            const rates = await sourceBlockchain.getRates(paths, amount);
            const index = Core.getBest(paths, rates);
            return {
                path: paths[index],
                rate: rates[index],
            };
        }

        const sourcePaths = await sourceBlockchain.getPaths(sourceToken, sourceBlockchain.getAnchorToken());
        const sourceRates = await sourceBlockchain.getRates(sourcePaths, amount);
        const sourceIndex = Core.getBest(sourcePaths, sourceRates);

        const targetPaths = await targetBlockchain.getPaths(targetBlockchain.getAnchorToken(), targetToken);
        const targetRates = await targetBlockchain.getRates(targetPaths, sourceRates[sourceIndex]);
        const targetIndex = Core.getBest(targetPaths, targetRates);

        return {
            path: [...sourcePaths[sourceIndex], ...targetPaths[targetIndex]],
            rate: targetRates[targetIndex],
        };
    }

    async getRateByPath(path: Token[], amount: string = '1'): Promise<string> {
        let bgn = 0;
        while (bgn < path.length) {
            const end = path.slice(bgn).findIndex(token => token.blockchainType != path[bgn].blockchainType) >>> 0;
            amount = await this.blockchains[path[bgn].blockchainType].getRateByPath(path.slice(bgn, end), amount);
            bgn = end;
        }
        return amount;
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
