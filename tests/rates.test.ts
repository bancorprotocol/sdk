import { SDK } from '../src';
import { BlockchainType } from '../src/types';
import * as ethereum from '../src/blockchains/ethereum';
import * as ethereumMocks from './mocks/ethereum';

const ethereumTokens = {
    '0x2222222222222222222222222222222222222222': ['0x1111111111111111111111111111111111111111'],
    '0x3333333333333333333333333333333333333333': ['0x1111111111111111111111111111111111111111'],
    '0x4444444444444444444444444444444444444444': ['0x2222222222222222222222222222222222222222', '0x9999999999999999999999999999999999999999'],
    '0x5555555555555555555555555555555555555555': ['0x2222222222222222222222222222222222222222', '0x8888888888888888888888888888888888888888'],
    '0x6666666666666666666666666666666666666666': ['0x3333333333333333333333333333333333333333', '0x8888888888888888888888888888888888888888'],
    '0x7777777777777777777777777777777777777777': ['0x3333333333333333333333333333333333333333', '0x9999999999999999999999999999999999999999']
};

describe('rates test', () => {
    let sdk: SDK;

    beforeEach(async () => {
        jest.spyOn(ethereum, 'getWeb3').mockImplementationOnce(ethereumMocks.getWeb3);
        sdk = await SDK.create({ethereumNodeEndpoint: 'dummy'});
    });

    afterEach(async () => {
        await SDK.destroy(sdk);
        jest.restoreAllMocks();
    });

    it('getPathAndRate from ethereum token to ethereum token using getAllPathsFunc', async () => {
        const blockchain = sdk._core.blockchains[BlockchainType.Ethereum] as ethereum.Ethereum;

        const spyGetPathsFunc = jest
            .spyOn(blockchain, 'getPathsFunc')
            .mockImplementationOnce(blockchain.getAllPathsFunc);

        const spyGetTokens = jest
            .spyOn(ethereum, 'getTokens')
            .mockImplementationOnce(() => Promise.resolve(ethereumTokens));

        ethereumMocks.setRatesGetter(
            blockchain,
            [
                21113,
                224999733,
                22425888633,
                224258633,
                2249733,
                225888633,
                22524999733,
                225249733,
                2258633,
                213,
                422260,
                4499994660,
                448517772660,
                4485172660,
                44994660,
                4517772660,
                450499994660,
                4504994660,
                45172660,
                4260
            ]
        );

        const spyGetDecimals = jest
            .spyOn(ethereum, 'getDecimals')
            .mockImplementationOnce(() => Promise.resolve('11'))
            .mockImplementationOnce(() => Promise.resolve('11'));

        await sdk.refresh();

        const received = await sdk.pricing.getPathsAndRates(
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x2222222222222222222222222222222222222222' },
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x3333333333333333333333333333333333333333' },
            [ '1', '20' ]
        );

        const expected = [
            {
                path: [
                    { blockchainType: BlockchainType.Ethereum, blockchainId: '0x2222222222222222222222222222222222222222' },
                    { blockchainType: BlockchainType.Ethereum, blockchainId: '0x2222222222222222222222222222222222222222' },
                    { blockchainType: BlockchainType.Ethereum, blockchainId: '0x5555555555555555555555555555555555555555' },
                    { blockchainType: BlockchainType.Ethereum, blockchainId: '0x2222222222222222222222222222222222222222' },
                    { blockchainType: BlockchainType.Ethereum, blockchainId: '0x4444444444444444444444444444444444444444' },
                    { blockchainType: BlockchainType.Ethereum, blockchainId: '0x9999999999999999999999999999999999999999' },
                    { blockchainType: BlockchainType.Ethereum, blockchainId: '0x9999999999999999999999999999999999999999' },
                    { blockchainType: BlockchainType.Ethereum, blockchainId: '0x9999999999999999999999999999999999999999' },
                    { blockchainType: BlockchainType.Ethereum, blockchainId: '0x7777777777777777777777777777777777777777' },
                    { blockchainType: BlockchainType.Ethereum, blockchainId: '0x3333333333333333333333333333333333333333' },
                    { blockchainType: BlockchainType.Ethereum, blockchainId: '0x3333333333333333333333333333333333333333' }
                ],
                rate: '0.22524999733'
            },
            {
                path: [
                    { blockchainType: BlockchainType.Ethereum, blockchainId: '0x2222222222222222222222222222222222222222' },
                    { blockchainType: BlockchainType.Ethereum, blockchainId: '0x2222222222222222222222222222222222222222' },
                    { blockchainType: BlockchainType.Ethereum, blockchainId: '0x5555555555555555555555555555555555555555' },
                    { blockchainType: BlockchainType.Ethereum, blockchainId: '0x2222222222222222222222222222222222222222' },
                    { blockchainType: BlockchainType.Ethereum, blockchainId: '0x4444444444444444444444444444444444444444' },
                    { blockchainType: BlockchainType.Ethereum, blockchainId: '0x9999999999999999999999999999999999999999' },
                    { blockchainType: BlockchainType.Ethereum, blockchainId: '0x9999999999999999999999999999999999999999' },
                    { blockchainType: BlockchainType.Ethereum, blockchainId: '0x9999999999999999999999999999999999999999' },
                    { blockchainType: BlockchainType.Ethereum, blockchainId: '0x7777777777777777777777777777777777777777' },
                    { blockchainType: BlockchainType.Ethereum, blockchainId: '0x3333333333333333333333333333333333333333' },
                    { blockchainType: BlockchainType.Ethereum, blockchainId: '0x3333333333333333333333333333333333333333' }
                ],
                rate: '4.5049999466'
            }
        ];

        expect(received).toEqual(expected);
        expect(spyGetTokens).toHaveBeenCalledTimes(1);
        expect(spyGetDecimals).toHaveBeenCalledTimes(2);
    });

    it('getPathsAndRates from ethereum token to ethereum token using getSomePathsFunc', async () => {
        const blockchain = sdk._core.blockchains[BlockchainType.Ethereum] as ethereum.Ethereum;

        const spyGetPathsFunc = jest
            .spyOn(blockchain, 'getPathsFunc')
            .mockImplementationOnce(blockchain.getSomePathsFunc);

        const spyGetContractAddresses = jest
            .spyOn(ethereum, 'getContractAddresses')
            .mockImplementation(() => ({
                anchorToken: '0x1111111111111111111111111111111111111111',
                pivotTokens: ['0x8888888888888888888888888888888888888888', '0x9999999999999999999999999999999999999999']
            }));

        const spyGetTokens = jest
            .spyOn(ethereum, 'getTokens')
            .mockImplementationOnce(() => Promise.resolve(ethereumTokens));

        ethereumMocks.setRatesGetter(
            blockchain,
            [
                2258633,
                2249733
            ]
        );

        const spyGetDecimals = jest
            .spyOn(ethereum, 'getDecimals')
            .mockImplementationOnce(() => Promise.resolve('7'))
            .mockImplementationOnce(() => Promise.resolve('7'));

        await sdk.refresh();

        const received = await sdk.pricing.getPathsAndRates(
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x2222222222222222222222222222222222222222' },
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x3333333333333333333333333333333333333333' }
        );

        const expected = {
            path: [
                { blockchainType: BlockchainType.Ethereum, blockchainId: '0x2222222222222222222222222222222222222222' },
                { blockchainType: BlockchainType.Ethereum, blockchainId: '0x2222222222222222222222222222222222222222' },
                { blockchainType: BlockchainType.Ethereum, blockchainId: '0x5555555555555555555555555555555555555555' },
                { blockchainType: BlockchainType.Ethereum, blockchainId: '0x8888888888888888888888888888888888888888' },
                { blockchainType: BlockchainType.Ethereum, blockchainId: '0x6666666666666666666666666666666666666666' },
                { blockchainType: BlockchainType.Ethereum, blockchainId: '0x3333333333333333333333333333333333333333' },
                { blockchainType: BlockchainType.Ethereum, blockchainId: '0x3333333333333333333333333333333333333333' }
            ],
            rate: '0.2258633'
        };

        expect(received[0]).toEqual(expected);
        expect(spyGetTokens).toHaveBeenCalledTimes(1);
        expect(spyGetDecimals).toHaveBeenCalledTimes(2);
        expect(spyGetContractAddresses).toHaveBeenCalledTimes(2);
    });
});
