import { SDK } from '../src/index';
import * as eos from '../src/blockchains/eos';
import * as ethereum from '../src/blockchains/ethereum';

describe('paths test', () => {
    const sdk = new SDK();

    beforeEach(() => {
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('generatePath from eos token to ethereum token', async () => {
        const spyGetContractAddresses = jest
            .spyOn(ethereum, 'getContractAddresses')
            .mockImplementationOnce(() => ({ anchorToken: '0x3333333333333333333333333333333333333333' }));

        const spyGetGraph = jest
            .spyOn(ethereum, 'getGraph')
            .mockImplementationOnce(() => Promise.resolve({
               '0x1111111111111111111111111111111111111111' : ['0x2222222222222222222222222222222222222222'],
               '0x2222222222222222222222222222222222222222' : ['0x1111111111111111111111111111111111111111', '0x3333333333333333333333333333333333333333'],
               '0x3333333333333333333333333333333333333333' : ['0x2222222222222222222222222222222222222222']
            }));

        const spyGetDecimals = jest
            .spyOn(ethereum, 'getDecimals')
            .mockImplementationOnce(() => Promise.resolve('18'))
            .mockImplementationOnce(() => Promise.resolve('18'));

        const spyGetRates = jest
            .spyOn(ethereum, 'getRates')
            .mockImplementationOnce(() => Promise.resolve(['0']));

        const spyGetAnchorToken = jest
            .spyOn(eos, 'getAnchorToken')
            .mockImplementationOnce(() => ({ blockchainType: 'eos', blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }))
            .mockImplementationOnce(() => ({ blockchainType: 'eos', blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }));

        const spyGetConvertibleTokens = jest
            .spyOn(eos, 'getConvertibleTokens')
            .mockImplementationOnce(() => ({ AAA: { AAACCC: 'aaacccaaaccc' } }))
            .mockImplementationOnce(() => ({ CCC: { AAACCC: 'aaacccaaaccc' } }));

        const spyGetSmartTokens = jest
            .spyOn(eos, 'getSmartTokens')
            .mockImplementationOnce(() => ({ }))
            .mockImplementationOnce(() => ({ }));

        const spyGetReservesFromCode = jest
            .spyOn(eos, 'getReservesFromCode')
            .mockResolvedValueOnce({
                rows: [{
                    contract: 'aaaaaaaaaaaa',
                    currency: '0.0 AAA'
                }]
            });

        const response = await sdk.generatePath(
            { blockchainType: 'eos', blockchainId: 'cccccccccccc', symbol: 'CCC' },
            { blockchainType: 'ethereum', blockchainId: '0x1111111111111111111111111111111111111111' }
        );

        const expectedResult = [
            [
                { blockchainType: 'eos', blockchainId: 'cccccccccccc', symbol: 'CCC' },
                { blockchainType: 'eos', blockchainId: 'aaacccaaaccc', symbol: 'AAACCC' },
                { blockchainType: 'eos', blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }
            ],
            [
                { blockchainType: 'ethereum', blockchainId: '0x3333333333333333333333333333333333333333' },
                { blockchainType: 'ethereum', blockchainId: '0x2222222222222222222222222222222222222222' },
                { blockchainType: 'ethereum', blockchainId: '0x1111111111111111111111111111111111111111' }
            ]
        ];

        expect(response).toEqual(expectedResult);
        expect(spyGetGraph).toHaveBeenCalledTimes(1);
        expect(spyGetDecimals).toHaveBeenCalledTimes(2);
        expect(spyGetRates).toHaveBeenCalledTimes(1);
        expect(spyGetAnchorToken).toHaveBeenCalledTimes(2);
        expect(spyGetConvertibleTokens).toHaveBeenCalledTimes(2);
        expect(spyGetSmartTokens).toHaveBeenCalledTimes(2);
        expect(spyGetReservesFromCode).toHaveBeenCalledTimes(1);
        expect(spyGetContractAddresses).toHaveBeenCalledTimes(1);
    });

    it('generatePath from eos token to eos token', async () => {
        const spyGetAnchorToken = jest
            .spyOn(eos, 'getAnchorToken')
            .mockImplementationOnce(() => ({ blockchainType: 'eos', blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }));

        const spyGetConvertibleTokens = jest
            .spyOn(eos, 'getConvertibleTokens')
            .mockImplementationOnce(() => ({ AAA: { AAACCC: 'aaacccaaaccc' } }))
            .mockImplementationOnce(() => ({ CCC: { AAACCC: 'aaacccaaaccc' } }));

        const spyGetSmartTokens = jest
            .spyOn(eos, 'getSmartTokens')
            .mockImplementationOnce(() => ({ }))
            .mockImplementationOnce(() => ({ }));

        const spyGetReservesFromCode = jest
            .spyOn(eos, 'getReservesFromCode')
            .mockResolvedValueOnce({
                rows: [{
                    contract: 'aaaaaaaaaaaa',
                    currency: '0.0 AAA'
                }]
            });

        const response = await sdk.generatePath(
            { blockchainType: 'eos', blockchainId: 'cccccccccccc', symbol: 'CCC' },
            { blockchainType: 'eos', blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }
        );

        const expectedResult = [
            [
                { blockchainType: 'eos', blockchainId: 'cccccccccccc', symbol: 'CCC' },
                { blockchainType: 'eos', blockchainId: 'aaacccaaaccc', symbol: 'AAACCC' },
                { blockchainType: 'eos', blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }
            ]
        ];

        expect(response).toEqual(expectedResult);
        expect(spyGetAnchorToken).toHaveBeenCalledTimes(1);
        expect(spyGetConvertibleTokens).toHaveBeenCalledTimes(2);
        expect(spyGetSmartTokens).toHaveBeenCalledTimes(2);
        expect(spyGetReservesFromCode).toHaveBeenCalledTimes(1);
    });

    it('generatePath from ethereum token to eos token', async () => {
        const spyGetContractAddresses = jest
            .spyOn(ethereum, 'getContractAddresses')
            .mockImplementationOnce(() => ({ anchorToken: '0x3333333333333333333333333333333333333333' }));

        const spyGetGraph = jest
            .spyOn(ethereum, 'getGraph')
            .mockImplementationOnce(() => Promise.resolve({
               '0x1111111111111111111111111111111111111111' : ['0x2222222222222222222222222222222222222222'],
               '0x2222222222222222222222222222222222222222' : ['0x1111111111111111111111111111111111111111', '0x3333333333333333333333333333333333333333'],
               '0x3333333333333333333333333333333333333333' : ['0x2222222222222222222222222222222222222222']
            }));

        const spyGetDecimals = jest
            .spyOn(ethereum, 'getDecimals')
            .mockImplementationOnce(() => Promise.resolve('18'))
            .mockImplementationOnce(() => Promise.resolve('18'));

        const spyGetRates = jest
            .spyOn(ethereum, 'getRates')
            .mockImplementationOnce(() => Promise.resolve(['0']));

        const spyGetAnchorToken = jest
            .spyOn(eos, 'getAnchorToken')
            .mockImplementationOnce(() => ({ blockchainType: 'eos', blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }))
            .mockImplementationOnce(() => ({ blockchainType: 'eos', blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }));

        const spyGetConvertibleTokens = jest
            .spyOn(eos, 'getConvertibleTokens')
            .mockImplementationOnce(() => ({ AAA: { AAACCC: 'aaacccaaaccc' } }))
            .mockImplementationOnce(() => ({ CCC: { AAACCC: 'aaacccaaaccc' } }));

        const spyGetSmartTokens = jest
            .spyOn(eos, 'getSmartTokens')
            .mockImplementationOnce(() => ({ }))
            .mockImplementationOnce(() => ({ }));

        const spyGetReservesFromCode = jest
            .spyOn(eos, 'getReservesFromCode')
            .mockResolvedValueOnce({
                rows: [{
                    contract: 'aaaaaaaaaaaa',
                    currency: '0.0 AAA'
                }]
            });

        const response = await sdk.generatePath(
            { blockchainType: 'ethereum', blockchainId: '0x1111111111111111111111111111111111111111' },
            { blockchainType: 'eos', blockchainId: 'cccccccccccc', symbol: 'CCC' }
        );

        const expectedResult = [
            [
                { blockchainType: 'ethereum', blockchainId: '0x1111111111111111111111111111111111111111' },
                { blockchainType: 'ethereum', blockchainId: '0x2222222222222222222222222222222222222222' },
                { blockchainType: 'ethereum', blockchainId: '0x3333333333333333333333333333333333333333' }
            ],
            [
                { blockchainType: 'eos', blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' },
                { blockchainType: 'eos', blockchainId: 'aaacccaaaccc', symbol: 'AAACCC' },
                { blockchainType: 'eos', blockchainId: 'cccccccccccc', symbol: 'CCC' }
            ]
        ];

        expect(response).toEqual(expectedResult);
        expect(spyGetGraph).toHaveBeenCalledTimes(1);
        expect(spyGetDecimals).toHaveBeenCalledTimes(2);
        expect(spyGetRates).toHaveBeenCalledTimes(1);
        expect(spyGetAnchorToken).toHaveBeenCalledTimes(2);
        expect(spyGetConvertibleTokens).toHaveBeenCalledTimes(2);
        expect(spyGetSmartTokens).toHaveBeenCalledTimes(2);
        expect(spyGetReservesFromCode).toHaveBeenCalledTimes(1);
        expect(spyGetContractAddresses).toHaveBeenCalledTimes(1);
    });

    it('generatePath from ethereum token to ethereum token', async () => {
        const spyGetGraph = jest
            .spyOn(ethereum, 'getGraph')
            .mockImplementationOnce(() => Promise.resolve({
                '0x1111111111111111111111111111111111111111' : ['0x2222222222222222222222222222222222222222'],
                '0x2222222222222222222222222222222222222222' : ['0x1111111111111111111111111111111111111111', '0x3333333333333333333333333333333333333333'],
                '0x3333333333333333333333333333333333333333' : ['0x2222222222222222222222222222222222222222', '0x4444444444444444444444444444444444444444'],
                '0x4444444444444444444444444444444444444444' : ['0x3333333333333333333333333333333333333333', '0x5555555555555555555555555555555555555555'],
                '0x5555555555555555555555555555555555555555' : ['0x4444444444444444444444444444444444444444']
            }));

        const spyGetDecimals = jest
            .spyOn(ethereum, 'getDecimals')
            .mockImplementationOnce(() => Promise.resolve('18'))
            .mockImplementationOnce(() => Promise.resolve('18'));

        const spyGetRates = jest
            .spyOn(ethereum, 'getRates')
            .mockImplementationOnce(() => Promise.resolve(['0']));

        const response = await sdk.generatePath(
            { blockchainType: 'ethereum', blockchainId: '0x1111111111111111111111111111111111111111' },
            { blockchainType: 'ethereum', blockchainId: '0x5555555555555555555555555555555555555555' }
        );

        const expectedResult = [
            [
                { blockchainType: 'ethereum', blockchainId: '0x1111111111111111111111111111111111111111' },
                { blockchainType: 'ethereum', blockchainId: '0x2222222222222222222222222222222222222222' },
                { blockchainType: 'ethereum', blockchainId: '0x3333333333333333333333333333333333333333' },
                { blockchainType: 'ethereum', blockchainId: '0x4444444444444444444444444444444444444444' },
                { blockchainType: 'ethereum', blockchainId: '0x5555555555555555555555555555555555555555' }
            ]
        ];

        expect(response).toEqual(expectedResult);
        expect(spyGetGraph).toHaveBeenCalledTimes(1);
        expect(spyGetDecimals).toHaveBeenCalledTimes(2);
        expect(spyGetRates).toHaveBeenCalledTimes(1);
    });

    it('getAllPathsAndRates from ethereum token to ethereum token', async () => {
        const spyGetGraph = jest
            .spyOn(ethereum, 'getGraph')
            .mockImplementationOnce(() => Promise.resolve({
                '0x1111111111111111111111111111111111111111' : ['0x2222222222222222222222222222222222222222'],
                '0x2222222222222222222222222222222222222222' : ['0x1111111111111111111111111111111111111111', '0x3333333333333333333333333333333333333333'],
                '0x3333333333333333333333333333333333333333' : ['0x2222222222222222222222222222222222222222', '0x4444444444444444444444444444444444444444'],
                '0x4444444444444444444444444444444444444444' : ['0x3333333333333333333333333333333333333333', '0x5555555555555555555555555555555555555555'],
                '0x5555555555555555555555555555555555555555' : ['0x4444444444444444444444444444444444444444']
            }));

        const spyGetDecimals = jest
            .spyOn(ethereum, 'getDecimals')
            .mockImplementationOnce(() => Promise.resolve('4'))
            .mockImplementationOnce(() => Promise.resolve('4'));

        const spyGetRates = jest
            .spyOn(ethereum, 'getRates')
            .mockImplementationOnce(() => Promise.resolve(['12345678']));

        const response = await sdk.getAllPathsAndRates(
            { blockchainType: 'ethereum', blockchainId: '0x1111111111111111111111111111111111111111' },
            { blockchainType: 'ethereum', blockchainId: '0x5555555555555555555555555555555555555555' }
        );

        const expectedResult = [{
            path: [
                { blockchainType: 'ethereum', blockchainId: '0x1111111111111111111111111111111111111111' },
                { blockchainType: 'ethereum', blockchainId: '0x2222222222222222222222222222222222222222' },
                { blockchainType: 'ethereum', blockchainId: '0x3333333333333333333333333333333333333333' },
                { blockchainType: 'ethereum', blockchainId: '0x4444444444444444444444444444444444444444' },
                { blockchainType: 'ethereum', blockchainId: '0x5555555555555555555555555555555555555555' }
            ],
            rate: '1234.5678'
        }];

        expect(response).toEqual(expectedResult);
        expect(spyGetGraph).toHaveBeenCalledTimes(1);
        expect(spyGetDecimals).toHaveBeenCalledTimes(2);
        expect(spyGetRates).toHaveBeenCalledTimes(1);
    });
});
