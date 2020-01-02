import * as x from '../src/index';
import * as genPath from '../src/path_generation';
import * as ethereumFunctions from '../src/blockchains/ethereum';

describe('Path finder tests', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('EOS token to EOS token path finder', async () => {
        const karmaBntPath: genPath.ConversionPaths = { paths: [{ type: 'eos', path: ['therealkarma', 'bancorc11112', 'bntbntbntbnt']}]};

        const spyGeneratePath = jest
            .spyOn(genPath, 'generatePathByBlockchainIds')
            .mockImplementation(() => Promise.resolve(karmaBntPath));

        const { paths } = await x.generatePath(
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

        const spyGetSmartTokens = jest
            .spyOn(ethereumFunctions, 'getSmartTokens')
            .mockResolvedValueOnce([
                '0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533',
                '0x482c31355F4f7966fFcD38eC5c9635ACAe5F4D4F'
            ])
            .mockResolvedValueOnce([
                '0x99eBD396Ce7AA095412a4Cd1A0C959D6Fd67B340',
                '0xAeBfeA5ce20af9fA2c65fb62863b31A90b7e056b'
            ]);

        const spyGetConverterBlockchainId = jest
            .spyOn(genPath, 'getConverterBlockchainId')
            .mockResolvedValueOnce('0xd3ec78814966Ca1Eb4c923aF4Da86BF7e6c743bA')
            .mockResolvedValueOnce('0x89f26Fff3F690B19057e6bEb7a82C5c29ADfe20B');

        const spyGetReserves = jest
            .spyOn(genPath, 'getReserves')
            .mockImplementation(() => Promise.resolve({ reserves: {} }));

        const spyGetReserveCount = jest
            .spyOn(genPath, 'getReserveCount')
            .mockResolvedValueOnce('2')
            .mockResolvedValueOnce('2');

        const resToken = {
            blockchainType: 'ethereum' as genPath.BlockchainType,
            blockchainId: '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C'
        };

        const spyGetReserveToken = jest
            .spyOn(genPath, 'getReserveToken')
            .mockImplementation(() => Promise.resolve(resToken));

        const response = await x.generatePath({
            blockchainType: 'ethereum',
            blockchainId: srcToken
        }, {
            blockchainType: 'ethereum',
            blockchainId: trgToken
        });
        const expectedResult: string[] = [
            '0xc0829421c1d260bd3cb3e0f06cfe2d52db2ce315',
            '0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533',
            '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c',
            '0x99eBD396Ce7AA095412a4Cd1A0C959D6Fd67B340',
            '0xd26114cd6ee289accf82350c8d8487fedb8a0c07'
        ];

        expect(response.paths[0].path).toEqual(expectedResult);
        expect(spyGetSmartTokens).toHaveBeenCalledTimes(2);
        expect(spyGetReserves).toHaveBeenCalled();
        expect(spyGetConverterBlockchainId).toHaveBeenCalledTimes(2);
        expect(spyGetReserveCount).toHaveBeenCalledTimes(2);
        expect(spyGetReserveToken).toHaveBeenCalledTimes(2);
    });
});
