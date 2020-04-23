import { Ethereum } from './blockchains/ethereum';
import { EOS } from './blockchains/eos';
import { Settings, BlockchainType, Token } from './types';

export class Core {
    blockchains = {};

    async create(settings: Settings) {
        if (settings.ethereumNodeEndpoint)
            this.blockchains[BlockchainType.Ethereum] = await Ethereum.create(settings.ethereumNodeEndpoint);
        if (settings.eosNodeEndpoint)
            this.blockchains[BlockchainType.EOS] = await EOS.create(settings.eosNodeEndpoint);
    }

    async destroy(): Promise<void> {
        if (this.blockchains[BlockchainType.Ethereum])
            await Ethereum.destroy(this.blockchains[BlockchainType.Ethereum]);
        if (this.blockchains[BlockchainType.EOS])
            await EOS.destroy(this.blockchains[BlockchainType.EOS]);
    }

    async refresh(): Promise<void> {
        for (let blockchainType in this.blockchains) {
            await this.blockchains[blockchainType].refresh();
        }
    }

    async getAllPathsAndRates(sourceToken: Token, targetToken: Token, amount: string = '1'): Promise<[{path: Token[], rate: string}]> {
        switch (pathType(sourceToken.blockchainType, targetToken.blockchainType)) {
        case pathType(BlockchainType.EOS, BlockchainType.EOS):
            throw new Error('getAllPathsAndRates from eos token to eos token not supported');
        case pathType(BlockchainType.EOS, BlockchainType.Ethereum):
            throw new Error('getAllPathsAndRates from eos token to ethereum token not supported');
        case pathType(BlockchainType.Ethereum, BlockchainType.EOS):
            throw new Error('getAllPathsAndRates from ethereum token to eos token not supported');
        case pathType(BlockchainType.Ethereum, BlockchainType.Ethereum):
            const [paths, rates] = await this.blockchains[BlockchainType.Ethereum].getAllPathsAndRates(sourceToken.blockchainId, targetToken.blockchainId, amount);
            return paths.map((path, i) => ({path: path.map(x => ({blockchainType: BlockchainType.Ethereum, blockchainId: x})), rate: rates[i]}));
        }
    }

    async getPath(sourceToken: Token, targetToken: Token, amount: string): Promise<Token[]> {
        let ethPaths;
        let ethRates;
        let eosPath;
    
        switch (pathType(sourceToken.blockchainType, targetToken.blockchainType)) {
        case pathType(BlockchainType.Ethereum, BlockchainType.Ethereum):
            [ethPaths, ethRates] = await this.blockchains[BlockchainType.Ethereum].getAllPathsAndRates(sourceToken.blockchainId, targetToken.blockchainId, amount);
            return getCheapestPath(ethPaths, ethRates).map(x => ({blockchainType: BlockchainType.Ethereum, blockchainId: x}));
        case pathType(BlockchainType.Ethereum, BlockchainType.EOS):
            [ethPaths, ethRates] = await this.blockchains[BlockchainType.Ethereum].getAllPathsAndRates(sourceToken.blockchainId, this.blockchains[BlockchainType.Ethereum].getAnchorToken(), amount);
            eosPath = await this.blockchains[BlockchainType.EOS].getPath(this.blockchains[BlockchainType.EOS].getAnchorToken(), targetToken);
            return [...getCheapestPath(ethPaths, ethRates).map(x => ({blockchainType: BlockchainType.Ethereum, blockchainId: x})), ...eosPath];    
        case pathType(BlockchainType.EOS, BlockchainType.Ethereum):
            eosPath = await this.blockchains[BlockchainType.EOS].getPath(sourceToken, this.blockchains[BlockchainType.EOS].getAnchorToken());
            [ethPaths, ethRates] = await this.blockchains[BlockchainType.Ethereum].getAllPathsAndRates(this.blockchains[BlockchainType.Ethereum].getAnchorToken(), targetToken.blockchainId, amount);
            return [...eosPath, ...getCheapestPath(ethPaths, ethRates).map(x => ({blockchainType: BlockchainType.Ethereum, blockchainId: x}))];
        case pathType(BlockchainType.EOS, BlockchainType.EOS):
            eosPath = await this.blockchains[BlockchainType.EOS].getPath(sourceToken, targetToken);
            return eosPath;
        }
    }
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

function equalRate(rates: string[], index1: number, index2: number): boolean {
    return rates[index1] == rates[index2];
}

function pathType(blockchainType1: BlockchainType, blockchainType2: BlockchainType): string {
    return blockchainType1 + ',' + blockchainType2;
}
