import { SDK } from '../src/index';
import * as eos from '../src/blockchains/eos';
import * as ethereum from '../src/blockchains/ethereum';

describe('rates test', () => {
    let sdk: SDK;

    beforeEach(async () => {
        jest.spyOn(eos.EOS, 'create').mockImplementationOnce(() => Promise.resolve(new eos.EOS()));
        jest.spyOn(ethereum.Ethereum, 'create').mockImplementationOnce(() => Promise.resolve(new ethereum.Ethereum()));
        sdk = await SDK.create();
        jest.restoreAllMocks();
    });

    afterEach(async () => {
        jest.spyOn(eos.EOS, 'destroy').mockImplementationOnce(() => Promise.resolve());
        jest.spyOn(ethereum.Ethereum, 'destroy').mockImplementationOnce(() => Promise.resolve());
        await SDK.destroy(sdk);
        jest.restoreAllMocks();
    });

    it('getConverterVersion of eos converter', async () => {
        const received = await sdk.getConverterVersion({ blockchainType: 'eos', blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' });
        expect(received).toEqual('1.0');
    });

    it('getConverterVersion of ethereum converter with a "string" version type', async () => {
        setConverterVersionGetter(sdk, ['1.1']);
        const received = await sdk.getConverterVersion({ blockchainType: 'ethereum', blockchainId: '0x1111111111111111111111111111111111111111' });
        expect(received).toEqual('1.1');
    });

    it('getConverterVersion of ethereum converter with a "bytes32" version type', async () => {
        setConverterVersionGetter(sdk, ['', '0x' + '2.2'.split('').map(c => c.charCodeAt(0).toString(16)).join('')]);
        const received = await sdk.getConverterVersion({ blockchainType: 'ethereum', blockchainId: '0x1111111111111111111111111111111111111111' });
        expect(received).toEqual('2.2');
    });

    it('getConverterVersion of ethereum converter with a "uint16" version type', async () => {
        setConverterVersionGetter(sdk, ['', '', '3.3']);
        const received = await sdk.getConverterVersion({ blockchainType: 'ethereum', blockchainId: '0x1111111111111111111111111111111111111111' });
        expect(received).toEqual('3.3');
    });

    it('getConverterVersion of ethereum converter with an unknown version type', async () => {
        setConverterVersionGetter(sdk, ['', '', '', '4.4']);
        const received = await sdk.getConverterVersion({ blockchainType: 'ethereum', blockchainId: '0x1111111111111111111111111111111111111111' });
        expect(received).toEqual('unknown');
    });
});

function setConverterVersionGetter(sdk, versions) {
    sdk.ethereum.web3 = {
        eth: {
            Contract: function(abi, address) {
                return {
                    methods: {
                        version: function() {
                            return {
                                call: function() {
                                    return versions.shift();
                                }
                            };
                        }
                    }
                };
            }
        }
    };
}
