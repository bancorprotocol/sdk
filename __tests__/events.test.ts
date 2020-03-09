import { SDK } from '../src/index';
import * as eos from '../src/blockchains/eos/index';
import * as ethereum from '../src/blockchains/ethereum/index';
import * as ethereumMocks from '../src/blockchains/ethereum/mocks';

describe('events test', () => {
    let sdk: SDK;

    beforeEach(async () => {
        jest.spyOn(ethereum, 'getWeb3').mockImplementationOnce(ethereumMocks.getWeb3);
        sdk = await SDK.create({eosNodeEndpoint: 'dummy', ethereumNodeEndpoint: 'dummy'});
    });

    afterEach(async () => {
        await SDK.destroy(sdk);
        jest.restoreAllMocks();
    });

    const logs = Array.from(Array(10).keys()).map(n => ({
        blockNumber: 500 + 1000 * n,
        topics: [
            '0x'.padEnd(66, `${3 * n + 0}`),
            '0x'.padEnd(66, `${3 * n + 1}`),
            '0x'.padEnd(66, `${3 * n + 2}`)
        ]
    }));

    const events = Array.from(Array(100).keys()).map(n => ({
        blockNumber: 1000 + 100 * n,
        returnValues: {
            fromToken: '0x'.padEnd(42, `${n + 1}`),
            toToken: '0x'.padEnd(42, `${n + 2}`),
            trader: '0x'.padEnd(42, `${n + 3}`),
            inputAmount: `${123 * n + 1}`,
            outputAmount: `${456 * n + 1}`,
            conversionFee: `${789 * n + 1}`
        }
    }));

    it('getConversionEvents on eos', async () => {
        const promise = sdk.getConversionEvents({ blockchainType: 'eos', blockchainId: '', symbol: '' }, 0, 0);
        expect(promise).rejects.toEqual(new Error('getConversionEvents not supported on eos'));
    });

    it('getConversionEventsByTimestamp on eos', async () => {
        const promise = sdk.getConversionEventsByTimestamp({ blockchainType: 'eos', blockchainId: '', symbol: '' }, 0, 0);
        expect(promise).rejects.toEqual(new Error('getConversionEventsByTimestamp not supported on eos'));
    });

    for (const event of events) {
        for (const offset of [-1, 0, +1]) {
            it('getConversionEvents on ethereum', async () => {
                ethereumMocks.setConverterEventsGetter(sdk.ethereum, logs, events);
                const received = await sdk.getConversionEvents({ blockchainType: 'ethereum', blockchainId: '0x'.padEnd(42, '1') }, 1, event.blockNumber + offset);
                expect(received.length).toEqual(events.filter(e => 1 <= e.blockNumber && e.blockNumber <= event.blockNumber + offset).length);
            });
        }
    }

    for (const event of events) {
        for (const offset of [-1, 0, +1]) {
            it('getConversionEventsByTimestamp on ethereum', async () => {
                ethereumMocks.setConverterEventsGetter(sdk.ethereum, logs, events);
                const received = await sdk.getConversionEventsByTimestamp({ blockchainType: 'ethereum', blockchainId: '0x'.padEnd(42, '1') }, 1, event.blockNumber + offset);
                expect(received.length).toEqual(events.filter(e => 1 <= e.blockNumber && e.blockNumber <= event.blockNumber + offset).length);
            });
        }
    }
});
