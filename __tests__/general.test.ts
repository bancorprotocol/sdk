import { SDK } from '../src';
import { BlockchainType } from '../src/types';
import * as eos from '../src/blockchains/eos';
import * as ethereum from '../src/blockchains/ethereum';
import * as ethereumMocks from '../src/blockchains/ethereum/mocks';

describe('general test', () => {
    beforeEach(async () => {
        jest.spyOn(ethereum, 'getWeb3').mockImplementationOnce(ethereumMocks.getWeb3);
    });

    afterEach(async () => {
        jest.restoreAllMocks();
    });

    it('initialize none', async () => {
        const sdk = await SDK.create({});
        expect(sdk._core.blockchains[BlockchainType.EOS]).toBeUndefined();
        expect(sdk._core.blockchains[BlockchainType.Ethereum]).toBeUndefined();
        await SDK.destroy(sdk);
    });

    it('initialize eos', async () => {
        const sdk = await SDK.create({eosNodeEndpoint: 'dummy'});
        expect(sdk._core.blockchains[BlockchainType.EOS]).toBeTruthy();
        expect(sdk._core.blockchains[BlockchainType.Ethereum]).toBeUndefined();
        await SDK.destroy(sdk);
    });

    it('initialize ethereum', async () => {
        const sdk = await SDK.create({ethereumNodeEndpoint: 'dummy'});
        expect(sdk._core.blockchains[BlockchainType.EOS]).toBeUndefined();
        expect(sdk._core.blockchains[BlockchainType.Ethereum]).toBeTruthy();
        await SDK.destroy(sdk);
    });

    it('initialize both', async () => {
        const sdk = await SDK.create({eosNodeEndpoint: 'dummy', ethereumNodeEndpoint: 'dummy'});
        expect(sdk._core.blockchains[BlockchainType.EOS]).toBeTruthy();
        expect(sdk._core.blockchains[BlockchainType.Ethereum]).toBeTruthy();
        await SDK.destroy(sdk);
    });
});
