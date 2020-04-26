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

    async getPaths(sourceToken: Token, targetToken: Token): Promise<Token[][]> {
        const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));
        const cartesian = (a, b?, ...c) => (b ? cartesian(f(a, b), ...c) : a);

        if (sourceToken.blockchainType == targetToken.blockchainType)
            return await this.blockchains[sourceToken.blockchainType].getPaths(sourceToken, targetToken);

        let sourceBlockchain: Blockchain = this.blockchains[sourceToken.blockchainType];
        let targetBlockchain: Blockchain = this.blockchains[targetToken.blockchainType];
        let sourcePaths: Token[][] = await sourceBlockchain.getPaths(sourceToken, sourceBlockchain.getAnchorToken());
        let targetPaths: Token[][] = await targetBlockchain.getPaths(targetBlockchain.getAnchorToken(), targetToken);
        return cartesian(sourcePaths, targetPaths);
    }

    async getRates(paths: Token[][], amount: string = '1'): Promise<string[]> {
        const path0Form = this.pathForm(paths[0]);
        if (paths.slice(1).some(path => this.pathForm(path) != path0Form))
            throw new Error('getRates input paths must bear the same source and the same target tokens');

        switch (this.pathType(paths[0][0].blockchainType, paths[0].slice(-1)[0].blockchainType)) {
        case this.pathType(BlockchainType.Ethereum, BlockchainType.Ethereum):
            return await this.blockchains[BlockchainType.Ethereum].getRates(paths, amount);
        case this.pathType(BlockchainType.Ethereum, BlockchainType.EOS):
            throw new Error('getRates from ethereum token to eos token not supported');
        case this.pathType(BlockchainType.EOS, BlockchainType.Ethereum):
            throw new Error('getRates from eos token to ethereum token not supported');
        case this.pathType(BlockchainType.EOS, BlockchainType.EOS):
            return await Promise.all(paths.map(path => this.blockchains[BlockchainType.EOS].getRateByPath(path, amount)));
        }
    }

    private pathType(blockchainType1: BlockchainType, blockchainType2: BlockchainType): string {
        return blockchainType1 + ',' + blockchainType2;
    }
    
    private pathForm(path: Token[]): string {
        return JSON.stringify(path[0]) + JSON.stringify(path[path.length - 1]);
    }
}
