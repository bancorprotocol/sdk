import { SDK } from '../src';
import { BlockchainType } from '../src/types';
import * as ethereum from '../src/blockchains/ethereum';
import * as ethereumMocks from './mocks/ethereum';

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

    it('getConverterVersion of ethereum converter with `string version = "0.1.1"`', async () => {
        ethereumMocks.setConverterVersionGetter(sdk._core.blockchains[BlockchainType.Ethereum], ['0.1.1']);
        const received = await sdk.utils.getConverterVersion({ blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' });
        expect(received).toEqual('11');
    });

    it('getConverterVersion of ethereum converter with `string version = "0.12"`', async () => {
        ethereumMocks.setConverterVersionGetter(sdk._core.blockchains[BlockchainType.Ethereum], ['0.12']);
        const received = await sdk.utils.getConverterVersion({ blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' });
        expect(received).toEqual('12');
    });

    it('getConverterVersion of ethereum converter with `string version = "1.3"`', async () => {
        ethereumMocks.setConverterVersionGetter(sdk._core.blockchains[BlockchainType.Ethereum], ['1.3']);
        const received = await sdk.utils.getConverterVersion({ blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' });
        expect(received).toEqual('13');
    });

    it('getConverterVersion of ethereum converter with `string version = "14"`', async () => {
        ethereumMocks.setConverterVersionGetter(sdk._core.blockchains[BlockchainType.Ethereum], ['14']);
        const received = await sdk.utils.getConverterVersion({ blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' });
        expect(received).toEqual('14');
    });

    it('getConverterVersion of ethereum converter with `bytes32 version = "0.2.1"`', async () => {
        ethereumMocks.setConverterVersionGetter(sdk._core.blockchains[BlockchainType.Ethereum], ['', '0x' + '0.2.1'.split('').map(c => c.charCodeAt(0).toString(16)).join('')]);
        const received = await sdk.utils.getConverterVersion({ blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' });
        expect(received).toEqual('21');
    });

    it('getConverterVersion of ethereum converter with `bytes32 version = "0.22"`', async () => {
        ethereumMocks.setConverterVersionGetter(sdk._core.blockchains[BlockchainType.Ethereum], ['', '0x' + '0.22'.split('').map(c => c.charCodeAt(0).toString(16)).join('')]);
        const received = await sdk.utils.getConverterVersion({ blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' });
        expect(received).toEqual('22');
    });

    it('getConverterVersion of ethereum converter with `bytes32 version = "2.3"`', async () => {
        ethereumMocks.setConverterVersionGetter(sdk._core.blockchains[BlockchainType.Ethereum], ['', '0x' + '2.3'.split('').map(c => c.charCodeAt(0).toString(16)).join('')]);
        const received = await sdk.utils.getConverterVersion({ blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' });
        expect(received).toEqual('23');
    });

    it('getConverterVersion of ethereum converter with `bytes32 version = "24"`', async () => {
        ethereumMocks.setConverterVersionGetter(sdk._core.blockchains[BlockchainType.Ethereum], ['', '0x' + '24'.split('').map(c => c.charCodeAt(0).toString(16)).join('')]);
        const received = await sdk.utils.getConverterVersion({ blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' });
        expect(received).toEqual('24');
    });

    it('getConverterVersion of ethereum converter with `uint16 version = 34`', async () => {
        ethereumMocks.setConverterVersionGetter(sdk._core.blockchains[BlockchainType.Ethereum], ['', '', '34']);
        const received = await sdk.utils.getConverterVersion({ blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' });
        expect(received).toEqual('34');
    });

    it('getConverterVersion of ethereum converter with an unknown version type', async () => {
        ethereumMocks.setConverterVersionGetter(sdk._core.blockchains[BlockchainType.Ethereum], ['', '', '', '44']);
        const received = await sdk.utils.getConverterVersion({ blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' });
        expect(received).toEqual('unknown');
    });

    it('getConverterVersion of eos converter', async () => {
        const received = await sdk.utils.getConverterVersion({ blockchainType: BlockchainType.EOS, blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' });
        expect(received).toEqual('1.0');
    });
});
