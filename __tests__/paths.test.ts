import * as sdk from '../src/index';
import * as eos from '../src/blockchains/eos';
import * as ethereum from '../src/blockchains/ethereum';
import * as path_generation from '../src/path_generation';

describe('Path finder tests', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('ETH to token path finder', async () => {
        const spyGetGraph = jest
            .spyOn(ethereum, 'getGraph')
            .mockImplementation(() => Promise.resolve({
                '0xc0829421C1d260BD3cB3E0F06cfE2D52db2cE315' : ['0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533'],
                '0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533' : ['0xc0829421C1d260BD3cB3E0F06cfE2D52db2cE315', '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C'],
                '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C' : ['0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533', '0x99eBD396Ce7AA095412a4Cd1A0C959D6Fd67B340'],
                '0x99eBD396Ce7AA095412a4Cd1A0C959D6Fd67B340' : ['0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C', '0xd26114cd6EE289AccF82350c8d8487fedB8A0C07'],
                '0xd26114cd6EE289AccF82350c8d8487fedB8A0C07' : ['0x99eBD396Ce7AA095412a4Cd1A0C959D6Fd67B340']
            }));

        const response = await sdk.generatePath({
            blockchainType: 'ethereum',
            blockchainId: '0xc0829421C1d260BD3cB3E0F06cfE2D52db2cE315'
        }, {
            blockchainType: 'ethereum',
            blockchainId: '0xd26114cd6EE289AccF82350c8d8487fedB8A0C07'
        });

        const expectedResult = [
            [
                { blockchainType: 'ethereum', blockchainId: '0xc0829421C1d260BD3cB3E0F06cfE2D52db2cE315' },
                { blockchainType: 'ethereum', blockchainId: '0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533' },
                { blockchainType: 'ethereum', blockchainId: '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C' },
                { blockchainType: 'ethereum', blockchainId: '0x99eBD396Ce7AA095412a4Cd1A0C959D6Fd67B340' },
                { blockchainType: 'ethereum', blockchainId: '0xd26114cd6EE289AccF82350c8d8487fedB8A0C07' }
            ]
        ];

        expect(response).toEqual(expectedResult);
        expect(spyGetGraph).toHaveBeenCalledTimes(1);
    });

    it('ETH to KARMA path finder', async () => {
        const spyGetGraph = jest
            .spyOn(ethereum, 'getGraph')
            .mockImplementation(() => Promise.resolve({
               '0xc0829421C1d260BD3cB3E0F06cfE2D52db2cE315' : ['0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533'],
               '0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533' : ['0xc0829421C1d260BD3cB3E0F06cfE2D52db2cE315', '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C'],
               '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C' : ['0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533']
            }));

        const spyGetConversionPath = jest
            .spyOn(eos, 'getConversionPath')
            .mockResolvedValueOnce([
                { blockchainType: 'eos', blockchainId: 'bntbntbntbnt', symbol: 'BNT' },
                { blockchainType: 'eos', blockchainId: 'bancorc11112', symbol: 'BNTKRM' },
                { blockchainType: 'eos', blockchainId: 'therealkarma', symbol: 'KARMA' }
            ]);

        const response = await sdk.generatePath({
            blockchainType: 'ethereum',
            blockchainId: '0xc0829421C1d260BD3cB3E0F06cfE2D52db2cE315'
        },
        {
            blockchainType: 'eos',
            blockchainId: 'therealkarma',
            symbol: 'KARMA'
        });

        const expectedResult = [
            [
                { blockchainType: 'ethereum', blockchainId: '0xc0829421C1d260BD3cB3E0F06cfE2D52db2cE315' },
                { blockchainType: 'ethereum', blockchainId: '0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533' },
                { blockchainType: 'ethereum', blockchainId: '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C' }
            ],
            [
                { blockchainType: 'eos', blockchainId: 'bntbntbntbnt', symbol: 'BNT' },
                { blockchainType: 'eos', blockchainId: 'bancorc11112', symbol: 'BNTKRM' },
                { blockchainType: 'eos', blockchainId: 'therealkarma', symbol: 'KARMA' }
            ]
        ];

        expect(response).toEqual(expectedResult);
        expect(spyGetGraph).toHaveBeenCalledTimes(1);
        expect(spyGetConversionPath).toHaveBeenCalledTimes(1);
    });
});
