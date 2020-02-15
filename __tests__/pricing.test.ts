import * as sdk from '../src/index';
import * as eos from '../src/blockchains/eos';
import * as ethereum from '../src/blockchains/ethereum';
import * as path_generation from '../src/path_generation';

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
            .spyOn(eos, 'getReservesFromCode')
            .mockImplementation(() => Promise.resolve(reserveFromCodeResult));

        const spyGetConverterFeeFromSettings = jest
            .spyOn(eos, 'getConverterFeeFromSettings')
            .mockImplementation(() => Promise.resolve(2500));

        const spyGetReserveBalances = jest
            .spyOn(eos, 'getReserveBalances')
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

        const response = await sdk.getRateByPath([
            [
                { blockchainType: 'eos' as path_generation.BlockchainType, blockchainId: 'therealkarma', symbol: 'KARMA' },
                { blockchainType: 'eos' as path_generation.BlockchainType, blockchainId: 'bancorc11112', symbol: 'BNTKRM' },
                { blockchainType: 'eos' as path_generation.BlockchainType, blockchainId: 'bntbntbntbnt', symbol: 'BNT' }
            ]
        ], '1');

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
            .spyOn(eos, 'getReservesFromCode')
            .mockImplementation(() => Promise.resolve(reserveFromCodeResult));

        const spyGetConverterFeeFromSettings = jest
            .spyOn(eos, 'getConverterFeeFromSettings')
            .mockImplementation(() => Promise.resolve(0));

        const spyGetReserveBalances = jest
            .spyOn(eos, 'getReserveBalances')
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
            .spyOn(eos, 'getSmartTokenSupply')
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

        const response = await sdk.getRateByPath([
            [
                { blockchainType: 'eos' as path_generation.BlockchainType, blockchainId: 'bntbntbntbnt', symbol: 'BNT' },
                { blockchainType: 'eos' as path_generation.BlockchainType, blockchainId: 'bancorc11132', symbol: 'BNTOCT' },
                { blockchainType: 'eos' as path_generation.BlockchainType, blockchainId: 'bancorr11132', symbol: 'BNTOCT' }
            ]
        ], '1');

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
            .spyOn(eos, 'getReservesFromCode')
            .mockImplementation(() => Promise.resolve(reserveFromCodeResult));

        const spyGetConverterFeeFromSettings = jest
            .spyOn(eos, 'getConverterFeeFromSettings')
            .mockImplementation(() => Promise.resolve(0));

        const spyGetReserveBalances = jest
            .spyOn(eos, 'getReserveBalances')
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
            .spyOn(eos, 'getSmartTokenSupply')
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

        const response = await sdk.getRateByPath([
            [
                { blockchainType: 'eos' as path_generation.BlockchainType, blockchainId: 'bancorr11132', symbol: 'BNTOCT' },
                { blockchainType: 'eos' as path_generation.BlockchainType, blockchainId: 'bancorc11132', symbol: 'BNTOCT' },
                { blockchainType: 'eos' as path_generation.BlockchainType, blockchainId: 'bntbntbntbnt', symbol: 'BNT' }
            ]
        ], '1');

        expect(response).toEqual('0.8702237365064194480241051027460314579651378541409636737891154514561671227625262785751104664761440822');
        expect(spyGetReservesFromCode).toHaveBeenCalledTimes(1);
        expect(spyGetConverterFeeFromSettings).toHaveBeenCalledTimes(1);
        expect(spyGetReserveBalances).toHaveBeenCalledTimes(2);
        expect(spyGetSmartTokenSupply).toHaveBeenCalledTimes(1);
    });

    it('Eth to eth token', async () => {
        const spyToWei = jest
            .spyOn(ethereum, 'toWei')
            .mockImplementationOnce(() => Promise.resolve('562688523539875175216'))
            .mockImplementationOnce(() => Promise.resolve('209035338725170038366'));

        const spyFromWei = jest
            .spyOn(ethereum, 'fromWei')
            .mockImplementationOnce(() => Promise.resolve('562.688523539875175216'))
            .mockImplementationOnce(() => Promise.resolve('209.035338725170038366'));

        const spyGetReturn = jest
            .spyOn(ethereum, 'getReturn')
            .mockImplementationOnce(() => Promise.resolve({'0': '562688523539875175216'}))
            .mockImplementationOnce(() => Promise.resolve({'0': '209035338725170038366'}));

        const response = await sdk.getRateByPath([
            [
                { blockchainType: 'ethereum' as path_generation.BlockchainType, blockchainId: '0xc0829421C1d260BD3cB3E0F06cfE2D52db2cE315'},
                { blockchainType: 'ethereum' as path_generation.BlockchainType, blockchainId: '0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533'},
                { blockchainType: 'ethereum' as path_generation.BlockchainType, blockchainId: '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C'},
                { blockchainType: 'ethereum' as path_generation.BlockchainType, blockchainId: '0x99eBD396Ce7AA095412a4Cd1A0C959D6Fd67B340'},
                { blockchainType: 'ethereum' as path_generation.BlockchainType, blockchainId: '0xd26114cd6EE289AccF82350c8d8487fedB8A0C07'}
            ]
        ], '1');

        expect(response).toEqual('209.035338725170038366');
        expect(spyToWei).toHaveBeenCalledTimes(2);
        expect(spyFromWei).toHaveBeenCalledTimes(2);
        expect(spyGetReturn).toHaveBeenCalledTimes(2);
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
            .spyOn(eos, 'getReservesFromCode')
            .mockImplementation(() => Promise.resolve(reserveFromCodeResult));

        const spyGetConverterFeeFromSettings = jest
            .spyOn(eos, 'getConverterFeeFromSettings')
            .mockImplementation(() => Promise.resolve(2500));

        const spyGetReserveBalances = jest
            .spyOn(eos, 'getReserveBalances')
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

        const spyToWei = jest
            .spyOn(ethereum, 'toWei')
            .mockImplementationOnce(() => Promise.resolve('274802734836'));

        const spyFromWei = jest
            .spyOn(ethereum, 'fromWei')
            .mockImplementationOnce(() => Promise.resolve('0.000000274802734836'));

        const spyGetReturn = jest
            .spyOn(ethereum, 'getReturn')
            .mockImplementationOnce(() => Promise.resolve({'0': '274802734836'}));

        const response = await sdk.getRateByPath([
            [
                { blockchainType: 'eos' as path_generation.BlockchainType, blockchainId: 'therealkarma', symbol: 'KARMA' },
                { blockchainType: 'eos' as path_generation.BlockchainType, blockchainId: 'bancorc11112', symbol: 'BNTKRM' },
                { blockchainType: 'eos' as path_generation.BlockchainType, blockchainId: 'bntbntbntbnt', symbol: 'BNT' }
            ],
            [
                { blockchainType: 'ethereum' as path_generation.BlockchainType, blockchainId: '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C'},
                { blockchainType: 'ethereum' as path_generation.BlockchainType, blockchainId: '0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533'},
                { blockchainType: 'ethereum' as path_generation.BlockchainType, blockchainId: '0xc0829421C1d260BD3cB3E0F06cfE2D52db2cE315'}
            ]
        ], '1');

        expect(response).toEqual('0.000000274802734836');
        expect(spyGetReservesFromCode).toHaveBeenCalledTimes(1);
        expect(spyGetConverterFeeFromSettings).toHaveBeenCalledTimes(1);
        expect(spyGetReserveBalances).toHaveBeenCalledTimes(2);
        expect(spyToWei).toHaveBeenCalledTimes(1);
        expect(spyFromWei).toHaveBeenCalledTimes(1);
        expect(spyGetReturn).toHaveBeenCalledTimes(1);
    });

    it('Eth EOS token', async () => {
        const spyToWei = jest
            .spyOn(ethereum, 'toWei')
            .mockImplementationOnce(() => Promise.resolve('662806411110393058533'));

        const spyFromWei = jest
            .spyOn(ethereum, 'fromWei')
            .mockImplementationOnce(() => Promise.resolve('662.806411110393058533'));

        const spyGetReturn = jest
            .spyOn(ethereum, 'getReturn')
            .mockImplementationOnce(() => Promise.resolve({'0': '662806411110393058533'}));

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
            .spyOn(eos, 'getConverterFeeFromSettings')
            .mockImplementation(() => Promise.resolve(2500));

        const spyGetReservesFromCode = jest
            .spyOn(eos, 'getReservesFromCode')
            .mockImplementation(() => Promise.resolve(reserveFromCodeResult));

        const spyGetReserveBalances = jest
            .spyOn(eos, 'getReserveBalances')
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

        const response = await sdk.getRateByPath([
            [
                { blockchainType: 'ethereum' as path_generation.BlockchainType, blockchainId: '0xc0829421C1d260BD3cB3E0F06cfE2D52db2cE315'},
                { blockchainType: 'ethereum' as path_generation.BlockchainType, blockchainId: '0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533'},
                { blockchainType: 'ethereum' as path_generation.BlockchainType, blockchainId: '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C'}
            ],
            [
                { blockchainType: 'eos' as path_generation.BlockchainType, blockchainId: 'bntbntbntbnt', symbol: 'BNT' },
                { blockchainType: 'eos' as path_generation.BlockchainType, blockchainId: 'bancorc11112', symbol: 'BNTKRM' },
                { blockchainType: 'eos' as path_generation.BlockchainType, blockchainId: 'therealkarma', symbol: 'KARMA' }
            ]
        ], '1');

        expect(response).toEqual('3226688.084642570529407094055738289769947463047257618333877712134072470684667713285913835113451935283');
        expect(spyGetReservesFromCode).toHaveBeenCalledTimes(1);
        expect(spyGetConverterFeeFromSettings).toHaveBeenCalledTimes(1);
        expect(spyGetReserveBalances).toHaveBeenCalledTimes(2);
        expect(spyToWei).toHaveBeenCalledTimes(1);
        expect(spyFromWei).toHaveBeenCalledTimes(1);
        expect(spyGetReturn).toHaveBeenCalledTimes(1);
    });
});
