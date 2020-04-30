import { legacyConverters } from './mocks/eos'
jest.mock('../src/blockchains/eos/legacy_converters', () => legacyConverters);

import { SDK } from '../src';
import { BlockchainType } from '../src/types';
import * as eos from '../src/blockchains/eos';
import * as ethereum from '../src/blockchains/ethereum';
import * as ethereumMocks from './mocks/ethereum';
import * as eosMocks from './mocks/eos';

const ethereumTokens = {
    '0x2222222222222222222222222222222222222222': ['0x1111111111111111111111111111111111111111'],
    '0x3333333333333333333333333333333333333333': ['0x1111111111111111111111111111111111111111'],
    '0x4444444444444444444444444444444444444444': ['0x2222222222222222222222222222222222222222', '0x9999999999999999999999999999999999999999'],
    '0x5555555555555555555555555555555555555555': ['0x2222222222222222222222222222222222222222', '0x8888888888888888888888888888888888888888'],
    '0x6666666666666666666666666666666666666666': ['0x3333333333333333333333333333333333333333', '0x8888888888888888888888888888888888888888'],
    '0x7777777777777777777777777777777777777777': ['0x3333333333333333333333333333333333333333', '0x9999999999999999999999999999999999999999']
};

const eosTable = {
    stat: {
        AAABBB: {aaabbbaaabbb: [{supply: '400000.0000 AAACCC', max_supply: '250000000.0000 AAACCC', issuer: 'converteraab'}]},
        AAACCC: {aaacccaaaccc: [{supply: '200000.0000 AAACCC', max_supply: '250000000.0000 AAACCC', issuer: 'converteraac'}]}
    },
    settings: {
        converteraab: {converteraab: [{fee: 1500}]},
        converteraac: {converteraac: [{fee: 2500}]}
    },
    reserves: {
        converteraab: {converteraab: [{contract: 'aaaaaaaaaaaa', currency: '0.0 AAA', ratio: 500000, p_enabled: 1}, {contract: 'bbbbbbbbbbbb', currency: '0.0 BBB', ratio: 500000, p_enabled: 1}]},
        converteraac: {converteraac: [{contract: 'aaaaaaaaaaaa', currency: '0.0 AAA', ratio: 500000, p_enabled: 1}, {contract: 'cccccccccccc', currency: '0.0 CCC', ratio: 500000, p_enabled: 1}]}
    },
    accounts: {
        converteraab: {
            aaaaaaaaaaaa: [{balance: '61730.2619 AAA'}],
            bbbbbbbbbbbb: [{balance: '81923.0163 CCC'}]
        },
        converteraac: {
            aaaaaaaaaaaa: [{balance: '5950.2395 AAA'}],
            cccccccccccc: [{balance: '35343.8280 CCC'}]
        }
    }
};

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

        const spyGetTokens = jest
            .spyOn(ethereum, 'getTokens')
            .mockImplementationOnce(() => Promise.resolve(ethereumTokens));

        const spyGetRates = jest
            .spyOn(ethereum, 'getRates')
            .mockImplementationOnce(() => Promise.reject())
            .mockImplementationOnce(() => Promise.resolve([
                '21113',
                '224999733',
                '22425888633',
                '224258633',
                '2249733'
            ]))
            .mockImplementationOnce(() => Promise.resolve([
                '225888633',
                '22524999733',
                '225249733',
                '2258633',
                '213'
            ]));

        const spyGetDecimals = jest
            .spyOn(ethereum, 'getDecimals')
            .mockImplementationOnce(() => Promise.resolve('11'))
            .mockImplementationOnce(() => Promise.resolve('11'));

        await sdk.refresh();

        const received = await sdk.pricing.getPathAndRate(
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x2222222222222222222222222222222222222222' },
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x3333333333333333333333333333333333333333' }
        );

        const expected = {
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
        };

        expect(received).toEqual(expected);
        expect(spyGetTokens).toHaveBeenCalledTimes(1);
        expect(spyGetRates).toHaveBeenCalledTimes(3);
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
                pivotTokens: ['0x8888888888888888888888888888888888888888', '0x9999999999999999999999999999999999999999']
            }));

        const spyGetTokens = jest
            .spyOn(ethereum, 'getTokens')
            .mockImplementationOnce(() => Promise.resolve(ethereumTokens));

        const spyGetRates = jest
            .spyOn(ethereum, 'getRates')
            .mockImplementationOnce(() => Promise.reject())
            .mockImplementationOnce(() => Promise.resolve([
                '2258633'
            ]))
            .mockImplementationOnce(() => Promise.resolve([
                '2249733'
            ]));

        const spyGetDecimals = jest
            .spyOn(ethereum, 'getDecimals')
            .mockImplementationOnce(() => Promise.resolve('7'))
            .mockImplementationOnce(() => Promise.resolve('7'));

        await sdk.refresh();

        const received = await sdk.pricing.getPathAndRate(
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

        expect(received).toEqual(expected);
        expect(spyGetTokens).toHaveBeenCalledTimes(1);
        expect(spyGetRates).toHaveBeenCalledTimes(3);
        expect(spyGetDecimals).toHaveBeenCalledTimes(2);
        expect(spyGetContractAddresses).toHaveBeenCalledTimes(2);
    });

    it('getPathAndRate from ethereum token to eos token', async () => {
        const spyGetContractAddresses = jest
            .spyOn(ethereum, 'getContractAddresses')
            .mockImplementation(() => ({
                anchorToken: '0x1111111111111111111111111111111111111111',
                pivotTokens: ['0x1111111111111111111111111111111111111111']
            }));

        const spyGetTokens = jest
            .spyOn(ethereum, 'getTokens')
            .mockImplementationOnce(() => Promise.resolve(ethereumTokens));

        const spyGetRates = jest
            .spyOn(ethereum, 'getRates')
            .mockImplementationOnce(() => Promise.resolve(['1000000000000000000']));

        const spyGetDecimals = jest
            .spyOn(ethereum, 'getDecimals')
            .mockImplementationOnce(() => Promise.resolve('18'))
            .mockImplementationOnce(() => Promise.resolve('18'));

        const blockchainEOS = sdk._core.blockchains[BlockchainType.EOS] as eos.EOS;
        jest.spyOn(sdk._core.blockchains[BlockchainType.EOS], 'getAnchorToken')
            .mockImplementationOnce(() => ({ blockchainType: BlockchainType.EOS, blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }));

        const spyGetTableRows = jest
            .spyOn(blockchainEOS.jsonRpc, 'get_table_rows')
            .mockImplementation((args: any) => eosMocks.jsonRpcGetTableRows(eosTable, args));

        await sdk.refresh();

        const received = await sdk.pricing.getPathAndRate(
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x2222222222222222222222222222222222222222' },
            { blockchainType: BlockchainType.EOS, blockchainId: 'bbbbbbbbbbbb', symbol: 'BBB' }
        );

        const expected = {
            path:[
                { blockchainType: BlockchainType.Ethereum, blockchainId: '0x2222222222222222222222222222222222222222' },
                { blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' },
                { blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' },
                { blockchainType: BlockchainType.EOS, blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' },
                { blockchainType: BlockchainType.EOS, blockchainId: 'aaabbbaaabbb', symbol: 'AAABBB' },
                { blockchainType: BlockchainType.EOS, blockchainId: 'bbbbbbbbbbbb', symbol: 'BBB'}
            ],
            rate: '1.3231'
        };

        expect(received).toEqual(expected);
        expect(spyGetTokens).toHaveBeenCalledTimes(1);
        expect(spyGetRates).toHaveBeenCalledTimes(1);
        expect(spyGetDecimals).toHaveBeenCalledTimes(2);
        expect(spyGetContractAddresses).toHaveBeenCalledTimes(3);
    });

    it('getPathAndRate from eos token to ethereum token', async () => { 
        const blockchainEOS = sdk._core.blockchains[BlockchainType.EOS] as eos.EOS;
        jest.spyOn(sdk._core.blockchains[BlockchainType.EOS], 'getAnchorToken')
            .mockImplementationOnce(() => ({ blockchainType: BlockchainType.EOS, blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }));

        const spyGetTableRows = jest
            .spyOn(blockchainEOS.jsonRpc, 'get_table_rows')
            .mockImplementation((args: any) => eosMocks.jsonRpcGetTableRows(eosTable, args));

        const spyGetContractAddresses = jest
            .spyOn(ethereum, 'getContractAddresses')
            .mockImplementation(() => ({
                anchorToken: '0x1111111111111111111111111111111111111111',
                pivotTokens: ['0x1111111111111111111111111111111111111111']
            }));

        const spyGetTokens = jest
            .spyOn(ethereum, 'getTokens')
            .mockImplementationOnce(() => Promise.resolve(ethereumTokens));

        const spyGetRates = jest
            .spyOn(ethereum, 'getRates')
            .mockImplementationOnce(() => Promise.resolve(['33333333333333333333']));

        const spyGetDecimals = jest
            .spyOn(ethereum, 'getDecimals')
            .mockImplementationOnce(() => Promise.resolve('18'))
            .mockImplementationOnce(() => Promise.resolve('18'));

        await sdk.refresh();

        const received = await sdk.pricing.getPathAndRate(
            { blockchainType: BlockchainType.EOS, blockchainId: 'bbbbbbbbbbbb', symbol: 'BBB' },
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x2222222222222222222222222222222222222222' }
        );

        const expected = {
            path:[
                { blockchainType: BlockchainType.EOS, blockchainId: 'bbbbbbbbbbbb', symbol: 'BBB'},
                { blockchainType: BlockchainType.EOS, blockchainId: 'aaabbbaaabbb', symbol: 'AAABBB' },
                { blockchainType: BlockchainType.EOS, blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' },
                { blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' },
                { blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' },
                { blockchainType: BlockchainType.Ethereum, blockchainId: '0x2222222222222222222222222222222222222222' }
            ],
            rate: '33.333333333333333333'
        };

        expect(received).toEqual(expected);
        expect(spyGetTokens).toHaveBeenCalledTimes(1);
        expect(spyGetRates).toHaveBeenCalledTimes(1);
        expect(spyGetDecimals).toHaveBeenCalledTimes(2);
        expect(spyGetContractAddresses).toHaveBeenCalledTimes(3);
    });

    it('getPathAndRate from eos token to eos token', async () => {
        const blockchainEOS = sdk._core.blockchains[BlockchainType.EOS] as eos.EOS;
        jest.spyOn(sdk._core.blockchains[BlockchainType.EOS], 'getAnchorToken')
            .mockImplementationOnce(() => ({ blockchainType: BlockchainType.EOS, blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }));

        const spyGetTableRows = jest
            .spyOn(blockchainEOS.jsonRpc, 'get_table_rows')
            .mockImplementation((args: any) => eosMocks.jsonRpcGetTableRows(eosTable, args));

        await sdk.refresh();

        const received = await sdk.pricing.getPathAndRate(
            { blockchainType: BlockchainType.EOS, blockchainId: 'bbbbbbbbbbbb', symbol: 'BBB' },
            { blockchainType: BlockchainType.EOS, blockchainId: 'cccccccccccc', symbol: 'CCC' }
        );

        const expected = {
            path:[
                { blockchainType: BlockchainType.EOS, blockchainId: 'bbbbbbbbbbbb', symbol: 'BBB'},
                { blockchainType: BlockchainType.EOS, blockchainId: 'aaabbbaaabbb', symbol: 'AAABBB' },
                { blockchainType: BlockchainType.EOS, blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' },
                { blockchainType: BlockchainType.EOS, blockchainId: 'aaacccaaaccc', symbol: 'AAACCC' },
                { blockchainType: BlockchainType.EOS, blockchainId: 'cccccccccccc', symbol: 'CCC' }
            ],
            rate: '4.4392'
        };

        expect(received).toEqual(expected);
    });

    it('getPathAndRate from eos token to eos token (smart -> reserve)', async () => {
        const blockchainEOS = sdk._core.blockchains[BlockchainType.EOS] as eos.EOS;
        jest.spyOn(sdk._core.blockchains[BlockchainType.EOS], 'getAnchorToken')
            .mockImplementationOnce(() => ({ blockchainType: BlockchainType.EOS, blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }));

        const spyGetTableRows = jest
            .spyOn(blockchainEOS.jsonRpc, 'get_table_rows')
            .mockImplementation((args: any) => eosMocks.jsonRpcGetTableRows(eosTable, args));

        await sdk.refresh();

        const received = await sdk.pricing.getPathAndRate(
            { blockchainType: BlockchainType.EOS, blockchainId: 'aaabbbaaabbb', symbol: 'AAABBB' },
            { blockchainType: BlockchainType.EOS, blockchainId: 'cccccccccccc', symbol: 'CCC' }
        );

        const expected = {
            path:[
                { blockchainType: BlockchainType.EOS, blockchainId: 'aaabbbaaabbb', symbol: 'AAABBB' },
                { blockchainType: BlockchainType.EOS, blockchainId: 'aaabbbaaabbb', symbol: 'AAABBB' },
                { blockchainType: BlockchainType.EOS, blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' },
                { blockchainType: BlockchainType.EOS, blockchainId: 'aaacccaaaccc', symbol: 'AAACCC' },
                { blockchainType: BlockchainType.EOS, blockchainId: 'cccccccccccc', symbol: 'CCC' }
            ],
            rate: '1.8208'
        };

        expect(received).toEqual(expected);
    });

    it('getPathAndRate from eos token to eos token (reserve -> smart)', async () => {
        const blockchainEOS = sdk._core.blockchains[BlockchainType.EOS] as eos.EOS;
        jest.spyOn(sdk._core.blockchains[BlockchainType.EOS], 'getAnchorToken')
            .mockImplementationOnce(() => ({ blockchainType: BlockchainType.EOS, blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }));

        const spyGetTableRows = jest
            .spyOn(blockchainEOS.jsonRpc, 'get_table_rows')
            .mockImplementation((args: any) => eosMocks.jsonRpcGetTableRows(eosTable, args));

        await sdk.refresh();

        const received = await sdk.pricing.getPathAndRate(
            { blockchainType: BlockchainType.EOS, blockchainId: 'bbbbbbbbbbbb', symbol: 'BBB' },
            { blockchainType: BlockchainType.EOS, blockchainId: 'aaacccaaaccc', symbol: 'AAACCC' }
        );

        const expected = {
            path:[
                { blockchainType: BlockchainType.EOS, blockchainId: 'bbbbbbbbbbbb', symbol: 'BBB'},
                { blockchainType: BlockchainType.EOS, blockchainId: 'aaabbbaaabbb', symbol: 'AAABBB' },
                { blockchainType: BlockchainType.EOS, blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' },
                { blockchainType: BlockchainType.EOS, blockchainId: 'aaacccaaaccc', symbol: 'AAACCC' },
                { blockchainType: BlockchainType.EOS, blockchainId: 'aaacccaaaccc', symbol: 'AAACCC' }
            ],
            rate: '12.5927'
        };

        expect(received).toEqual(expected);
    });

    it('getRateByPath from ethereum token to ethereum token', async () => {
        const spyGetRates = jest
            .spyOn(ethereum, 'getRates')
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
        expect(spyGetRates).toHaveBeenCalledTimes(1);
        expect(spyGetDecimals).toHaveBeenCalledTimes(2);
    });

    it('getRateByPath from ethereum token to eos token', async () => {
        const spyGetRates = jest
            .spyOn(ethereum, 'getRates')
            .mockImplementationOnce(() => Promise.resolve(['1000000000000000000']));

        const spyGetDecimals = jest
            .spyOn(ethereum, 'getDecimals')
            .mockImplementationOnce(() => Promise.resolve('18'))
            .mockImplementationOnce(() => Promise.resolve('18'));

        const blockchainEOS = sdk._core.blockchains[BlockchainType.EOS] as eos.EOS;
        const spyGetTableRows = jest
            .spyOn(blockchainEOS.jsonRpc, 'get_table_rows')
            .mockImplementation((args: any) => eosMocks.jsonRpcGetTableRows(eosTable, args));

        const received = await sdk.pricing.getRateByPath([
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' },
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x2222222222222222222222222222222222222222' },
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x3333333333333333333333333333333333333333' },
            { blockchainType: BlockchainType.EOS, blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' },
            { blockchainType: BlockchainType.EOS, blockchainId: 'aaabbbaaabbb', symbol: 'AAABBB' },
            { blockchainType: BlockchainType.EOS, blockchainId: 'bbbbbbbbbbbb', symbol: 'BBB'}
        ]);

        expect(received).toEqual('1.3231');
        expect(spyGetRates).toHaveBeenCalledTimes(1);
        expect(spyGetDecimals).toHaveBeenCalledTimes(2);
        expect(spyGetTableRows).toHaveBeenCalledTimes(5);
    });

    it('getRateByPath from eos token to ethereum token', async () => {
        const blockchainEOS = sdk._core.blockchains[BlockchainType.EOS] as eos.EOS;
        const spyGetTableRows = jest
            .spyOn(blockchainEOS.jsonRpc, 'get_table_rows')
            .mockImplementation((args: any) => eosMocks.jsonRpcGetTableRows(eosTable, args));

        const spyGetRates = jest
            .spyOn(ethereum, 'getRates')
            .mockImplementationOnce(() => Promise.resolve(['11111111111111111111']));

        const spyGetDecimals = jest
            .spyOn(ethereum, 'getDecimals')
            .mockImplementationOnce(() => Promise.resolve('18'))
            .mockImplementationOnce(() => Promise.resolve('18'));

        const received = await sdk.pricing.getRateByPath([
            { blockchainType: BlockchainType.EOS, blockchainId: 'bbbbbbbbbbbb', symbol: 'BBB'},
            { blockchainType: BlockchainType.EOS, blockchainId: 'aaabbbaaabbb', symbol: 'AAABBB' },
            { blockchainType: BlockchainType.EOS, blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' },
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x1111111111111111111111111111111111111111' },
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x2222222222222222222222222222222222222222' },
            { blockchainType: BlockchainType.Ethereum, blockchainId: '0x3333333333333333333333333333333333333333' }
        ]);

        expect(received).toEqual('11.111111111111111111');
        expect(spyGetTableRows).toHaveBeenCalledTimes(5);
        expect(spyGetRates).toHaveBeenCalledTimes(1);
        expect(spyGetDecimals).toHaveBeenCalledTimes(2);
    });

    it('getRateByPath from eos token to eos token', async () => {
        const blockchainEOS = sdk._core.blockchains[BlockchainType.EOS] as eos.EOS;
        const spyGetTableRows = jest
            .spyOn(blockchainEOS.jsonRpc, 'get_table_rows')
            .mockImplementation((args: any) => eosMocks.jsonRpcGetTableRows(eosTable, args));

        const received = await sdk.pricing.getRateByPath([
            { blockchainType: BlockchainType.EOS, blockchainId: 'bbbbbbbbbbbb', symbol: 'BBB'},
            { blockchainType: BlockchainType.EOS, blockchainId: 'aaabbbaaabbb', symbol: 'AAABBB' },
            { blockchainType: BlockchainType.EOS, blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' },
            { blockchainType: BlockchainType.EOS, blockchainId: 'aaacccaaaccc', symbol: 'AAACCC' },
            { blockchainType: BlockchainType.EOS, blockchainId: 'cccccccccccc', symbol: 'CCC' }
        ]);

        expect(received).toEqual('4.4392');
        expect(spyGetTableRows).toHaveBeenCalledTimes(10);
    });
});
