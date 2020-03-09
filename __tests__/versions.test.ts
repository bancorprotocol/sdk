import { SDK } from '../src/index';
import * as eos from '../src/blockchains/eos/index';
import * as ethereum from '../src/blockchains/ethereum/index';
import * as ethereumMocks from '../src/blockchains/ethereum/mocks';

describe('versions test', () => {
    let sdk: SDK;

    beforeEach(async () => {
        jest.spyOn(ethereum, 'getWeb3').mockImplementationOnce(ethereumMocks.getWeb3);
        sdk = await SDK.create({eosNodeEndpoint: 'dummy', ethereumNodeEndpoint: 'dummy'});
    });

    afterEach(async () => {
        await SDK.destroy(sdk);
        jest.restoreAllMocks();
    });

    it('getConverterVersion of eos converter', async () => {
        const received = await sdk.getConverterVersion({ blockchainType: 'eos', blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' });
        expect(received).toEqual('1.0');
    });

    it('getConverterVersion of ethereum converter with a "string" version type', async () => {
        ethereumMocks.setConverterVersionGetter(sdk.ethereum, ['1.1']);
        const received = await sdk.getConverterVersion({ blockchainType: 'ethereum', blockchainId: '0x1111111111111111111111111111111111111111' });
        expect(received).toEqual('1.1');
    });

    it('getConverterVersion of ethereum converter with a "bytes32" version type', async () => {
        ethereumMocks.setConverterVersionGetter(sdk.ethereum, ['', '0x' + '2.2'.split('').map(c => c.charCodeAt(0).toString(16)).join('')]);
        const received = await sdk.getConverterVersion({ blockchainType: 'ethereum', blockchainId: '0x1111111111111111111111111111111111111111' });
        expect(received).toEqual('2.2');
    });

    it('getConverterVersion of ethereum converter with a "uint16" version type', async () => {
        ethereumMocks.setConverterVersionGetter(sdk.ethereum, ['', '', '3.3']);
        const received = await sdk.getConverterVersion({ blockchainType: 'ethereum', blockchainId: '0x1111111111111111111111111111111111111111' });
        expect(received).toEqual('3.3');
    });

    it('getConverterVersion of ethereum converter with an unknown version type', async () => {
        ethereumMocks.setConverterVersionGetter(sdk.ethereum, ['', '', '', '4.4']);
        const received = await sdk.getConverterVersion({ blockchainType: 'ethereum', blockchainId: '0x1111111111111111111111111111111111111111' });
        expect(received).toEqual('unknown');
    });
});
