import { SDK } from '../src/index';
import * as eos from '../src/blockchains/eos';
import * as ethereum from '../src/blockchains/ethereum';

describe('Path finder tests', () => {
    const sdk = new SDK();

    beforeEach(() => {
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('generatePath from ethereum token to ethereum token', async () => {
        const spyGetGraph = jest
            .spyOn(ethereum, 'getGraph')
            .mockImplementation(() => Promise.resolve({
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

    it('generatePath from ethereum token to eos token', async () => {
        const spyGetContractAddresses = jest
            .spyOn(ethereum, 'getContractAddresses')
            .mockImplementation(() => ({anchorToken: '0x3333333333333333333333333333333333333333'}));

        const spyGetGraph = jest
            .spyOn(ethereum, 'getGraph')
            .mockImplementation(() => Promise.resolve({
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

        const spyGetReservesFromCode = jest
            .spyOn(eos, 'getReservesFromCode')
            .mockResolvedValueOnce({
                rows: [{
                    contract: 'bntbntbntbnt',
                    currency: '0.0000000000 BNT'
                }]
            });

        const response = await sdk.generatePath(
            { blockchainType: 'ethereum', blockchainId: '0x1111111111111111111111111111111111111111' },
            { blockchainType: 'eos', blockchainId: 'therealkarma', symbol: 'KARMA' }
        );

        const expectedResult = [
            [
                { blockchainType: 'ethereum', blockchainId: '0x1111111111111111111111111111111111111111' },
                { blockchainType: 'ethereum', blockchainId: '0x2222222222222222222222222222222222222222' },
                { blockchainType: 'ethereum', blockchainId: '0x3333333333333333333333333333333333333333' }
            ],
            [
                { blockchainType: 'eos', blockchainId: 'bntbntbntbnt', symbol: 'BNT' },
                { blockchainType: 'eos', blockchainId: 'bancorc11112', symbol: 'BNTKRM' },
                { blockchainType: 'eos', blockchainId: 'therealkarma', symbol: 'KARMA' }
            ]
        ];

        expect(response).toEqual(expectedResult);
        expect(spyGetGraph).toHaveBeenCalledTimes(1);
        expect(spyGetDecimals).toHaveBeenCalledTimes(2);
        expect(spyGetRates).toHaveBeenCalledTimes(1);
        expect(spyGetReservesFromCode).toHaveBeenCalledTimes(1);
        expect(spyGetContractAddresses).toHaveBeenCalledTimes(1);
    });

    it('generatePath from eos token to ethereum token', async () => {
        const spyGetContractAddresses = jest
            .spyOn(ethereum, 'getContractAddresses')
            .mockImplementation(() => ({anchorToken: '0x3333333333333333333333333333333333333333'}));

        const spyGetGraph = jest
            .spyOn(ethereum, 'getGraph')
            .mockImplementation(() => Promise.resolve({
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

        const spyGetReservesFromCode = jest
            .spyOn(eos, 'getReservesFromCode')
            .mockResolvedValueOnce({
                rows: [{
                    contract: 'bntbntbntbnt',
                    currency: '0.0000000000 BNT'
                }]
            });

        const response = await sdk.generatePath(
            { blockchainType: 'eos', blockchainId: 'therealkarma', symbol: 'KARMA' },
            { blockchainType: 'ethereum', blockchainId: '0x1111111111111111111111111111111111111111' }
        );

        const expectedResult = [
            [
                { blockchainType: 'eos', blockchainId: 'therealkarma', symbol: 'KARMA' },
                { blockchainType: 'eos', blockchainId: 'bancorc11112', symbol: 'BNTKRM' },
                { blockchainType: 'eos', blockchainId: 'bntbntbntbnt', symbol: 'BNT' }
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
        expect(spyGetReservesFromCode).toHaveBeenCalledTimes(1);
        expect(spyGetContractAddresses).toHaveBeenCalledTimes(1);
    });

    it('generatePath from eos token to eos token', async () => {
        const spyGetReservesFromCode = jest
            .spyOn(eos, 'getReservesFromCode')
            .mockResolvedValueOnce({
                rows: [{
                    contract: 'bntbntbntbnt',
                    currency: '0.0000000000 BNT'
                }]
            });

        const response = await sdk.generatePath(
            { blockchainType: 'eos', blockchainId: 'therealkarma', symbol: 'KARMA' },
            { blockchainType: 'eos', blockchainId: 'bntbntbntbnt', symbol: 'BNT' }
        );

        const expectedResult = [
            [
                { blockchainType: 'eos', blockchainId: 'therealkarma', symbol: 'KARMA' },
                { blockchainType: 'eos', blockchainId: 'bancorc11112', symbol: 'BNTKRM' },
                { blockchainType: 'eos', blockchainId: 'bntbntbntbnt', symbol: 'BNT' }
            ]
        ];

        expect(response).toEqual(expectedResult);
        expect(spyGetReservesFromCode).toHaveBeenCalledTimes(1);
    });
});
