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

    it('EOS token to EOS token path finder', async () => {
        const karmaBntPath: path_generation.ConversionPaths = { paths: [{ type: 'eos', path: ['therealkarma', 'bancorc11112', 'bntbntbntbnt']}]};

        const spyGeneratePath = jest
            .spyOn(path_generation, 'generatePathByBlockchainIds')
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

        const spyGetSmartTokens = jest
            .spyOn(ethereum, 'getSmartTokens')
            .mockResolvedValueOnce([
                '0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533',
                '0x482c31355F4f7966fFcD38eC5c9635ACAe5F4D4F'
            ])
            .mockResolvedValueOnce([
                '0x99eBD396Ce7AA095412a4Cd1A0C959D6Fd67B340',
                '0xAeBfeA5ce20af9fA2c65fb62863b31A90b7e056b'
            ]);

        const spyGetConverterBlockchainId = jest
            .spyOn(path_generation, 'getConverterBlockchainId')
            .mockResolvedValueOnce('0xd3ec78814966Ca1Eb4c923aF4Da86BF7e6c743bA')
            .mockResolvedValueOnce('0x89f26Fff3F690B19057e6bEb7a82C5c29ADfe20B');

        const resToken = {
            blockchainType: 'ethereum' as path_generation.BlockchainType,
            blockchainId: '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C'
        };

        const spyGetReserveTokens = jest
            .spyOn(ethereum, 'getReserveTokens')
            .mockImplementation(() => Promise.resolve([resToken]));

        const response = await sdk.generatePath({
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
        expect(spyGetConverterBlockchainId).toHaveBeenCalledTimes(2);
        expect(spyGetReserveTokens).toHaveBeenCalledTimes(2);
    });

    it('ETH to KARMA path finder', async () => {
        const spyGetSmartTokens = jest
            .spyOn(ethereum, 'getSmartTokens')
            .mockResolvedValue([
                '0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533',
                '0x482c31355F4f7966fFcD38eC5c9635ACAe5F4D4F'
            ]);

        const spyGetEthereumConverterBlockchainId = jest
            .spyOn(ethereum, 'getConverterBlockchainId')
            .mockResolvedValueOnce('0xd3ec78814966Ca1Eb4c923aF4Da86BF7e6c743bA');

        const spyGetEOSereumConverterBlockchainId = jest
            .spyOn(eos, 'getConverterBlockchainId')
            .mockResolvedValueOnce({ BNTKRM: 'bancorc11112' });

        const resToken1 = {
            blockchainType: 'ethereum' as path_generation.BlockchainType,
            blockchainId: '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C'

        };
        const resToken2 = {
            blockchainType: 'eos' as path_generation.BlockchainType,
            blockchainId: 'bntbntbntbnt',
            symbol: 'BNT'
        };

        const spyEthGetReserveTokens = jest
            .spyOn(ethereum, 'getReserveTokens')
            .mockImplementationOnce(() => Promise.resolve([resToken1]));

        const spyEosGetReserveTokens = jest
            .spyOn(eos, 'getReserveTokens')
            .mockImplementationOnce(() => Promise.resolve([resToken2]));

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
        expect(spyGetSmartTokens).toHaveBeenCalledTimes(1);
        expect(spyGetEthereumConverterBlockchainId).toHaveBeenCalledTimes(1);
        expect(spyGetEOSereumConverterBlockchainId).toHaveBeenCalledTimes(1);
        expect(spyEthGetReserveTokens).toHaveBeenCalledTimes(1);
        expect(spyEosGetReserveTokens).toHaveBeenCalledTimes(1);
    });
});
