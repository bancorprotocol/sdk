import { legacyConverters } from './mocks/eos'
jest.mock('../src/blockchains/eos/legacy_converters', () => legacyConverters);

import { SDK } from '../src';
import { BlockchainType } from '../src/types';
import * as ethereum from '../src/blockchains/ethereum';
import * as ethereumMocks from './mocks/ethereum';

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

    it('getPaths from ethereum token to ethereum token', async () => {
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

        await sdk.refresh();

        const received = await sdk._core.getPaths(
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' },
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x4444444444444444444444444444444444444444' }
        );

        const expected = [
            [
                { blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' },
                { blockchainType: BlockchainType.Ethereum, blockchainId: '0x2222222222222222222222222222222222222222' },
                { blockchainType: BlockchainType.Ethereum, blockchainId: '0x3333333333333333333333333333333333333333' },
                { blockchainType: BlockchainType.Ethereum, blockchainId: '0x4444444444444444444444444444444444444444' }
            ],
            [
                { blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' },
                { blockchainType: BlockchainType.Ethereum, blockchainId: '0x2222222222222222222222222222222222222222' },
                { blockchainType: BlockchainType.Ethereum, blockchainId: '0x4444444444444444444444444444444444444444' }
            ],
            [
                { blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' },
                { blockchainType: BlockchainType.Ethereum, blockchainId: '0x3333333333333333333333333333333333333333' },
                { blockchainType: BlockchainType.Ethereum, blockchainId: '0x4444444444444444444444444444444444444444' }
            ],
            [
                { blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' },
                { blockchainType: BlockchainType.Ethereum, blockchainId: '0x3333333333333333333333333333333333333333' },
                { blockchainType: BlockchainType.Ethereum, blockchainId: '0x2222222222222222222222222222222222222222' },
                { blockchainType: BlockchainType.Ethereum, blockchainId: '0x4444444444444444444444444444444444444444' }
            ],
            [
                { blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' },
                { blockchainType: BlockchainType.Ethereum, blockchainId: '0x4444444444444444444444444444444444444444' }
            ]
        ];

        expect(received).toEqual(expected);
        expect(spyGetGraph).toHaveBeenCalledTimes(1);
        expect(spyGetPathsFunc).toHaveBeenCalledTimes(1);
    });

    it('getPaths from ethereum token to eos token', async () => {
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

        const spyGetAnchorToken = jest
            .spyOn(sdk._core.blockchains[BlockchainType.EOS], 'getAnchorToken')
            .mockImplementationOnce(() => ({ blockchainType: BlockchainType.EOS, blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }))
            .mockImplementationOnce(() => ({ blockchainType: BlockchainType.EOS, blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }));

        await sdk.refresh();

        const received = await sdk._core.getPaths(
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' },
            { blockchainType: BlockchainType.EOS, blockchainId: 'cccccccccccc', symbol: 'CCC' }
        );

        const expected = [[
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' },
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x2222222222222222222222222222222222222222' },
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x3333333333333333333333333333333333333333' },
            { blockchainType: BlockchainType.EOS, blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' },
            { blockchainType: BlockchainType.EOS, blockchainId: 'aaacccaaaccc', symbol: 'AAACCC' },
            { blockchainType: BlockchainType.EOS, blockchainId: 'cccccccccccc', symbol: 'CCC' }
        ]];

        expect(received).toEqual(expected);
        expect(spyGetGraph).toHaveBeenCalledTimes(1);
        expect(spyGetAnchorToken).toHaveBeenCalledTimes(2);
        expect(spyGetContractAddresses).toHaveBeenCalledTimes(3);
    });

    it('getPaths from eos token to ethereum token', async () => {
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

        const spyGetAnchorToken = jest
            .spyOn(sdk._core.blockchains[BlockchainType.EOS], 'getAnchorToken')
            .mockImplementationOnce(() => ({ blockchainType: BlockchainType.EOS, blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }))
            .mockImplementationOnce(() => ({ blockchainType: BlockchainType.EOS, blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }));

        await sdk.refresh();

        const received = await sdk._core.getPaths(
            { blockchainType: BlockchainType.EOS, blockchainId: 'cccccccccccc', symbol: 'CCC' },
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' }
        );

        const expected = [[
            { blockchainType: BlockchainType.EOS, blockchainId: 'cccccccccccc', symbol: 'CCC' },
            { blockchainType: BlockchainType.EOS, blockchainId: 'aaacccaaaccc', symbol: 'AAACCC' },
            { blockchainType: BlockchainType.EOS, blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' },
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x3333333333333333333333333333333333333333' },
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x2222222222222222222222222222222222222222' },
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' }
        ]];

        expect(received).toEqual(expected);
        expect(spyGetGraph).toHaveBeenCalledTimes(1);
        expect(spyGetAnchorToken).toHaveBeenCalledTimes(2);
        expect(spyGetContractAddresses).toHaveBeenCalledTimes(3);
    });

    it('getPaths from eos token to eos token', async () => {
        const spyGetAnchorToken = jest
            .spyOn(sdk._core.blockchains[BlockchainType.EOS], 'getAnchorToken')
            .mockImplementationOnce(() => ({ blockchainType: BlockchainType.EOS, blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }));

        await sdk.refresh();

        const received = await sdk._core.getPaths(
            { blockchainType: BlockchainType.EOS, blockchainId: 'cccccccccccc', symbol: 'CCC' },
            { blockchainType: BlockchainType.EOS, blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }
        );

        const expected = [[
            { blockchainType: BlockchainType.EOS, blockchainId: 'cccccccccccc', symbol: 'CCC' },
            { blockchainType: BlockchainType.EOS, blockchainId: 'aaacccaaaccc', symbol: 'AAACCC' },
            { blockchainType: BlockchainType.EOS, blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }
        ]];

        expect(received).toEqual(expected);
        expect(spyGetAnchorToken).toHaveBeenCalledTimes(1);
    });
});
