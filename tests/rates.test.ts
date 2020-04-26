import { legacyConverters } from './mocks/eos'
jest.mock('../src/blockchains/eos/legacy_converters', () => legacyConverters);

import { SDK } from '../src';
import { BlockchainType } from '../src/types';
import * as eos from '../src/blockchains/eos';
import * as ethereum from '../src/blockchains/ethereum';
import * as ethereumMocks from './mocks/ethereum';
import * as eosMocks from './mocks/eos';

describe('rates test', () => {
    let sdk: SDK;

    beforeEach(async () => {
        jest.spyOn(ethereum, 'getWeb3').mockImplementationOnce(ethereumMocks.getWeb3);
        sdk = await SDK.create({eosNodeEndpoint: 'dummy', ethereumNodeEndpoint: 'dummy'});
    });

    afterEach(async () => {
        await SDK.destroy(sdk);
        jest.restoreAllMocks();
    });

    it('getRateByPath from ethereum token to ethereum token', async () => {
        const spyGetDecimals = jest
            .spyOn(ethereum, 'getDecimals')
            .mockImplementationOnce(() => Promise.resolve('18'))
            .mockImplementationOnce(() => Promise.resolve('18'));

        const spyGetReturn = jest
            .spyOn(ethereum, 'getReturn')
            .mockImplementationOnce(() => Promise.resolve('209035338725170038366'));

        const received = await sdk.pricing.getRateByPath([
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' },
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x3333333333333333333333333333333333333333' }
        ]);

        expect(received).toEqual('209.035338725170038366');
        expect(spyGetDecimals).toHaveBeenCalledTimes(2);
        expect(spyGetReturn).toHaveBeenCalledTimes(1);
    });

    it('getRateByPath from ethereum token to eos token', async () => {
        const spyGetDecimals = jest
            .spyOn(ethereum, 'getDecimals')
            .mockImplementationOnce(() => Promise.resolve('18'))
            .mockImplementationOnce(() => Promise.resolve('18'));

        const spyGetReturn = jest
            .spyOn(ethereum, 'getReturn')
            .mockImplementationOnce(() => Promise.resolve('662806411110393058533'));

        const received = await sdk.pricing.getRateByPath([
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' },
            { blockchainType: BlockchainType.EOS, blockchainId: 'cccccccccccc', symbol: 'CCC' }
        ]);

        expect(received).toEqual('662.806411110393058533');
        expect(spyGetDecimals).toHaveBeenCalledTimes(2);
        expect(spyGetReturn).toHaveBeenCalledTimes(1);
    });

    it('getRateByPath from eos token to ethereum token', async () => {
        jest.spyOn(sdk._core.blockchains[BlockchainType.EOS], 'getAnchorToken')
            .mockImplementationOnce(() => ({ blockchainType: BlockchainType.EOS, blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }));

        const spyGetDecimals = jest
            .spyOn(ethereum, 'getDecimals')
            .mockImplementation(() => Promise.resolve('18'));

        const spyGetReturn = jest
            .spyOn(ethereum, 'getReturn')
            .mockImplementationOnce(() => Promise.resolve('274802734836'));

        const received = await sdk.pricing.getRateByPath([
            { blockchainType: BlockchainType.EOS, blockchainId: 'cccccccccccc', symbol: 'CCC' },
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' }
        ]);

        expect(received).toEqual('0.000000274802734836');
        expect(spyGetDecimals).toHaveBeenCalledTimes(2);
        expect(spyGetReturn).toHaveBeenCalledTimes(1);
    });

    it('getRate from eos token to eos token (convert)', async () => {
        jest.spyOn(sdk._core.blockchains[BlockchainType.EOS], 'getAnchorToken')
            .mockImplementationOnce(() => ({ blockchainType: BlockchainType.EOS, blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }));

        const spyGetTableRows = jest
            .spyOn(sdk._core.blockchains[BlockchainType.EOS].jsonRpc, 'get_table_rows')
            .mockImplementation((args: any) => eosMocks.jsonRpcGetTableRows(args));
  
        const received = await sdk.pricing.getRate(
            { blockchainType: BlockchainType.EOS, blockchainId: 'cccccccccccc', symbol: 'CCC' },
            { blockchainType: BlockchainType.EOS, blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }
        );

        expect(received).toEqual('0.1675');
        expect(spyGetTableRows).toHaveBeenCalledTimes(5);
    });

    it('getRate from eos token to eos token (buy)', async () => {
        jest.spyOn(sdk._core.blockchains[BlockchainType.EOS], 'getAnchorToken')
            .mockImplementationOnce(() => ({ blockchainType: BlockchainType.EOS, blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }));

        const spyGetTableRows = jest
            .spyOn(sdk._core.blockchains[BlockchainType.EOS].jsonRpc, 'get_table_rows')
            .mockImplementation((args: any) => eosMocks.jsonRpcGetTableRows(args));
  
        const received = await sdk.pricing.getRate(
            { blockchainType: BlockchainType.EOS, blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' },
            { blockchainType: BlockchainType.EOS, blockchainId: 'aaacccaaaccc', symbol: 'AAACCC' }
        );

        expect(received).toEqual('16.7633');
        expect(spyGetTableRows).toHaveBeenCalledTimes(4);
    });

    it('getRate from eos token to eos token (sell)', async () => {
        jest.spyOn(sdk._core.blockchains[BlockchainType.EOS], 'getAnchorToken')
            .mockImplementationOnce(() => ({ blockchainType: BlockchainType.EOS, blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }));

        const spyGetTableRows = jest
            .spyOn(sdk._core.blockchains[BlockchainType.EOS].jsonRpc, 'get_table_rows')
            .mockImplementation((args: any) => eosMocks.jsonRpcGetTableRows(args));
  
        const received = await sdk.pricing.getRate(
            { blockchainType: BlockchainType.EOS, blockchainId: 'aaacccaaaccc', symbol: 'AAACCC' },
            { blockchainType: BlockchainType.EOS, blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }
        );

        expect(received).toEqual('0.0593');
        expect(spyGetTableRows).toHaveBeenCalledTimes(4);
    });

    it('getRates from ethereum token to eos token', async () => {
        const promise = sdk._core.getRates([[
            { blockchainType: BlockchainType.Ethereum, blockchainId: '' },
            { blockchainType: BlockchainType.EOS, blockchainId: '', symbol: '' }
        ]]);
        expect(promise).rejects.toEqual(new Error('getRates from ethereum token to eos token not supported'));
    });

    it('getRates from eos token to ethereum token', async () => {
        const promise = sdk._core.getRates([[
            { blockchainType: BlockchainType.EOS, blockchainId: '', symbol: '' },
            { blockchainType: BlockchainType.Ethereum, blockchainId: '' }
        ]]);
        expect(promise).rejects.toEqual(new Error('getRates from eos token to ethereum token not supported'));
    });
});
