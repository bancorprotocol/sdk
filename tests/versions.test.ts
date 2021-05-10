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

    for (const version of ['0.1.2', '0.34', '5.6', '78']) {
        it(`getConverterVersion of ethereum converter with string version = "${version}"`, async () => {
            ethereumMocks.setConverterVersionGetter(sdk._core.blockchains[BlockchainType.Ethereum], [version]);
            const received = await sdk.utils.getConverterVersion({ blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' });
            expect(received).toEqual(String(Number(version.split('.').join(''))));
        });
    }

    for (const version of ['0.1.2', '0.34', '5.6', '78']) {
        it(`getConverterVersion of ethereum converter with bytes32 version = "${version}"`, async () => {
            ethereumMocks.setConverterVersionGetter(sdk._core.blockchains[BlockchainType.Ethereum], ['', '0x' + version.split('').map(c => c.charCodeAt(0).toString(16)).join('')]);
            const received = await sdk.utils.getConverterVersion({ blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' });
            expect(received).toEqual(String(Number(version.split('.').join(''))));
        });
    }

    for (const version of ['12', '34', '56', '78']) {
        it(`getConverterVersion of ethereum converter with uint16 version = ${version}`, async () => {
            ethereumMocks.setConverterVersionGetter(sdk._core.blockchains[BlockchainType.Ethereum], ['', '', version]);
            const received = await sdk.utils.getConverterVersion({ blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' });
            expect(received).toEqual(version);
        });
    }

    it('getConverterVersion of ethereum converter with an unknown version type', async () => {
        ethereumMocks.setConverterVersionGetter(sdk._core.blockchains[BlockchainType.Ethereum], ['', '', '', '12345678']);
        const received = await sdk.utils.getConverterVersion({ blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' });
        expect(received).toEqual('unknown');
    });

    it('getConverterVersion of eos converter', async () => {
        const received = await sdk.utils.getConverterVersion({ blockchainType: BlockchainType.EOS, blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' });
        expect(received).toEqual('1.0');
    });
});
