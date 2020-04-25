import { SDK } from '../src';
import { BlockchainType } from '../src/types';
import * as eos from '../src/blockchains/eos';
import * as ethereum from '../src/blockchains/ethereum';
import * as ethereumMocks from '../src/blockchains/ethereum/mocks';

describe('paths test', () => {
    let sdk: SDK;

    beforeEach(async () => {
        jest.spyOn(ethereum, 'getWeb3').mockImplementationOnce(ethereumMocks.getWeb3);
        sdk = await SDK.create({eosNodeEndpoint: 'dummy', ethereumNodeEndpoint: 'dummy'});
    });

    afterEach(async () => {
        await SDK.destroy(sdk);
        jest.restoreAllMocks();
    });

    it('getPath from eos token to eos token', async () => {
        const spyGetAnchorToken = jest
            .spyOn(eos, 'getAnchorToken')
            .mockImplementationOnce(() => ({ blockchainType: BlockchainType.EOS, blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }));

        const spyGetTokenSmartTokens = jest
            .spyOn(sdk._core.blockchains[BlockchainType.EOS], 'getTokenSmartTokens')
            .mockImplementationOnce(() => ({ aaacccaaaccc: 'AAACCC' }))
            .mockImplementationOnce(() => ({ aaacccaaaccc: 'AAACCC' }));

        await sdk.refresh();

        const received = await sdk.conversionPaths.getPath(
            { blockchainType: BlockchainType.EOS, blockchainId: 'cccccccccccc', symbol: 'CCC' },
            { blockchainType: BlockchainType.EOS, blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }
        );

        const expected = [
            { blockchainType: BlockchainType.EOS, blockchainId: 'cccccccccccc', symbol: 'CCC' },
            { blockchainType: BlockchainType.EOS, blockchainId: 'aaacccaaaccc', symbol: 'AAACCC' },
            { blockchainType: BlockchainType.EOS, blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }
        ];

        expect(received).toEqual(expected);
        expect(spyGetAnchorToken).toHaveBeenCalledTimes(1);
        expect(spyGetTokenSmartTokens).toHaveBeenCalledTimes(2);
    });

    it('getPath from eos token to ethereum token', async () => {
        const spyGetContractAddresses = jest
            .spyOn(ethereum, 'getContractAddresses')
            .mockImplementation(() => ({ anchorToken: '0x3333333333333333333333333333333333333333',
                                         pivotTokens: ['0x3333333333333333333333333333333333333333'] }));

        const spyGetGraph = jest
            .spyOn(ethereum, 'getGraph')
            .mockImplementationOnce(() => Promise.resolve({
               '0x1111111111111111111111111111111111111111' : ['0x2222222222222222222222222222222222222222'],
               '0x2222222222222222222222222222222222222222' : ['0x1111111111111111111111111111111111111111', '0x3333333333333333333333333333333333333333'],
               '0x3333333333333333333333333333333333333333' : ['0x2222222222222222222222222222222222222222']
            }));

        const spyGetDecimals = jest
            .spyOn(ethereum, 'getDecimals')
            .mockImplementationOnce(() => Promise.resolve('10'))
            .mockImplementationOnce(() => Promise.resolve('10'));

        ethereumMocks.setRatesGetter(sdk._core.blockchains[BlockchainType.Ethereum], ['123123123']);

        const spyGetAnchorToken = jest
            .spyOn(eos, 'getAnchorToken')
            .mockImplementationOnce(() => ({ blockchainType: BlockchainType.EOS, blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }))
            .mockImplementationOnce(() => ({ blockchainType: BlockchainType.EOS, blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }));

        const spyGetTokenSmartTokens = jest
            .spyOn(sdk._core.blockchains[BlockchainType.EOS], 'getTokenSmartTokens')
            .mockImplementationOnce(() => ({ aaacccaaaccc: 'AAACCC' }))
            .mockImplementationOnce(() => ({ aaacccaaaccc: 'AAACCC' }));

        await sdk.refresh();

        const received = await sdk.conversionPaths.getPath(
            { blockchainType: BlockchainType.EOS, blockchainId: 'cccccccccccc', symbol: 'CCC' },
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' }
        );

        const expected = [
            { blockchainType: BlockchainType.EOS, blockchainId: 'cccccccccccc', symbol: 'CCC' },
            { blockchainType: BlockchainType.EOS, blockchainId: 'aaacccaaaccc', symbol: 'AAACCC' },
            { blockchainType: BlockchainType.EOS, blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' },
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x3333333333333333333333333333333333333333' },
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x2222222222222222222222222222222222222222' },
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' }
        ];

        expect(received).toEqual(expected);
        expect(spyGetGraph).toHaveBeenCalledTimes(1);
        expect(spyGetDecimals).toHaveBeenCalledTimes(2);
        expect(spyGetAnchorToken).toHaveBeenCalledTimes(2);
        expect(spyGetTokenSmartTokens).toHaveBeenCalledTimes(2);
        expect(spyGetContractAddresses).toHaveBeenCalledTimes(3);
    });

    it('getPath from ethereum token to eos token', async () => {
        const spyGetContractAddresses = jest
            .spyOn(ethereum, 'getContractAddresses')
            .mockImplementation(() => ({ anchorToken: '0x3333333333333333333333333333333333333333',
                                         pivotTokens: ['0x3333333333333333333333333333333333333333'] }));

        const spyGetGraph = jest
            .spyOn(ethereum, 'getGraph')
            .mockImplementationOnce(() => Promise.resolve({
               '0x1111111111111111111111111111111111111111' : ['0x2222222222222222222222222222222222222222'],
               '0x2222222222222222222222222222222222222222' : ['0x1111111111111111111111111111111111111111', '0x3333333333333333333333333333333333333333'],
               '0x3333333333333333333333333333333333333333' : ['0x2222222222222222222222222222222222222222']
            }));

        const spyGetDecimals = jest
            .spyOn(ethereum, 'getDecimals')
            .mockImplementationOnce(() => Promise.resolve('10'))
            .mockImplementationOnce(() => Promise.resolve('10'));

        ethereumMocks.setRatesGetter(sdk._core.blockchains[BlockchainType.Ethereum], ['123123123']);

        const spyGetAnchorToken = jest
            .spyOn(eos, 'getAnchorToken')
            .mockImplementationOnce(() => ({ blockchainType: BlockchainType.EOS, blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }))
            .mockImplementationOnce(() => ({ blockchainType: BlockchainType.EOS, blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }));

        const spyGetTokenSmartTokens = jest
            .spyOn(sdk._core.blockchains[BlockchainType.EOS], 'getTokenSmartTokens')
            .mockImplementationOnce(() => ({ aaacccaaaccc: 'AAACCC' }))
            .mockImplementationOnce(() => ({ aaacccaaaccc: 'AAACCC' }));

        await sdk.refresh();

        const received = await sdk.conversionPaths.getPath(
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' },
            { blockchainType: BlockchainType.EOS, blockchainId: 'cccccccccccc', symbol: 'CCC' }
        );

        const expected = [
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' },
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x2222222222222222222222222222222222222222' },
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x3333333333333333333333333333333333333333' },
            { blockchainType: BlockchainType.EOS, blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' },
            { blockchainType: BlockchainType.EOS, blockchainId: 'aaacccaaaccc', symbol: 'AAACCC' },
            { blockchainType: BlockchainType.EOS, blockchainId: 'cccccccccccc', symbol: 'CCC' }
        ];

        expect(received).toEqual(expected);
        expect(spyGetGraph).toHaveBeenCalledTimes(1);
        expect(spyGetDecimals).toHaveBeenCalledTimes(2);
        expect(spyGetAnchorToken).toHaveBeenCalledTimes(2);
        expect(spyGetTokenSmartTokens).toHaveBeenCalledTimes(2);
        expect(spyGetContractAddresses).toHaveBeenCalledTimes(3);
    });

    it('getPath from ethereum token to ethereum token', async () => {
        const spyGetPathsFunc = jest
            .spyOn(sdk._core.blockchains[BlockchainType.Ethereum], 'getPathsFunc')
            .mockImplementationOnce(sdk._core.blockchains[BlockchainType.Ethereum].getAllPathsFunc);

        const spyGetGraph = jest
            .spyOn(ethereum, 'getGraph')
            .mockImplementationOnce(() => Promise.resolve({
                '0x1111111111111111111111111111111111111111' : ['0x2222222222222222222222222222222222222222', '0x3333333333333333333333333333333333333333', '0x4444444444444444444444444444444444444444'],
                '0x2222222222222222222222222222222222222222' : ['0x3333333333333333333333333333333333333333', '0x4444444444444444444444444444444444444444', '0x1111111111111111111111111111111111111111'],
                '0x3333333333333333333333333333333333333333' : ['0x4444444444444444444444444444444444444444', '0x1111111111111111111111111111111111111111', '0x2222222222222222222222222222222222222222'],
                '0x4444444444444444444444444444444444444444' : ['0x1111111111111111111111111111111111111111', '0x2222222222222222222222222222222222222222', '0x3333333333333333333333333333333333333333']
            }));

        const spyGetDecimals = jest
            .spyOn(ethereum, 'getDecimals')
            .mockImplementationOnce(() => Promise.resolve('10'))
            .mockImplementationOnce(() => Promise.resolve('10'));

        ethereumMocks.setRatesGetter(sdk._core.blockchains[BlockchainType.Ethereum], ['5555555555', '4444444444', '3333333333', '2222222222', '1111111111']);

        await sdk.refresh();

        const received = await sdk.conversionPaths.getPath(
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' },
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x4444444444444444444444444444444444444444' }
        );

        const expected = [
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' },
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x2222222222222222222222222222222222222222' },
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x3333333333333333333333333333333333333333' },
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x4444444444444444444444444444444444444444' }
        ];

        expect(received).toEqual(expected);
        expect(spyGetGraph).toHaveBeenCalledTimes(1);
        expect(spyGetDecimals).toHaveBeenCalledTimes(2);
        expect(spyGetPathsFunc).toHaveBeenCalledTimes(1);
    });

    it('getAllPathsAndRates from eos token to eos token', async () => {
        const promise = sdk._core.getAllPathsAndRates(
            { blockchainType: BlockchainType.EOS, blockchainId: '', symbol: '' },
            { blockchainType: BlockchainType.EOS, blockchainId: '', symbol: '' }
        );
        expect(promise).rejects.toEqual(new Error('getAllPathsAndRates from eos token to eos token not supported'));
    });

    it('getAllPathsAndRates from eos token to ethereum token', async () => {
        const promise = sdk._core.getAllPathsAndRates(
            { blockchainType: BlockchainType.EOS, blockchainId: '', symbol: '' },
            { blockchainType: BlockchainType.Ethereum, blockchainId: '' }
        );
        expect(promise).rejects.toEqual(new Error('getAllPathsAndRates from eos token to ethereum token not supported'));
    });

    it('getAllPathsAndRates from ethereum token to eos token', async () => {
        const promise = sdk._core.getAllPathsAndRates(
            { blockchainType: BlockchainType.Ethereum, blockchainId: '' },
            { blockchainType: BlockchainType.EOS, blockchainId: '', symbol: '' }
        );
        expect(promise).rejects.toEqual(new Error('getAllPathsAndRates from ethereum token to eos token not supported'));
    });

    it('getAllPathsAndRates from ethereum token to ethereum token', async () => {
        const spyGetPathsFunc = jest
            .spyOn(sdk._core.blockchains[BlockchainType.Ethereum], 'getPathsFunc')
            .mockImplementationOnce(sdk._core.blockchains[BlockchainType.Ethereum].getAllPathsFunc);

        const spyGetGraph = jest
            .spyOn(ethereum, 'getGraph')
            .mockImplementationOnce(() => Promise.resolve({
                '0x1111111111111111111111111111111111111111' : ['0x2222222222222222222222222222222222222222', '0x3333333333333333333333333333333333333333', '0x4444444444444444444444444444444444444444'],
                '0x2222222222222222222222222222222222222222' : ['0x3333333333333333333333333333333333333333', '0x4444444444444444444444444444444444444444', '0x1111111111111111111111111111111111111111'],
                '0x3333333333333333333333333333333333333333' : ['0x4444444444444444444444444444444444444444', '0x1111111111111111111111111111111111111111', '0x2222222222222222222222222222222222222222'],
                '0x4444444444444444444444444444444444444444' : ['0x1111111111111111111111111111111111111111', '0x2222222222222222222222222222222222222222', '0x3333333333333333333333333333333333333333']
            }));

        const spyGetDecimals = jest
            .spyOn(ethereum, 'getDecimals')
            .mockImplementationOnce(() => Promise.resolve('10'))
            .mockImplementationOnce(() => Promise.resolve('10'));

        ethereumMocks.setRatesGetter(sdk._core.blockchains[BlockchainType.Ethereum], ['5555555555', '4444444444', '3333333333', '2222222222', '1111111111']);

        await sdk.refresh();

        const received = await sdk._core.getAllPathsAndRates(
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' },
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x4444444444444444444444444444444444444444' }
        );

        const expected = [
            {
                path: [
                    { blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' },
                    { blockchainType: BlockchainType.Ethereum, blockchainId: '0x2222222222222222222222222222222222222222' },
                    { blockchainType: BlockchainType.Ethereum, blockchainId: '0x3333333333333333333333333333333333333333' },
                    { blockchainType: BlockchainType.Ethereum, blockchainId: '0x4444444444444444444444444444444444444444' }
                ],
                rate: '0.5555555555'
            },
            {
                path: [
                    { blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' },
                    { blockchainType: BlockchainType.Ethereum, blockchainId: '0x2222222222222222222222222222222222222222' },
                    { blockchainType: BlockchainType.Ethereum, blockchainId: '0x4444444444444444444444444444444444444444' }
                ],
                rate: '0.4444444444'
            },
            {
                path: [
                    { blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' },
                    { blockchainType: BlockchainType.Ethereum, blockchainId: '0x3333333333333333333333333333333333333333' },
                    { blockchainType: BlockchainType.Ethereum, blockchainId: '0x4444444444444444444444444444444444444444' }
                ],
                rate: '0.3333333333'
            },
            {
                path: [
                    { blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' },
                    { blockchainType: BlockchainType.Ethereum, blockchainId: '0x3333333333333333333333333333333333333333' },
                    { blockchainType: BlockchainType.Ethereum, blockchainId: '0x2222222222222222222222222222222222222222' },
                    { blockchainType: BlockchainType.Ethereum, blockchainId: '0x4444444444444444444444444444444444444444' }
                ],
                rate: '0.2222222222'
            },
            {
                path: [
                    { blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' },
                    { blockchainType: BlockchainType.Ethereum, blockchainId: '0x4444444444444444444444444444444444444444' }
                ],
                rate: '0.1111111111'
            }
        ];

        expect(received).toEqual(expected);
        expect(spyGetGraph).toHaveBeenCalledTimes(1);
        expect(spyGetDecimals).toHaveBeenCalledTimes(2);
        expect(spyGetPathsFunc).toHaveBeenCalledTimes(1);
    });
});
