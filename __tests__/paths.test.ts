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
        const srcToken = '0xc0829421c1d260bd3cb3e0f06cfe2d52db2ce315';
        const trgToken = '0xd26114cd6ee289accf82350c8d8487fedb8a0c07';

        const spyGetAllPaths = jest
            .spyOn(ethereum, 'getAllPaths')
            .mockImplementation(() => Promise.resolve([[
                { blockchainType: 'ethereum' as path_generation.BlockchainType, blockchainId: '0xc0829421c1d260bd3cb3e0f06cfe2d52db2ce315' },
                { blockchainType: 'ethereum' as path_generation.BlockchainType, blockchainId: '0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533' },
                { blockchainType: 'ethereum' as path_generation.BlockchainType, blockchainId: '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c' },
                { blockchainType: 'ethereum' as path_generation.BlockchainType, blockchainId: '0x99eBD396Ce7AA095412a4Cd1A0C959D6Fd67B340' },
                { blockchainType: 'ethereum' as path_generation.BlockchainType, blockchainId: '0xd26114cd6ee289accf82350c8d8487fedb8a0c07' }
            ]]));

        const response = await sdk.generatePath({
            blockchainType: 'ethereum',
            blockchainId: srcToken
        }, {
            blockchainType: 'ethereum',
            blockchainId: trgToken
        });

        const expectedResult = [
            [
                { blockchainType: 'ethereum' as path_generation.BlockchainType, blockchainId: '0xc0829421c1d260bd3cb3e0f06cfe2d52db2ce315' },
                { blockchainType: 'ethereum' as path_generation.BlockchainType, blockchainId: '0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533' },
                { blockchainType: 'ethereum' as path_generation.BlockchainType, blockchainId: '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c' },
                { blockchainType: 'ethereum' as path_generation.BlockchainType, blockchainId: '0x99eBD396Ce7AA095412a4Cd1A0C959D6Fd67B340' },
                { blockchainType: 'ethereum' as path_generation.BlockchainType, blockchainId: '0xd26114cd6ee289accf82350c8d8487fedb8a0c07' }
            ]
        ];

        expect(response).toEqual(expectedResult);
        expect(spyGetAllPaths).toHaveBeenCalledTimes(1);
    });

    it('ETH to KARMA path finder', async () => {
        const spyGetAllPaths = jest
            .spyOn(ethereum, 'getAllPaths')
            .mockImplementation(() => Promise.resolve([[
                { blockchainType: 'ethereum' as path_generation.BlockchainType, blockchainId: '0xc0829421c1d260bd3cb3e0f06cfe2d52db2ce315' },
                { blockchainType: 'ethereum' as path_generation.BlockchainType, blockchainId: '0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533' },
                { blockchainType: 'ethereum' as path_generation.BlockchainType, blockchainId: '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c' }
            ]]));

        const spyGetConversionPath = jest
            .spyOn(eos, 'getConversionPath')
            .mockResolvedValueOnce([
                { blockchainType: 'eos' as path_generation.BlockchainType, blockchainId: 'bntbntbntbnt', symbol: 'BNT' },
                { blockchainType: 'eos' as path_generation.BlockchainType, blockchainId: 'bancorc11112', symbol: 'BNTKRM' },
                { blockchainType: 'eos' as path_generation.BlockchainType, blockchainId: 'therealkarma', symbol: 'KARMA' }
            ]);

        const response = await sdk.generatePath({
            blockchainType: 'ethereum',
            blockchainId: '0xc0829421c1d260bd3cb3e0f06cfe2d52db2ce315'
        },
        {
            blockchainType: 'eos',
            blockchainId: 'therealkarma',
            symbol: 'KARMA'
        });

        const expectedResult = [
            [
                { blockchainType: 'ethereum' as path_generation.BlockchainType, blockchainId: '0xc0829421c1d260bd3cb3e0f06cfe2d52db2ce315' },
                { blockchainType: 'ethereum' as path_generation.BlockchainType, blockchainId: '0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533' },
                { blockchainType: 'ethereum' as path_generation.BlockchainType, blockchainId: '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c' }
            ],
            [
                { blockchainType: 'eos' as path_generation.BlockchainType, blockchainId: 'bntbntbntbnt', symbol: 'BNT' },
                { blockchainType: 'eos' as path_generation.BlockchainType, blockchainId: 'bancorc11112', symbol: 'BNTKRM' },
                { blockchainType: 'eos' as path_generation.BlockchainType, blockchainId: 'therealkarma', symbol: 'KARMA' }
            ]
        ];

        expect(response).toEqual(expectedResult);
        expect(spyGetAllPaths).toHaveBeenCalledTimes(1);
        expect(spyGetConversionPath).toHaveBeenCalledTimes(1);
    });
});
