import * as sdk from '../src/index';
import * as genPath from '../src/path_generation';
import * as ethereumFunctions from '../src/blockchains/ethereum';
import * as eosFunctions from '../src/blockchains/eos';

describe('Path finder tests', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('EOS token to EOS token path finder', async () => {
        const karmaBntPath: genPath.ConversionPaths = { paths: [{ type: 'eos', path: ['therealkarma', 'bancorc11112', 'bntbntbntbnt']}]};

        const spyGeneratePath = jest
            .spyOn(genPath, 'generatePathByBlockchainIds')
            .mockImplementation(() => Promise.resolve(karmaBntPath));

        const { paths } = await sdk.generatePath(
            { blockchainId: 'bntbntbntbnt', blockchainType: 'eos', symbol: 'BNT' },
            { blockchainId: 'therealkarma', symbol: 'KARMA', blockchainType: 'eos' }
        );

        expect(spyGeneratePath).toHaveBeenCalledTimes(1);
        const shortestPathResult = ['therealkarma', 'bancorc11112', 'bntbntbntbnt'];
        expect(paths[0].path).toEqual(shortestPathResult);
    });

    it('ETH to token path finder', async () => {
        const srcToken = '0xc0829421c1d260bd3cb3e0f06cfe2d52db2ce315';
        const trgToken = '0xd26114cd6ee289accf82350c8d8487fedb8a0c07';

        const spyGetAllPaths = jest
            .spyOn(ethereumFunctions, 'getAllPaths')
            .mockImplementation(() => Promise.resolve([[
                '0xc0829421c1d260bd3cb3e0f06cfe2d52db2ce315',
                '0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533',
                '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c',
                '0x99eBD396Ce7AA095412a4Cd1A0C959D6Fd67B340',
                '0xd26114cd6ee289accf82350c8d8487fedb8a0c07'
            ]]));

        const response = await sdk.generatePath({
            blockchainType: 'ethereum',
            blockchainId: srcToken
        }, {
            blockchainType: 'ethereum',
            blockchainId: trgToken
        });

        const expectedResult = [
            {
                type: 'ethereum',
                path: [
                    '0xc0829421c1d260bd3cb3e0f06cfe2d52db2ce315',
                    '0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533',
                    '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c',
                    '0x99eBD396Ce7AA095412a4Cd1A0C959D6Fd67B340',
                    '0xd26114cd6ee289accf82350c8d8487fedb8a0c07'
                ]
            }
        ];

        expect(response.paths).toEqual(expectedResult);
        expect(spyGetAllPaths).toHaveBeenCalledTimes(1);
    });

    it('ETH to KARMA path finder', async () => {
        const spyGetAllPaths = jest
            .spyOn(ethereumFunctions, 'getAllPaths')
            .mockImplementation(() => Promise.resolve([[
                '0xc0829421c1d260bd3cb3e0f06cfe2d52db2ce315',
                '0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533',
                '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c'
            ]]));

        const spyGetEosConverterBlockchainId = jest
            .spyOn(eosFunctions, 'getConverterBlockchainId')
            .mockResolvedValueOnce({ BNTKRM: 'bancorc11112' });

        const spyGetReserves = jest
            .spyOn(genPath, 'getReserves')
            .mockImplementation(() => Promise.resolve({ reserves: {} }));

        const spyGetReserveCount = jest
            .spyOn(genPath, 'getReserveCount')
            .mockResolvedValueOnce('2');

        const resToken2 = {
            blockchainType: 'eos' as genPath.BlockchainType,
            blockchainId: 'bntbntbntbnt',
            symbol: 'BNT'
        };

        const spyGetReserveToken = jest
            .spyOn(genPath, 'getReserveToken')
            .mockImplementationOnce(() => Promise.resolve(resToken2));

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
            {
                type: 'ethereum',
                path: [
                    '0xc0829421c1d260bd3cb3e0f06cfe2d52db2ce315',
                    '0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533',
                    '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c'
                ]
            },
            {
                type: 'eos',
                path: [{ BNT: 'bntbntbntbnt' }, { BNTKRM: 'bancorc11112' }, { KARMA: 'therealkarma' }]
            }
        ];

        expect(response.paths).toEqual(expectedResult);
        expect(spyGetAllPaths).toHaveBeenCalledTimes(1);
        expect(spyGetReserves).toHaveBeenCalledTimes(1);
        expect(spyGetEosConverterBlockchainId).toHaveBeenCalledTimes(1);
        expect(spyGetReserveCount).toHaveBeenCalledTimes(1);
        expect(spyGetReserveToken).toHaveBeenCalledTimes(1);
    });
});
