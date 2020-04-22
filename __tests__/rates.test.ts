import { SDK } from '../src/index';
import * as eos from '../src/blockchains/eos/index';
import * as ethereum from '../src/blockchains/ethereum/index';
import * as ethereumMocks from '../src/blockchains/ethereum/mocks';

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

    it('getCheapestPathRate from eos token to eos token (convert)', async () => {
        const spyGetSmartTokens = jest
            .spyOn(eos, 'getSmartTokens')
            .mockImplementationOnce(() => ({ }))
            .mockImplementationOnce(() => ({ }))
            .mockImplementationOnce(() => ({ }))
            .mockImplementationOnce(() => ({ }));

        const spyGetReservesFromCode = jest
            .spyOn(eos, 'getReservesFromCode')
            .mockImplementationOnce(() => Promise.resolve({
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
            }));

        const spyGetConverterSettings = jest
            .spyOn(eos, 'getConverterSettings')
            .mockImplementationOnce(() => Promise.resolve({ rows: [{ fee: 2500 }] }));

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

        const spyGetCheapestPath = jest
            .spyOn(sdk, 'getCheapestPath')
            .mockImplementationOnce(() => Promise.resolve([
                { blockchainType: 'eos', blockchainId: 'cccccccccccc', symbol: 'CCC' },
                { blockchainType: 'eos', blockchainId: 'aaacccaaaccc', symbol: 'AAACCC' },
                { blockchainType: 'eos', blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }
            ]));

        await sdk.refresh();

        const received = await sdk.getCheapestPathRate(
            { blockchainType: 'eos', blockchainId: 'cccccccccccc', symbol: 'CCC' },
            { blockchainType: 'eos', blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }
        );

        expect(received).toEqual('0.0001829844683988806288491891575274667939632319964962791587405424143483339543408806225565348501066514424');
        expect(spyGetSmartTokens).toHaveBeenCalledTimes(4);
        expect(spyGetReservesFromCode).toHaveBeenCalledTimes(1);
        expect(spyGetConverterSettings).toHaveBeenCalledTimes(1);
        expect(spyGetReserveBalances).toHaveBeenCalledTimes(2);
        expect(spyGetCheapestPath).toHaveBeenCalledTimes(1);
    });

    it('getCheapestPathRate from eos token to eos token (buy)', async () => {
        const spyGetSmartTokens = jest
            .spyOn(eos, 'getSmartTokens')
            .mockImplementationOnce(() => ({  }))
            .mockImplementationOnce(() => ({  }))
            .mockImplementationOnce(() => ({ AAABBB: { AAABBB: 'aaabbbaaabbb' } }))
            .mockImplementationOnce(() => ({ AAABBB: { AAABBB: 'aaabbbaaabbb' } }))
            .mockImplementationOnce(() => ({ AAABBB: { AAABBB: 'aaabbbaaabbb' } }));

        const spyGetReservesFromCode = jest
            .spyOn(eos, 'getReservesFromCode')
            .mockImplementationOnce(() => Promise.resolve({
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
            }));

        const spyGetConverterSettings = jest
            .spyOn(eos, 'getConverterSettings')
            .mockImplementationOnce(() => Promise.resolve({ rows: [{ fee: 0 }] }));

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

        const spyGetCheapestPath = jest
            .spyOn(sdk, 'getCheapestPath')
            .mockImplementationOnce(() => Promise.resolve([
                { blockchainType: 'eos', blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' },
                { blockchainType: 'eos', blockchainId: 'aaabbbaaabbb', symbol: 'AAABBB' },
                { blockchainType: 'eos', blockchainId: 'xxxxxxxxxxxx', symbol: 'AAABBB' }
            ]));

        await sdk.refresh();

        const received = await sdk.getCheapestPathRate(
            { blockchainType: 'eos', blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' },
            { blockchainType: 'eos', blockchainId: 'xxxxxxxxxxxx', symbol: 'AAABBB' }
        );

        expect(received).toEqual('1.149089903558139448418865873613390739346612635233348491398249012803478588145961828615748552277965966');
        expect(spyGetSmartTokens).toHaveBeenCalledTimes(5);
        expect(spyGetReservesFromCode).toHaveBeenCalledTimes(1);
        expect(spyGetConverterSettings).toHaveBeenCalledTimes(1);
        expect(spyGetReserveBalances).toHaveBeenCalledTimes(2);
        expect(spyGetSmartTokenSupply).toHaveBeenCalledTimes(1);
        expect(spyGetCheapestPath).toHaveBeenCalledTimes(1);
    });

    it('getCheapestPathRate from eos token to eos token (sell)', async () => {
        const spyGetSmartTokens = jest
            .spyOn(eos, 'getSmartTokens')
            .mockImplementationOnce(() => ({ AAABBB: { AAABBB: 'aaabbbaaabbb' } }))
            .mockImplementationOnce(() => ({ AAABBB: { AAABBB: 'aaabbbaaabbb' } }))
            .mockImplementationOnce(() => ({  }))
            .mockImplementationOnce(() => ({  }))
            .mockImplementationOnce(() => ({ AAABBB: { AAABBB: 'aaabbbaaabbb' } }));

        const spyGetReservesFromCode = jest
            .spyOn(eos, 'getReservesFromCode')
            .mockImplementationOnce(() => Promise.resolve({
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
            }));

        const spyGetConverterSettings = jest
            .spyOn(eos, 'getConverterSettings')
            .mockImplementationOnce(() => Promise.resolve({ rows: [{ fee: 0 }] }));

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

        const spyGetCheapestPath = jest
            .spyOn(sdk, 'getCheapestPath')
            .mockImplementationOnce(() => Promise.resolve([
                { blockchainType: 'eos', blockchainId: 'xxxxxxxxxxxx', symbol: 'AAABBB' },
                { blockchainType: 'eos', blockchainId: 'aaabbbaaabbb', symbol: 'AAABBB' },
                { blockchainType: 'eos', blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }
            ]));

        await sdk.refresh();

        const received = await sdk.getCheapestPathRate(
            { blockchainType: 'eos', blockchainId: 'xxxxxxxxxxxx', symbol: 'AAABBB' },
            { blockchainType: 'eos', blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }
        );

        expect(received).toEqual('0.8702237365064194480241051027460314579651378541409636737891154514561671227625262785751104664761440822');
        expect(spyGetSmartTokens).toHaveBeenCalledTimes(5);
        expect(spyGetReservesFromCode).toHaveBeenCalledTimes(1);
        expect(spyGetConverterSettings).toHaveBeenCalledTimes(1);
        expect(spyGetReserveBalances).toHaveBeenCalledTimes(2);
        expect(spyGetSmartTokenSupply).toHaveBeenCalledTimes(1);
        expect(spyGetCheapestPath).toHaveBeenCalledTimes(1);
    });

    it('getCheapestPathRate from eos token to ethereum token', async () => {
        const spyGetSmartTokens = jest
            .spyOn(eos, 'getSmartTokens')
            .mockImplementationOnce(() => ({ }))
            .mockImplementationOnce(() => ({ }))
            .mockImplementationOnce(() => ({ }))
            .mockImplementationOnce(() => ({ }));

        const spyGetReservesFromCode = jest
            .spyOn(eos, 'getReservesFromCode')
            .mockImplementationOnce(() => Promise.resolve({
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
            }));

        const spyGetConverterSettings = jest
            .spyOn(eos, 'getConverterSettings')
            .mockImplementationOnce(() => Promise.resolve({ rows: [{ fee: 2500 }] }));

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

        const spyGetCheapestPath = jest
            .spyOn(sdk, 'getCheapestPath')
            .mockImplementationOnce(() => Promise.resolve([
                { blockchainType: 'eos', blockchainId: 'cccccccccccc', symbol: 'CCC' },
                { blockchainType: 'eos', blockchainId: 'aaacccaaaccc', symbol: 'AAACCC' },
                { blockchainType: 'eos', blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' },
                { blockchainType: 'ethereum', blockchainId: '0x3333333333333333333333333333333333333333' },
                { blockchainType: 'ethereum', blockchainId: '0x2222222222222222222222222222222222222222' },
                { blockchainType: 'ethereum', blockchainId: '0x1111111111111111111111111111111111111111' }
            ]));

        await sdk.refresh();

        const received = await sdk.getCheapestPathRate(
            { blockchainType: 'eos', blockchainId: 'cccccccccccc', symbol: 'CCC' },
            { blockchainType: 'ethereum', blockchainId: '0x1111111111111111111111111111111111111111' }
        );

        expect(received).toEqual('0.000000274802734836');
        expect(spyGetSmartTokens).toHaveBeenCalledTimes(4);
        expect(spyGetReservesFromCode).toHaveBeenCalledTimes(1);
        expect(spyGetConverterSettings).toHaveBeenCalledTimes(1);
        expect(spyGetReserveBalances).toHaveBeenCalledTimes(2);
        expect(spyGetDecimals).toHaveBeenCalledTimes(2);
        expect(spyGetReturn).toHaveBeenCalledTimes(1);
        expect(spyGetCheapestPath).toHaveBeenCalledTimes(1);
    });

    it('getCheapestPathRate from ethereum token to eos token', async () => {
        const spyGetDecimals = jest
            .spyOn(ethereum, 'getDecimals')
            .mockImplementationOnce(() => Promise.resolve('18'))
            .mockImplementationOnce(() => Promise.resolve('18'));

        const spyGetReturn = jest
            .spyOn(ethereum, 'getReturn')
            .mockImplementationOnce(() => Promise.resolve('662806411110393058533'));

        const spyGetConverterSettings = jest
            .spyOn(eos, 'getConverterSettings')
            .mockImplementationOnce(() => Promise.resolve({ rows: [{ fee: 2500 }] }));

        const spyGetSmartTokens = jest
            .spyOn(eos, 'getSmartTokens')
            .mockImplementationOnce(() => ({ }))
            .mockImplementationOnce(() => ({ }))
            .mockImplementationOnce(() => ({ }))
            .mockImplementationOnce(() => ({ }));

        const spyGetReservesFromCode = jest
            .spyOn(eos, 'getReservesFromCode')
            .mockImplementationOnce(() => Promise.resolve({
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
            }));

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

        const spyGetCheapestPath = jest
            .spyOn(sdk, 'getCheapestPath')
            .mockImplementationOnce(() => Promise.resolve([
                { blockchainType: 'ethereum', blockchainId: '0x1111111111111111111111111111111111111111' },
                { blockchainType: 'ethereum', blockchainId: '0x2222222222222222222222222222222222222222' },
                { blockchainType: 'ethereum', blockchainId: '0x3333333333333333333333333333333333333333' },
                { blockchainType: 'eos', blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' },
                { blockchainType: 'eos', blockchainId: 'aaacccaaaccc', symbol: 'AAACCC' },
                { blockchainType: 'eos', blockchainId: 'cccccccccccc', symbol: 'CCC' }
            ]));

        await sdk.refresh();

        const received = await sdk.getCheapestPathRate(
            { blockchainType: 'ethereum', blockchainId: '0x1111111111111111111111111111111111111111' },
            { blockchainType: 'eos', blockchainId: 'cccccccccccc', symbol: 'CCC' }
        );

        expect(received).toEqual('3226688.084642570529407094055738289769947463047257618333877712134072470684667713285913835113451935283');
        expect(spyGetSmartTokens).toHaveBeenCalledTimes(4);
        expect(spyGetReservesFromCode).toHaveBeenCalledTimes(1);
        expect(spyGetConverterSettings).toHaveBeenCalledTimes(1);
        expect(spyGetReserveBalances).toHaveBeenCalledTimes(2);
        expect(spyGetDecimals).toHaveBeenCalledTimes(2);
        expect(spyGetReturn).toHaveBeenCalledTimes(1);
        expect(spyGetCheapestPath).toHaveBeenCalledTimes(1);
    });

    it('getCheapestPathRate from ethereum token to ethereum token', async () => {
        const spyGetDecimals = jest
            .spyOn(ethereum, 'getDecimals')
            .mockImplementationOnce(() => Promise.resolve('18'))
            .mockImplementationOnce(() => Promise.resolve('18'));

        const spyGetReturn = jest
            .spyOn(ethereum, 'getReturn')
            .mockImplementationOnce(() => Promise.resolve('209035338725170038366'));

        const spyGetCheapestPath = jest
            .spyOn(sdk, 'getCheapestPath')
            .mockImplementationOnce(() => Promise.resolve([
                { blockchainType: 'ethereum', blockchainId: '0x1111111111111111111111111111111111111111' },
                { blockchainType: 'ethereum', blockchainId: '0x2222222222222222222222222222222222222222' },
                { blockchainType: 'ethereum', blockchainId: '0x3333333333333333333333333333333333333333' }
            ]));

        await sdk.refresh();

        const received = await sdk.getCheapestPathRate(
            { blockchainType: 'ethereum', blockchainId: '0x1111111111111111111111111111111111111111' },
            { blockchainType: 'ethereum', blockchainId: '0x3333333333333333333333333333333333333333' }
        );

        expect(received).toEqual('209.035338725170038366');
        expect(spyGetDecimals).toHaveBeenCalledTimes(2);
        expect(spyGetReturn).toHaveBeenCalledTimes(1);
        expect(spyGetCheapestPath).toHaveBeenCalledTimes(1);
    });
});
