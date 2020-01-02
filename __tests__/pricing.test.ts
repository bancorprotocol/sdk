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

        const shortestPathResult = ['therealkarma', 'bancorc11112', 'bntbntbntbnt'];
        const response = await sdk.getRateByPath({ paths: [{ type: 'eos' as genPath.BlockchainType, path: shortestPathResult }]}, '1');
        expect(response).toEqual(0.00018298446839888063);
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

        const shortestPathResult = ['bntbntbntbnt', 'bancorc11132', 'bancorr11132'];
        const response = await sdk.getRateByPath({ paths: [{ type: 'eos' as genPath.BlockchainType, path: shortestPathResult }]}, '1');
        expect(response).toEqual(1.149089903558017);
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

        const shortestPathResult = ['bancorr11132', 'bancorc11132', 'bntbntbntbnt'];
        const response = await sdk.getRateByPath({ paths: [{ type: 'eos' as genPath.BlockchainType, path: shortestPathResult }]}, '1');
        expect(response).toEqual(0.8702237365072208);
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

        const spyGetLastTokenDecimals = jest
            .spyOn(ethereumFunctions, 'getLastTokenDecimals')
            .mockImplementationOnce(() => Promise.resolve(18))
            .mockImplementationOnce(() => Promise.resolve(18));

        const spyGetConversionReturn = jest
            .spyOn(ethereumFunctions, 'getConversionReturn')
            // eslint-disable-next-line quote-props
            .mockImplementationOnce(() => Promise.resolve({ '0': '562688523539875175216', '1': '1127067366221286828' }))
            // eslint-disable-next-line quote-props
            .mockImplementationOnce(() => Promise.resolve({ '0': '209035338725170038366', '1': '418698620654302859' }));

        const spyGetAmountInTokenWei = jest
            .spyOn(ethereumFunctions, 'getAmountInTokenWei')
            .mockImplementationOnce(() => Promise.resolve(1000000000000000000))
            .mockImplementationOnce(() => Promise.resolve(563288093941643064061));

        const shortestPathResult = ['0xc0829421c1d260bd3cb3e0f06cfe2d52db2ce315', '0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533', '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c', '0x99eBD396Ce7AA095412a4Cd1A0C959D6Fd67B340', '0xd26114cd6ee289accf82350c8d8487fedb8a0c07'];
        const response = await sdk.getRateByPath({ paths: [{ type: 'ethereum' as genPath.BlockchainType, path: shortestPathResult }]}, '1');

        expect(response).toEqual('209.035338725170038366');
        expect(spyGetConverterBlockchainId).toHaveBeenCalledTimes(2);
        expect(spyGetLastTokenDecimals).toHaveBeenCalledTimes(2);
        expect(spyGetConversionReturn).toHaveBeenCalledTimes(2);
        expect(spyGetAmountInTokenWei).toHaveBeenCalledTimes(2);
    });
});
