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

    /*it('getRate from ethereum token to ethereum token', async () => {
        const spyGetDecimals = jest
            .spyOn(ethereum, 'getDecimals')
            .mockImplementationOnce(() => Promise.resolve('18'))
            .mockImplementationOnce(() => Promise.resolve('18'));

        const spyGetReturn = jest
            .spyOn(ethereum, 'getReturn')
            .mockImplementationOnce(() => Promise.resolve('209035338725170038366'));

        const spyGetPath = jest
            .spyOn(sdk, 'getPath')
            .mockImplementationOnce(() => Promise.resolve([
                { blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' },
                { blockchainType: BlockchainType.Ethereum, blockchainId: '0x2222222222222222222222222222222222222222' },
                { blockchainType: BlockchainType.Ethereum, blockchainId: '0x3333333333333333333333333333333333333333' }
            ]));

        await sdk.refresh();

        const received = await sdk.pricing.getRate(
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' },
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x3333333333333333333333333333333333333333' }
        );

        expect(received).toEqual('209.035338725170038366');
        expect(spyGetDecimals).toHaveBeenCalledTimes(2);
        expect(spyGetReturn).toHaveBeenCalledTimes(1);
        expect(spyGetPath).toHaveBeenCalledTimes(1);
    });

    it('getRate from ethereum token to eos token', async () => {
        const spyGetDecimals = jest
            .spyOn(ethereum, 'getDecimals')
            .mockImplementationOnce(() => Promise.resolve('18'))
            .mockImplementationOnce(() => Promise.resolve('18'));

        const spyGetReturn = jest
            .spyOn(ethereum, 'getReturn')
            .mockImplementationOnce(() => Promise.resolve('662806411110393058533'));

        const spyGetConverterSettings = jest
            .spyOn(eos, 'getConverterSettings')
            .mockImplementationOnce(() => Promise.resolve({ rows: [{ fee: 2500 }] }));

        const spyGetReservesFromCode = jest
            .spyOn(eos, 'getReservesFromCode')
            .mockImplementationOnce(() => Promise.resolve({
                rows: [
                    {
                        contract: 'aaaaaaaaaaaa',
                        currency: '0.0 AAA',
                        ratio: 500000,
                        p_enabled: 1
                    },
                    {
                        contract: 'cccccccccccc',
                        currency: '0.0 CCC',
                        ratio: 500000,
                        p_enabled: 1
                    }
                ],
                more: false,
                next_key: ''
            }));

        const spyGetReserveBalances = jest
            .spyOn(eos, 'getReserveBalances')
            .mockImplementationOnce(() => Promise.resolve({
                rows: [{ balance: '5950.2395821273 AAA' }],
                more: false,
                next_key: ''
            }))
            .mockImplementationOnce(() => Promise.resolve({
                rows: [{ balance: '32355343.8280 CCC' }],
                more: false,
                next_key: ''
            }));

        const spyGetPath = jest
            .spyOn(sdk, 'getPath')
            .mockImplementationOnce(() => Promise.resolve([
                { blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' },
                { blockchainType: BlockchainType.Ethereum, blockchainId: '0x2222222222222222222222222222222222222222' },
                { blockchainType: BlockchainType.Ethereum, blockchainId: '0x3333333333333333333333333333333333333333' },
                { blockchainType: BlockchainType.EOS, blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' },
                { blockchainType: BlockchainType.EOS, blockchainId: 'aaacccaaaccc', symbol: 'AAACCC' },
                { blockchainType: BlockchainType.EOS, blockchainId: 'cccccccccccc', symbol: 'CCC' }
            ]));

        await sdk.refresh();

        const received = await sdk.pricing.getRate(
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' },
            { blockchainType: BlockchainType.EOS, blockchainId: 'cccccccccccc', symbol: 'CCC' }
        );

        expect(received).toEqual('3226688.084642570529407094055738289769947463047257618333877712134072470684667713285913835113451935283');
        expect(spyGetReservesFromCode).toHaveBeenCalledTimes(1);
        expect(spyGetConverterSettings).toHaveBeenCalledTimes(1);
        expect(spyGetReserveBalances).toHaveBeenCalledTimes(2);
        expect(spyGetDecimals).toHaveBeenCalledTimes(2);
        expect(spyGetReturn).toHaveBeenCalledTimes(1);
        expect(spyGetPath).toHaveBeenCalledTimes(1);
    });

    it('getRate from eos token to ethereum token', async () => {
        jest.spyOn(sdk._core.blockchains[BlockchainType.EOS], 'getAnchorToken')
            .mockImplementationOnce(() => ({ blockchainType: BlockchainType.EOS, blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }));

        jest.spyOn(sdk._core.blockchains[BlockchainType.EOS].jsonRpc, 'get_table_rows')
            .mockImplementation((args: any) => eosMocks.jsonRpcGetTableRows(args));

        const spyGetDecimals = jest
            .spyOn(ethereum, 'getDecimals')
            .mockImplementation(() => Promise.resolve('18'));


        const spyGetPath = jest
            .spyOn(sdk.conversionPaths, 'getPath')
            .mockImplementation(() => Promise.resolve([
                { blockchainType: BlockchainType.EOS, blockchainId: 'cccccccccccc', symbol: 'CCC' },
                { blockchainType: BlockchainType.EOS, blockchainId: 'aaacccaaaccc', symbol: 'AAACCC' },
                { blockchainType: BlockchainType.EOS, blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' },
                { blockchainType: BlockchainType.Ethereum, blockchainId: '0x3333333333333333333333333333333333333333' },
                { blockchainType: BlockchainType.Ethereum, blockchainId: '0x2222222222222222222222222222222222222222' },
                { blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' }
            ]));

        await sdk.refresh();

        const received = await sdk.pricing.getRate(
            { blockchainType: BlockchainType.EOS, blockchainId: 'cccccccccccc', symbol: 'CCC' },
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' }
        );

        expect(received).toEqual('0.000000274802734836');
        expect(spyGetDecimals).toHaveBeenCalledTimes(2);
        expect(spyGetPath).toHaveBeenCalledTimes(1);
    });*/

    it('getRate from eos token to eos token (convert)', async () => {
        jest.spyOn(sdk._core.blockchains[BlockchainType.EOS], 'getAnchorToken')
            .mockImplementationOnce(() => ({ blockchainType: BlockchainType.EOS, blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }));

        jest.spyOn(sdk._core.blockchains[BlockchainType.EOS].jsonRpc, 'get_table_rows')
            .mockImplementation((args: any) => eosMocks.jsonRpcGetTableRows(args));
  
        await sdk.refresh();

        const received = await sdk.pricing.getRate(
            { blockchainType: BlockchainType.EOS, blockchainId: 'cccccccccccc', symbol: 'CCC' },
            { blockchainType: BlockchainType.EOS, blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }
        );

        expect(received).toEqual('0.1675');
    });

    it('getRate from eos token to eos token (buy)', async () => {
        jest.spyOn(sdk._core.blockchains[BlockchainType.EOS], 'getAnchorToken')
            .mockImplementationOnce(() => ({ blockchainType: BlockchainType.EOS, blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }));

        jest.spyOn(sdk._core.blockchains[BlockchainType.EOS].jsonRpc, 'get_table_rows')
            .mockImplementation((args: any) => eosMocks.jsonRpcGetTableRows(args));
  
        await sdk.refresh();

        const received = await sdk.pricing.getRate(
            { blockchainType: BlockchainType.EOS, blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' },
            { blockchainType: BlockchainType.EOS, blockchainId: 'aaacccaaaccc', symbol: 'AAACCC' }
        );

        expect(received).toEqual('16.7633');
    });

    it('getRate from eos token to eos token (sell)', async () => {
        jest.spyOn(sdk._core.blockchains[BlockchainType.EOS], 'getAnchorToken')
            .mockImplementationOnce(() => ({ blockchainType: BlockchainType.EOS, blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }));

        jest.spyOn(sdk._core.blockchains[BlockchainType.EOS].jsonRpc, 'get_table_rows')
            .mockImplementation((args: any) => eosMocks.jsonRpcGetTableRows(args));
  
        await sdk.refresh();

        const received = await sdk.pricing.getRate(
            { blockchainType: BlockchainType.EOS, blockchainId: 'aaacccaaaccc', symbol: 'AAACCC' },
            { blockchainType: BlockchainType.EOS, blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }
        );

        expect(received).toEqual('0.0593');
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
