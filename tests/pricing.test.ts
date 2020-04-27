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

    it('getPathAndRate from ethereum token to ethereum token using getAllPathsFunc', async () => {
        const blockchain = sdk._core.blockchains[BlockchainType.Ethereum] as ethereum.Ethereum;
        const spyGetPathsFunc = jest
            .spyOn(blockchain, 'getPathsFunc')
            .mockImplementationOnce(blockchain.getAllPathsFunc);

        const spyGetGraph = jest
            .spyOn(ethereum, 'getGraph')
            .mockImplementationOnce(() => Promise.resolve({
                '0x1111111111111111111111111111111111111111' : ['0x2222222222222222222222222222222222222222', '0x3333333333333333333333333333333333333333', '0x4444444444444444444444444444444444444444'],
                '0x2222222222222222222222222222222222222222' : ['0x3333333333333333333333333333333333333333', '0x4444444444444444444444444444444444444444', '0x1111111111111111111111111111111111111111'],
                '0x3333333333333333333333333333333333333333' : ['0x4444444444444444444444444444444444444444', '0x1111111111111111111111111111111111111111', '0x2222222222222222222222222222222222222222'],
                '0x4444444444444444444444444444444444444444' : ['0x1111111111111111111111111111111111111111', '0x2222222222222222222222222222222222222222', '0x3333333333333333333333333333333333333333']
            }));

        const spyGetRates = jest
            .spyOn(ethereum, 'getRates')
            .mockImplementationOnce(() => Promise.reject())
            .mockImplementationOnce(() => Promise.reject())
            .mockImplementationOnce(() => Promise.resolve(['11111111111111111111']))
            .mockImplementationOnce(() => Promise.resolve(['22222222222222222222']))
            .mockImplementationOnce(() => Promise.reject())
            .mockImplementationOnce(() => Promise.resolve(['22222222222222222222']))
            .mockImplementationOnce(() => Promise.reject())
            .mockImplementationOnce(() => Promise.resolve(['11111111111111111111']))
            .mockImplementationOnce(() => Promise.resolve(['33333333333333333333']));

        const spyGetDecimals = jest
            .spyOn(ethereum, 'getDecimals')
            .mockImplementationOnce(() => Promise.resolve('18'))
            .mockImplementationOnce(() => Promise.resolve('18'));

        await sdk.refresh();

        const received = await sdk.pricing.getPathAndRate(
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' },
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x4444444444444444444444444444444444444444' }
        );

        const expected = {
            path: [
                { blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' },
                { blockchainType: BlockchainType.Ethereum, blockchainId: '0x4444444444444444444444444444444444444444' }
            ],
            rate: '33.333333333333333333'
        };

        expect(received).toEqual(expected);
        expect(spyGetGraph).toHaveBeenCalledTimes(1);
        expect(spyGetRates).toHaveBeenCalledTimes(9);
        expect(spyGetDecimals).toHaveBeenCalledTimes(2);
    });

    it('getPathAndRate from ethereum token to ethereum token using getSomePathsFunc', async () => {
        const blockchain = sdk._core.blockchains[BlockchainType.Ethereum] as ethereum.Ethereum;
        const spyGetPathsFunc = jest
            .spyOn(blockchain, 'getPathsFunc')
            .mockImplementationOnce(blockchain.getSomePathsFunc);

        const spyGetContractAddresses = jest
            .spyOn(ethereum, 'getContractAddresses')
            .mockImplementation(() => ({
                anchorToken: '0x1111111111111111111111111111111111111111',
                pivotTokens: ['0x4444444444444444444444444444444444444444']
            }));

        const spyGetGraph = jest
            .spyOn(ethereum, 'getGraph')
            .mockImplementationOnce(() => Promise.resolve({
                '0x1111111111111111111111111111111111111111' : ['0x2222222222222222222222222222222222222222', '0x3333333333333333333333333333333333333333', '0x4444444444444444444444444444444444444444'],
                '0x2222222222222222222222222222222222222222' : ['0x3333333333333333333333333333333333333333', '0x4444444444444444444444444444444444444444', '0x1111111111111111111111111111111111111111'],
                '0x3333333333333333333333333333333333333333' : ['0x4444444444444444444444444444444444444444', '0x1111111111111111111111111111111111111111', '0x2222222222222222222222222222222222222222'],
                '0x4444444444444444444444444444444444444444' : ['0x1111111111111111111111111111111111111111', '0x2222222222222222222222222222222222222222', '0x3333333333333333333333333333333333333333']
            }));

        const spyGetRates = jest
            .spyOn(ethereum, 'getRates')
            .mockImplementationOnce(() => Promise.reject())
            .mockImplementationOnce(() => Promise.resolve(['11111111111111111111']))
            .mockImplementationOnce(() => Promise.reject())
            .mockImplementationOnce(() => Promise.resolve(['22222222222222222222']))
            .mockImplementationOnce(() => Promise.resolve(['33333333333333333333']))

        const spyGetDecimals = jest
            .spyOn(ethereum, 'getDecimals')
            .mockImplementationOnce(() => Promise.resolve('18'))
            .mockImplementationOnce(() => Promise.resolve('18'));

        await sdk.refresh();

        const received = await sdk.pricing.getPathAndRate(
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' },
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x4444444444444444444444444444444444444444' }
        );

        const expected = {
            path: [
                { blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' },
                { blockchainType: BlockchainType.Ethereum, blockchainId: '0x4444444444444444444444444444444444444444' }
            ],
            rate: '33.333333333333333333'
        };

        expect(received).toEqual(expected);
        expect(spyGetGraph).toHaveBeenCalledTimes(1);
        expect(spyGetRates).toHaveBeenCalledTimes(5);
        expect(spyGetDecimals).toHaveBeenCalledTimes(2);
        expect(spyGetContractAddresses).toHaveBeenCalledTimes(2);
    });

    it('getPathAndRate from ethereum token to eos token', async () => {
    });

    it('getPathAndRate from eos token to ethereum token', async () => {
    });

    it('getPathAndRate from eos token to eos token', async () => {
    });

    it('getRateByPath from ethereum token to ethereum', async () => {
        const spyGetReturn = jest
            .spyOn(ethereum, 'getReturn')
            .mockImplementationOnce(() => Promise.resolve(['11111111111111111111']));

        const spyGetDecimals = jest
            .spyOn(ethereum, 'getDecimals')
            .mockImplementationOnce(() => Promise.resolve('18'))
            .mockImplementationOnce(() => Promise.resolve('18'));

        await sdk.refresh();

        const received = await sdk.pricing.getRateByPath([
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' },
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x2222222222222222222222222222222222222222' },
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x3333333333333333333333333333333333333333' }
        ]);

        expect(received).toEqual('11.111111111111111111');
        expect(spyGetReturn).toHaveBeenCalledTimes(1);
        expect(spyGetDecimals).toHaveBeenCalledTimes(2);
    });

    it('getRateByPath from ethereum token to eos', async () => {
    });

    it('getRateByPath from eos token to ethereum', async () => {
    });

    it('getRateByPath from eos token to eos', async () => {
    });
});
