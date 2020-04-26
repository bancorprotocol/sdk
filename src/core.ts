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

    async getPaths(sourceToken: Token, targetToken: Token): Promise<Token[][]> {
        const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));
        const cartesian = (a, b?, ...c) => (b ? cartesian(f(a, b), ...c) : a);

        switch (pathType(sourceToken.blockchainType, targetToken.blockchainType)) {
        case pathType(BlockchainType.Ethereum, BlockchainType.Ethereum):
            return await this.blockchains[BlockchainType.Ethereum].getPaths(sourceToken, targetToken);
        case pathType(BlockchainType.Ethereum, BlockchainType.EOS):
            return cartesian(
                await this.blockchains[BlockchainType.Ethereum].getPaths(sourceToken, this.blockchains[BlockchainType.Ethereum].getAnchorToken()),
                [await this.blockchains[BlockchainType.EOS].getPath(this.blockchains[BlockchainType.EOS].getAnchorToken(), targetToken)]
            );
        case pathType(BlockchainType.EOS, BlockchainType.Ethereum):
            return cartesian(
                [await this.blockchains[BlockchainType.EOS].getPath(sourceToken, this.blockchains[BlockchainType.EOS].getAnchorToken())],
                await this.blockchains[BlockchainType.Ethereum].getPaths(this.blockchains[BlockchainType.Ethereum].getAnchorToken(), targetToken)
            );
        case pathType(BlockchainType.EOS, BlockchainType.EOS):
            return [await this.blockchains[BlockchainType.EOS].getPath(sourceToken, targetToken)];
        }
    }

    async getRates(paths: Token[][], amount: string = '1'): Promise<string[]> {
        const path0Form = pathForm(paths[0]);
        if (paths.slice(1).some(path => pathForm(path) != path0Form))
            throw new Error('getRates input paths must bear the same form');

        switch (pathType(paths[0][0].blockchainType, paths[0].slice(-1)[0].blockchainType)) {
        case pathType(BlockchainType.Ethereum, BlockchainType.Ethereum):
            return await this.blockchains[BlockchainType.Ethereum].getRates(paths, amount);
        case pathType(BlockchainType.Ethereum, BlockchainType.EOS):
            throw new Error('getRates from ethereum token to eos token not supported');
        case pathType(BlockchainType.EOS, BlockchainType.Ethereum):
            throw new Error('getRates from eos token to ethereum token not supported');
        case pathType(BlockchainType.EOS, BlockchainType.EOS):
            return await Promise.all(paths.map(path => this.blockchains[BlockchainType.EOS].getRate(path, amount)));
        }
    }
}

function pathType(blockchainType1: BlockchainType, blockchainType2: BlockchainType): string {
    return blockchainType1 + ',' + blockchainType2;
}

function pathForm(path: Token[]): string {
    return JSON.stringify(path[0]) + JSON.stringify(path[path.length - 1]);
}
