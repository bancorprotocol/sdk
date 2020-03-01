import { SDK } from '../src/index';
import * as eos from '../src/blockchains/eos';
import * as ethereum from '../src/blockchains/ethereum';

describe('price tests', () => {
    const sdk = new SDK();

    beforeEach(() => {
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('getRateByPath from eos token to eos token (convert)', async () => {
        const paths = {
            convertibleTokens: {
                aaaaaaaaaaaa: { AAA: { AAABBB: 'aaabbbaaabbb', AAACCC: 'aaacccaaaccc' } },
                cccccccccccc: { CCC: { AAACCC: 'aaacccaaaccc' } }
            },
            smartTokens: {
                yyyyyyyyyyyy: { AAACCC: { AAACCC: 'aaacccaaaccc' } }
            }
        };

        const reserveFromCodeResult = {
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
        };

        const spyGetRegistry = jest
            .spyOn(eos, 'getRegistry')
            .mockImplementation(() => paths);

        const spyGetReservesFromCode = jest
            .spyOn(eos, 'getReservesFromCode')
            .mockImplementation(() => Promise.resolve(reserveFromCodeResult));

        const spyGetConverterSettings = jest
            .spyOn(eos, 'getConverterSettings')
            .mockImplementation(() => Promise.resolve({ rows: [{ fee: 2500 }] }));

        const spyGetReserveBalances = jest
            .spyOn(eos, 'getReserveBalances')
            .mockImplementationOnce(() => Promise.resolve({
                rows: [{ balance: '32355343.8280 CCC' }],
                more: false,
                next_key: ''
            }))
            .mockImplementationOnce(() => Promise.resolve({
                rows: [{ balance: '5950.2395821273 AAA' }],
                more: false,
                next_key: ''
            }));

        const response = await sdk.getRateByPath([
            [
                { blockchainType: 'eos', blockchainId: 'cccccccccccc', symbol: 'CCC' },
                { blockchainType: 'eos', blockchainId: 'aaacccaaaccc', symbol: 'AAACCC' },
                { blockchainType: 'eos', blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }
            ]
        ], '1');

        expect(response).toEqual('0.0001829844683988806288491891575274667939632319964962791587405424143483339543408806225565348501066514424');
        expect(spyGetRegistry).toHaveBeenCalledTimes(2);
        expect(spyGetReservesFromCode).toHaveBeenCalledTimes(1);
        expect(spyGetConverterSettings).toHaveBeenCalledTimes(1);
        expect(spyGetReserveBalances).toHaveBeenCalledTimes(2);
    });

    it('getRateByPath from eos token to eos token (buy)', async () => {
        const paths = {
            convertibleTokens: {
                aaaaaaaaaaaa: { AAA: { AAABBB: 'aaabbbaaabbb', AAACCC: 'aaacccaaaccc' } },
                bbbbbbbbbbbb: { BBB: { AAABBB: 'aaabbbaaabbb' } }
            },
            smartTokens: {
                xxxxxxxxxxxx: { AAABBB: { AAABBB: 'aaabbbaaabbb' } }
            }
        };

        const reserveFromCodeResult = {
            rows: [
                {
                    contract: 'bbbbbbbbbbbb',
                    currency: '0.0 BBB',
                    ratio: 500000,
                    p_enabled: 1
                },
                {
                    contract: 'aaaaaaaaaaaa',
                    currency: '0.0 AAA',
                    ratio: 500000,
                    p_enabled: 1
                }
            ],
            more: false,
            next_key: ''
        };

        const spyGetRegistry = jest
            .spyOn(eos, 'getRegistry')
            .mockImplementation(() => paths);

        const spyGetReservesFromCode = jest
            .spyOn(eos, 'getReservesFromCode')
            .mockImplementation(() => Promise.resolve(reserveFromCodeResult));

        const spyGetConverterSettings = jest
            .spyOn(eos, 'getConverterSettings')
            .mockImplementation(() => Promise.resolve({ rows: [{ fee: 0 }] }));

        const spyGetReserveBalances = jest
            .spyOn(eos, 'getReserveBalances')
            .mockImplementationOnce(() => Promise.resolve({
                rows: [{ balance: '13477.6248720288 AAA' }],
                more: false,
                next_key: ''
            }))
            .mockImplementationOnce(() => Promise.resolve({
                rows: [{ balance: '0.0 AAABBB' }],
                more: false,
                next_key: ''
            }));

        const spyGetSmartTokenSupply = jest
            .spyOn(eos, 'getSmartTokenSupply')
            .mockImplementationOnce(() => Promise.resolve({
                rows: [
                    {
                        supply: '30974.5798630795 AAABBB',
                        max_supply: '250000000.0 AAABBB',
                        issuer: 'aaabbbaaabbb'
                    }
                ],
                more: false,
                next_key: ''
            }));

        const response = await sdk.getRateByPath([
            [
                { blockchainType: 'eos', blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' },
                { blockchainType: 'eos', blockchainId: 'aaabbbaaabbb', symbol: 'AAABBB' },
                { blockchainType: 'eos', blockchainId: 'xxxxxxxxxxxx', symbol: 'AAABBB' }
            ]
        ], '1');

        expect(response).toEqual('1.149089903558139448418865873613390739346612635233348491398249012803478588145961828615748552277965966');
        expect(spyGetRegistry).toHaveBeenCalledTimes(4);
        expect(spyGetReservesFromCode).toHaveBeenCalledTimes(1);
        expect(spyGetConverterSettings).toHaveBeenCalledTimes(1);
        expect(spyGetReserveBalances).toHaveBeenCalledTimes(2);
        expect(spyGetSmartTokenSupply).toHaveBeenCalledTimes(1);
    });

    it('getRateByPath from eos token to eos token (sell)', async () => {
        const paths = {
            convertibleTokens: {
                aaaaaaaaaaaa: { AAA: { AAABBB: 'aaabbbaaabbb', AAACCC: 'aaacccaaaccc' } },
                bbbbbbbbbbbb: { BBB: { AAABBB: 'aaabbbaaabbb' } }
            },
            smartTokens: {
                xxxxxxxxxxxx: { AAABBB: { AAABBB: 'aaabbbaaabbb' } }
            }
        };

        const reserveFromCodeResult = {
            rows: [
                {
                    contract: 'bbbbbbbbbbbb',
                    currency: '0.0 BBB',
                    ratio: 500000,
                    p_enabled: 1
                },
                {
                    contract: 'aaaaaaaaaaaa',
                    currency: '0.0 AAA',
                    ratio: 500000,
                    p_enabled: 1
                }
            ],
            more: false,
            next_key: ''
        };

        const spyGetRegistry = jest
            .spyOn(eos, 'getRegistry')
            .mockImplementation(() => paths);

        const spyGetReservesFromCode = jest
            .spyOn(eos, 'getReservesFromCode')
            .mockImplementation(() => Promise.resolve(reserveFromCodeResult));

        const spyGetConverterSettings = jest
            .spyOn(eos, 'getConverterSettings')
            .mockImplementation(() => Promise.resolve({ rows: [{ fee: 0 }] }));

        const spyGetReserveBalances = jest
            .spyOn(eos, 'getReserveBalances')
            .mockImplementationOnce(() => Promise.resolve({
                rows: [{ balance: '0.0 AAABBB' }],
                more: false,
                next_key: ''
            }))
            .mockImplementationOnce(() => Promise.resolve({
                rows: [{ balance: '13477.6248720288 AAA' }],
                more: false,
                next_key: ''
            }));

        const spyGetSmartTokenSupply = jest
            .spyOn(eos, 'getSmartTokenSupply')
            .mockImplementationOnce(() => Promise.resolve({
                rows: [
                    {
                        supply: '30974.5798630795 AAABBB',
                        max_supply: '250000000.0 AAABBB',
                        issuer: 'aaabbbaaabbb'
                    }
                ],
                more: false,
                next_key: ''
            }));

        const response = await sdk.getRateByPath([
            [
                { blockchainType: 'eos', blockchainId: 'xxxxxxxxxxxx', symbol: 'AAABBB' },
                { blockchainType: 'eos', blockchainId: 'aaabbbaaabbb', symbol: 'AAABBB' },
                { blockchainType: 'eos', blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }
            ]
        ], '1');

        expect(response).toEqual('0.8702237365064194480241051027460314579651378541409636737891154514561671227625262785751104664761440822');
        expect(spyGetRegistry).toHaveBeenCalledTimes(4);
        expect(spyGetReservesFromCode).toHaveBeenCalledTimes(1);
        expect(spyGetConverterSettings).toHaveBeenCalledTimes(1);
        expect(spyGetReserveBalances).toHaveBeenCalledTimes(2);
        expect(spyGetSmartTokenSupply).toHaveBeenCalledTimes(1);
    });

    it('getRateByPath from ethereum token to ethereum token', async () => {
        const spyGetDecimals = jest
            .spyOn(ethereum, 'getDecimals')
            .mockImplementationOnce(() => Promise.resolve('18'))
            .mockImplementationOnce(() => Promise.resolve('18'));

        const spyGetReturn = jest
            .spyOn(ethereum, 'getReturn')
            .mockImplementationOnce(() => Promise.resolve('209035338725170038366'));

        const response = await sdk.getRateByPath([
            [
                { blockchainType: 'ethereum', blockchainId: '0x1111111111111111111111111111111111111111'},
                { blockchainType: 'ethereum', blockchainId: '0x2222222222222222222222222222222222222222'},
                { blockchainType: 'ethereum', blockchainId: '0x3333333333333333333333333333333333333333'},
                { blockchainType: 'ethereum', blockchainId: '0x4444444444444444444444444444444444444444'},
                { blockchainType: 'ethereum', blockchainId: '0x5555555555555555555555555555555555555555'}
            ]
        ], '1');

        expect(response).toEqual('209.035338725170038366');
        expect(spyGetDecimals).toHaveBeenCalledTimes(2);
        expect(spyGetReturn).toHaveBeenCalledTimes(1);
    });

    it('getRateByPath from eos token to ethereum token', async () => {
        const paths = {
            convertibleTokens: {
                aaaaaaaaaaaa: { AAA: { AAABBB: 'aaabbbaaabbb', AAACCC: 'aaacccaaaccc' } },
                bbbbbbbbbbbb: { BBB: { AAABBB: 'aaabbbaaabbb' } },
                cccccccccccc: { CCC: { AAACCC: 'aaacccaaaccc' } }
            },
            smartTokens: {
                xxxxxxxxxxxx: { AAABBB: { AAABBB: 'aaabbbaaabbb' } },
                yyyyyyyyyyyy: { AAACCC: { AAACCC: 'aaacccaaaccc' } }
            }
        };

        const reserveFromCodeResult = {
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
        };

        const spyGetRegistry = jest
            .spyOn(eos, 'getRegistry')
            .mockImplementation(() => paths);

        const spyGetReservesFromCode = jest
            .spyOn(eos, 'getReservesFromCode')
            .mockImplementation(() => Promise.resolve(reserveFromCodeResult));

        const spyGetConverterSettings = jest
            .spyOn(eos, 'getConverterSettings')
            .mockImplementation(() => Promise.resolve({ rows: [{ fee: 2500 }] }));

        const spyGetReserveBalances = jest
            .spyOn(eos, 'getReserveBalances')
            .mockImplementationOnce(() => Promise.resolve({
                rows: [{ balance: '32355343.8280 CCC' }],
                more: false,
                next_key: ''
            }))
            .mockImplementationOnce(() => Promise.resolve({
                rows: [{ balance: '5950.2395821273 AAA' }],
                more: false,
                next_key: ''
            }));

        const spyGetDecimals = jest
            .spyOn(ethereum, 'getDecimals')
            .mockImplementationOnce(() => Promise.resolve('18'))
            .mockImplementationOnce(() => Promise.resolve('18'));

        const spyGetReturn = jest
            .spyOn(ethereum, 'getReturn')
            .mockImplementationOnce(() => Promise.resolve('274802734836'));

        const response = await sdk.getRateByPath([
            [
                { blockchainType: 'eos', blockchainId: 'cccccccccccc', symbol: 'CCC' },
                { blockchainType: 'eos', blockchainId: 'aaacccaaaccc', symbol: 'AAACCC' },
                { blockchainType: 'eos', blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }
            ],
            [
                { blockchainType: 'ethereum', blockchainId: '0x3333333333333333333333333333333333333333'},
                { blockchainType: 'ethereum', blockchainId: '0x2222222222222222222222222222222222222222'},
                { blockchainType: 'ethereum', blockchainId: '0x1111111111111111111111111111111111111111'}
            ]
        ], '1');

        expect(response).toEqual('0.000000274802734836');
        expect(spyGetRegistry).toHaveBeenCalledTimes(2);
        expect(spyGetReservesFromCode).toHaveBeenCalledTimes(1);
        expect(spyGetConverterSettings).toHaveBeenCalledTimes(1);
        expect(spyGetReserveBalances).toHaveBeenCalledTimes(2);
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

        const paths = {
            convertibleTokens: {
                aaaaaaaaaaaa: { AAA: { AAABBB: 'aaabbbaaabbb', AAACCC: 'aaacccaaaccc' } },
                bbbbbbbbbbbb: { BBB: { AAABBB: 'aaabbbaaabbb' } },
                cccccccccccc: { CCC: { AAACCC: 'aaacccaaaccc' } }
            },
            smartTokens: {
                xxxxxxxxxxxx: { AAABBB: { AAABBB: 'aaabbbaaabbb' } },
                yyyyyyyyyyyy: { AAACCC: { AAACCC: 'aaacccaaaccc' } }
            }
        };

        const reserveFromCodeResult = {
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
        };

        const spyGetConverterSettings = jest
            .spyOn(eos, 'getConverterSettings')
            .mockImplementation(() => Promise.resolve({ rows: [{ fee: 2500 }] }));

        const spyGetRegistry = jest
            .spyOn(eos, 'getRegistry')
            .mockImplementation(() => paths);

        const spyGetReservesFromCode = jest
            .spyOn(eos, 'getReservesFromCode')
            .mockImplementation(() => Promise.resolve(reserveFromCodeResult));

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

        const response = await sdk.getRateByPath([
            [
                { blockchainType: 'ethereum', blockchainId: '0x1111111111111111111111111111111111111111'},
                { blockchainType: 'ethereum', blockchainId: '0x2222222222222222222222222222222222222222'},
                { blockchainType: 'ethereum', blockchainId: '0x3333333333333333333333333333333333333333'}
            ],
            [
                { blockchainType: 'eos', blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' },
                { blockchainType: 'eos', blockchainId: 'aaacccaaaccc', symbol: 'AAACCC' },
                { blockchainType: 'eos', blockchainId: 'cccccccccccc', symbol: 'CCC' }
            ]
        ], '1');

        expect(response).toEqual('3226688.084642570529407094055738289769947463047257618333877712134072470684667713285913835113451935283');
        expect(spyGetRegistry).toHaveBeenCalledTimes(2);
        expect(spyGetReservesFromCode).toHaveBeenCalledTimes(1);
        expect(spyGetConverterSettings).toHaveBeenCalledTimes(1);
        expect(spyGetReserveBalances).toHaveBeenCalledTimes(2);
        expect(spyGetDecimals).toHaveBeenCalledTimes(2);
        expect(spyGetReturn).toHaveBeenCalledTimes(1);
    });
});
