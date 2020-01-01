import * as x from '../src/index';
import * as genPath from '../src/path_generation';
// import * as genPath from '../src/path_generation';
// import * as x from '../src/index';
// import { ConversionPaths } from '../src/path_generation';
test('mock test', async () => {
    // describe('mock test', () => {
    // expect('1').toBe('1');
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const karmaBntPath: genPath.ConversionPaths = { paths: [{ type: 'eos', path: ['therealkarma', 'bancorc11112', 'bntbntbntbnt']}]};

    const spyGeneratePath = jest
        .spyOn(genPath, 'generatePathByBlockchainIds')
        .mockImplementation(() => Promise.resolve(karmaBntPath));
    const result = await x.generatePath({ blockchainId: 'bntbntbntbnt', blockchainType: 'eos', symbol: 'BNT' }, { blockchainId: 'therealkarma', symbol: 'KARMA', blockchainType: 'eos' });
    expect(spyGeneratePath).toHaveBeenCalledTimes(1);

    const shortestPathResult = ['therealkarma', 'bancorc11112', 'bntbntbntbnt'];

    // const spyGeneratePath2 = jest
    //     .spyOn(x, 'calculateRateFromPaths')
    //     .mockReturnValue('5');

    // await x.getRateByPath(karmaBntPath, '1');
    // expect(spyGeneratePath2).toHaveBeenCalled();
});
