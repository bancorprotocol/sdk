import { SDK } from '../src/index';
import * as eos from '../src/blockchains/eos/index';
import * as ethereum from '../src/blockchains/ethereum/index';
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
        expect(sdk.eos).toBeUndefined();
        expect(sdk.ethereum).toBeUndefined();
        await SDK.destroy(sdk);
    });

    it('initialize eos', async () => {
        const sdk = await SDK.create({eosNodeEndpoint: 'dummy'});
        expect(sdk.eos).toBeTruthy();
        expect(sdk.ethereum).toBeUndefined();
        await SDK.destroy(sdk);
    });

    it('initialize ethereum', async () => {
        const sdk = await SDK.create({ethereumNodeEndpoint: 'dummy'});
        expect(sdk.eos).toBeUndefined();
        expect(sdk.ethereum).toBeTruthy();
        await SDK.destroy(sdk);
    });

    it('initialize both', async () => {
        const sdk = await SDK.create({eosNodeEndpoint: 'dummy', ethereumNodeEndpoint: 'dummy'});
        expect(sdk.eos).toBeTruthy();
        expect(sdk.ethereum).toBeTruthy();
        await SDK.destroy(sdk);
    });
});
