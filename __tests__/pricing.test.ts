/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable camelcase */
import * as sdk from '../src/index';
import * as genPath from '../src/path_generation';
import * as ethereumFunctions from '../src/blockchains/ethereum';
import * as eosFunctions from '../src/blockchains/eos';

describe('price tests', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('EOS to EOS short convert', async () => {
        const reserveFromCodeResult = {
            rows: [
                {
                    contract: 'bntbntbntbnt',
                    currency: '0.0000000000 BNT',
                    ratio: 500000,
                    p_enabled: 1
                },
                {
                    contract: 'therealkarma',
                    currency: '0.0000 KARMA',
                    ratio: 500000,
                    p_enabled: 1
                }
            ],
            more: false,
            next_key: ''
        };
        const spyGetReservesFromCode = jest
            .spyOn(eosFunctions, 'getReservesFromCode')
            .mockImplementation(() => Promise.resolve(reserveFromCodeResult));

        const spyGetConverterFeeFromSettings = jest
            .spyOn(eosFunctions, 'getConverterFeeFromSettings')
            .mockImplementation(() => Promise.resolve(2500));

        const spyGetReserveBalances = jest
            .spyOn(eosFunctions, 'getReserveBalances')
            .mockImplementationOnce(() => Promise.resolve({
                rows: [{ balance: '32355343.8280 KARMA' }],
                more: false,
                next_key: ''
            }))
            .mockImplementationOnce(() => Promise.resolve({
                rows: [{ balance: '5950.2395821273 BNT' }],
                more: false,
                next_key: ''
            }));

        const shortestPathResult = [{ KARMA: 'therealkarma' }, { BNTKRM: 'bancorc11112' }, { BNT: 'bntbntbntbnt' }];
        const response = await sdk.getRateByPath({ paths: [{ type: 'eos' as genPath.BlockchainType, path: shortestPathResult }]}, '1');
        expect(response).toEqual('0.0001829844683988806288491891575274667939632319964962791587405424143483339543408806225565348501066514424');
        expect(spyGetReservesFromCode).toHaveBeenCalledTimes(1);
        expect(spyGetConverterFeeFromSettings).toHaveBeenCalledTimes(1);
        expect(spyGetReserveBalances).toHaveBeenCalledTimes(2);
    });

    it('EOS buy smart token', async () => {
        const reserveFromCodeResult = {
            rows: [
                {
                    contract: 'octtothemoon',
                    currency: '0.0000 OCT',
                    ratio: 500000,
                    p_enabled: 1
                },
                {
                    contract: 'bntbntbntbnt',
                    currency: '0.0000000000 BNT',
                    ratio: 500000,
                    p_enabled: 1
                }
            ],
            more: false,
            next_key: ''
        };

        const spyGetReservesFromCode = jest
            .spyOn(eosFunctions, 'getReservesFromCode')
            .mockImplementation(() => Promise.resolve(reserveFromCodeResult));

        const spyGetConverterFeeFromSettings = jest
            .spyOn(eosFunctions, 'getConverterFeeFromSettings')
            .mockImplementation(() => Promise.resolve(0));

        const spyGetReserveBalances = jest
            .spyOn(eosFunctions, 'getReserveBalances')
            .mockImplementationOnce(() => Promise.resolve({
                rows: [{ balance: '13477.6248720288 BNT' }],
                more: false,
                next_key: ''
            }))
            .mockImplementationOnce(() => Promise.resolve({
                rows: [{ balance: '0.0000000000 BNTOCT' }],
                more: false,
                next_key: ''
            }));

        const spyGetSmartTokenSupply = jest
            .spyOn(eosFunctions, 'getSmartTokenSupply')
            .mockImplementationOnce(() => Promise.resolve({
                rows: [
                    {
                        supply: '30974.5798630795 BNTOCT',
                        max_supply: '250000000.0000000000 BNTOCT',
                        issuer: 'bancorc11132'
                    }
                ],
                more: false,
                next_key: ''
            }));

        const shortestPathResult = [{ BNT: 'bntbntbntbnt' }, { BNTOCT: 'bancorc11132' }, { BNTOCT: 'bancorr11132' }];
        const response = await sdk.getRateByPath({ paths: [{ type: 'eos' as genPath.BlockchainType, path: shortestPathResult }]}, '1');
        expect(response).toEqual('1.149089903558139448418865873613390739346612635233348491398249012803478588145961828615748552277965966');
        expect(spyGetReservesFromCode).toHaveBeenCalledTimes(1);
        expect(spyGetConverterFeeFromSettings).toHaveBeenCalledTimes(1);
        expect(spyGetReserveBalances).toHaveBeenCalledTimes(2);
        expect(spyGetSmartTokenSupply).toHaveBeenCalledTimes(1);
    });

    it('EOS sell smart token', async () => {
        const reserveFromCodeResult = {
            rows: [
                {
                    contract: 'octtothemoon',
                    currency: '0.0000 OCT',
                    ratio: 500000,
                    p_enabled: 1
                },
                {
                    contract: 'bntbntbntbnt',
                    currency: '0.0000000000 BNT',
                    ratio: 500000,
                    p_enabled: 1
                }
            ],
            more: false,
            next_key: ''
        };

        const spyGetReservesFromCode = jest
            .spyOn(eosFunctions, 'getReservesFromCode')
            .mockImplementation(() => Promise.resolve(reserveFromCodeResult));

        const spyGetConverterFeeFromSettings = jest
            .spyOn(eosFunctions, 'getConverterFeeFromSettings')
            .mockImplementation(() => Promise.resolve(0));

        const spyGetReserveBalances = jest
            .spyOn(eosFunctions, 'getReserveBalances')
            .mockImplementationOnce(() => Promise.resolve({
                rows: [{ balance: '0.0000000000 BNTOCT' }],
                more: false,
                next_key: ''
            }))
            .mockImplementationOnce(() => Promise.resolve({
                rows: [{ balance: '13477.6248720288 BNT' }],
                more: false,
                next_key: ''
            }));

        const spyGetSmartTokenSupply = jest
            .spyOn(eosFunctions, 'getSmartTokenSupply')
            .mockImplementationOnce(() => Promise.resolve({
                rows: [
                    {
                        supply: '30974.5798630795 BNTOCT',
                        max_supply: '250000000.0000000000 BNTOCT',
                        issuer: 'bancorc11132'
                    }
                ],
                more: false,
                next_key: ''
            }));

        const shortestPathResult = [{ BNTOCT: 'bancorr11132' }, { BNTOCT: 'bancorc11132' }, { BNT: 'bntbntbntbnt' }];
        const response = await sdk.getRateByPath({ paths: [{ type: 'eos' as genPath.BlockchainType, path: shortestPathResult }]}, '1');
        expect(response).toEqual('0.8702237365064194480241051027460314579651378541409636737891154514561671227625262785751104664761440822');
        expect(spyGetReservesFromCode).toHaveBeenCalledTimes(1);
        expect(spyGetConverterFeeFromSettings).toHaveBeenCalledTimes(1);
        expect(spyGetReserveBalances).toHaveBeenCalledTimes(2);
        expect(spyGetSmartTokenSupply).toHaveBeenCalledTimes(1);
    });

    it('Eth to eth token', async () => {
        const spyGetConverterBlockchainId = jest
            .spyOn(ethereumFunctions, 'getConverterBlockchainId')
            .mockImplementationOnce(() => Promise.resolve('0xd3ec78814966Ca1Eb4c923aF4Da86BF7e6c743bA'))
            .mockImplementationOnce(() => Promise.resolve('0x89f26Fff3F690B19057e6bEb7a82C5c29ADfe20B'));

        const spyGetPathStepRate = jest
            .spyOn(ethereumFunctions, 'getPathStepRate')
            .mockImplementationOnce(() => Promise.resolve('562.688523539875175216'))
            .mockImplementationOnce(() => Promise.resolve('209.035338725170038366'));

        const shortestPathResult = [
            '0xc0829421c1d260bd3cb3e0f06cfe2d52db2ce315',
            '0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533',
            '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c',
            '0x99eBD396Ce7AA095412a4Cd1A0C959D6Fd67B340',
            '0xd26114cd6ee289accf82350c8d8487fedb8a0c07'];
        const response = await sdk.getRateByPath({ paths: [{ type: 'ethereum' as genPath.BlockchainType, path: shortestPathResult }]}, '1');

        expect(response).toEqual('209.035338725170038366');
        expect(spyGetConverterBlockchainId).toHaveBeenCalledTimes(2);
        expect(spyGetPathStepRate).toHaveBeenCalledTimes(2);
    });

    it('Eos token to Eth', async () => {
        const reserveFromCodeResult = {
            rows: [
                {
                    contract: 'bntbntbntbnt',
                    currency: '0.0000000000 BNT',
                    ratio: 500000,
                    p_enabled: 1
                },
                {
                    contract: 'therealkarma',
                    currency: '0.0000 KARMA',
                    ratio: 500000,
                    p_enabled: 1
                }
            ],
            more: false,
            next_key: ''
        };

        const spyGetReservesFromCode = jest
            .spyOn(eosFunctions, 'getReservesFromCode')
            .mockImplementation(() => Promise.resolve(reserveFromCodeResult));

        const spyGetConverterFeeFromSettings = jest
            .spyOn(eosFunctions, 'getConverterFeeFromSettings')
            .mockImplementation(() => Promise.resolve(2500));

        const spyGetReserveBalances = jest
            .spyOn(eosFunctions, 'getReserveBalances')
            .mockImplementationOnce(() => Promise.resolve({
                rows: [{ balance: '32355343.8280 KARMA' }],
                more: false,
                next_key: ''
            }))
            .mockImplementationOnce(() => Promise.resolve({
                rows: [{ balance: '5950.2395821273 BNT' }],
                more: false,
                next_key: ''
            }));

        const spyGetConverterBlockchainId = jest
            .spyOn(ethereumFunctions, 'getConverterBlockchainId')
            .mockImplementationOnce(() => Promise.resolve('0xd3ec78814966Ca1Eb4c923aF4Da86BF7e6c743bA'));

        const spyGetPathStepRate = jest
            .spyOn(ethereumFunctions, 'getPathStepRate')
            .mockImplementationOnce(() => Promise.resolve('0.000000274802734836'));

        const response = await sdk.getRateByPath({
            paths: [
                {
                    type: 'eos',
                    path: [{ KARMA: 'therealkarma' }, { BNTKRM: 'bancorc11112' }, { BNT: 'bntbntbntbnt' }]
                },
                {
                    type: 'ethereum',
                    path: ['0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c', '0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533', '0xc0829421c1d260bd3cb3e0f06cfe2d52db2ce315']
                }]
        }, '1');

        expect(response).toEqual('0.000000274802734836');
        expect(spyGetReservesFromCode).toHaveBeenCalledTimes(1);
        expect(spyGetConverterFeeFromSettings).toHaveBeenCalledTimes(1);
        expect(spyGetReserveBalances).toHaveBeenCalledTimes(2);
        expect(spyGetConverterBlockchainId).toHaveBeenCalledTimes(1);
        expect(spyGetPathStepRate).toHaveBeenCalledTimes(1);
    });

    it('Eth EOS token', async () => {
        const spyGetPathStepRate = jest
            .spyOn(ethereumFunctions, 'getPathStepRate')
            .mockImplementationOnce(() => Promise.resolve('662.806411110393058533'));

        const reserveFromCodeResult = {
            rows: [
                {
                    contract: 'bntbntbntbnt',
                    currency: '0.0000000000 BNT',
                    ratio: 500000,
                    p_enabled: 1
                },
                {
                    contract: 'therealkarma',
                    currency: '0.0000 KARMA',
                    ratio: 500000,
                    p_enabled: 1
                }
            ],
            more: false,
            next_key: ''
        };
        const spyGetConverterFeeFromSettings = jest
            .spyOn(eosFunctions, 'getConverterFeeFromSettings')
            .mockImplementation(() => Promise.resolve(2500));

        const spyGetReservesFromCode = jest
            .spyOn(eosFunctions, 'getReservesFromCode')
            .mockImplementation(() => Promise.resolve(reserveFromCodeResult));

        const spyGetReserveBalances = jest
            .spyOn(eosFunctions, 'getReserveBalances')
            .mockImplementationOnce(() => Promise.resolve({
                rows: [{ balance: '5950.2395821273 BNT' }],
                more: false,
                next_key: ''
            }))
            .mockImplementationOnce(() => Promise.resolve({
                rows: [{ balance: '32355343.8280 KARMA' }],
                more: false,
                next_key: ''
            }));

        const spyGetConverterBlockchainId = jest
            .spyOn(ethereumFunctions, 'getConverterBlockchainId')
            .mockImplementationOnce(() => Promise.resolve('0xd3ec78814966Ca1Eb4c923aF4Da86BF7e6c743bA'));

        const response = await sdk.getRateByPath({
            paths: [{
                type: 'ethereum',
                path: ['0xc0829421c1d260bd3cb3e0f06cfe2d52db2ce315', '0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533',
                    '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c']
            },
            {
                type: 'eos',
                path: [{ BNT: 'bntbntbntbnt' }, { BNTKRM: 'bancorc11112' }, { KARMA: 'therealkarma' }]
            }]
        }, '1');

        expect(response).toEqual('3226688.084642570529407094055738289769947463047257618333877712134072470684667713285913835113451935283');
        expect(spyGetReservesFromCode).toHaveBeenCalledTimes(1);
        expect(spyGetConverterFeeFromSettings).toHaveBeenCalledTimes(1);
        expect(spyGetReserveBalances).toHaveBeenCalledTimes(2);
        expect(spyGetConverterBlockchainId).toHaveBeenCalledTimes(1);
        expect(spyGetPathStepRate).toHaveBeenCalledTimes(1);
    });
});
