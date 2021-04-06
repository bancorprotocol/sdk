import { SDK } from '../src';
import { BlockchainType } from '../src/types';
import * as ethereum from '../src/blockchains/ethereum';
import * as ethereumMocks from './mocks/ethereum';

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

    const conversionEvents = Array.from(Array(100).keys()).map(n => ({
        blockNumber: 1000 + 100 * n,
        returnValues: {
            sourceToken: '0x'.padEnd(42, `${n + 1}`),
            targetToken: '0x'.padEnd(42, `${n + 2}`),
            inputAmount: `${123 * n + 1}`,
            outputAmount: `${456 * n + 1}`,
            conversionFee: `${789 * n + 1}`,
            trader: '0x'.padEnd(42, `${n + 3}`),
        }
    }));

    const tokenRateEvents = Array.from(Array(100).keys()).map(n => ({
        blockNumber: 1000 + 100 * n,
        returnValues: {
            sourceToken: '0x'.padEnd(42, `${n + 1}`),
            targetToken: '0x'.padEnd(42, `${n + 2}`),
            tokenRateN: `${123 * n + 1}`,
            tokenRateD: `${456 * n + 1}`,
        }
    }));

    for (const event of conversionEvents) {
        for (const offset of [-1, 0, +1]) {
            it('getConversionEvents on ethereum', async () => {
                ethereumMocks.setConverterEventsGetter(sdk._core.blockchains[BlockchainType.Ethereum], logs, conversionEvents);
                const received = await sdk.history.getConversionEvents({ blockchainType: BlockchainType.Ethereum, blockchainId: '0x'.padEnd(42, '1') }, 1, event.blockNumber + offset);
                expect(received.length).toEqual(conversionEvents.filter(e => 1 <= e.blockNumber && e.blockNumber <= event.blockNumber + offset).length);
            });
        }
    }

    for (const event of conversionEvents) {
        for (const offset of [-1, 0, +1]) {
            it('getConversionEventsByTimestamp on ethereum', async () => {
                ethereumMocks.setConverterEventsGetter(sdk._core.blockchains[BlockchainType.Ethereum], logs, conversionEvents);
                const received = await sdk.history.getConversionEventsByTimestamp({ blockchainType: BlockchainType.Ethereum, blockchainId: '0x'.padEnd(42, '1') }, 1, event.blockNumber + offset);
                expect(received.length).toEqual(conversionEvents.filter(e => 1 <= e.blockNumber && e.blockNumber <= event.blockNumber + offset).length);
            });
        }
    }

    for (const event of tokenRateEvents) {
        for (const offset of [-1, 0, +1]) {
            it('getTokenRateEvents on ethereum', async () => {
                ethereumMocks.setConverterEventsGetter(sdk._core.blockchains[BlockchainType.Ethereum], logs, tokenRateEvents);
                const received = await sdk.history.getTokenRateEvents({ blockchainType: BlockchainType.Ethereum, blockchainId: '0x'.padEnd(42, '1') }, 1, event.blockNumber + offset);
                expect(received.length).toEqual(tokenRateEvents.filter(e => 1 <= e.blockNumber && e.blockNumber <= event.blockNumber + offset).length);
            });
        }
    }

    for (const event of tokenRateEvents) {
        for (const offset of [-1, 0, +1]) {
            it('getTokenRateEventsByTimestamp on ethereum', async () => {
                ethereumMocks.setConverterEventsGetter(sdk._core.blockchains[BlockchainType.Ethereum], logs, tokenRateEvents);
                const received = await sdk.history.getTokenRateEventsByTimestamp({ blockchainType: BlockchainType.Ethereum, blockchainId: '0x'.padEnd(42, '1') }, 1, event.blockNumber + offset);
                expect(received.length).toEqual(tokenRateEvents.filter(e => 1 <= e.blockNumber && e.blockNumber <= event.blockNumber + offset).length);
            });
        }
    }

    it('getConversionEvents on eos', async () => {
        const promise = sdk.history.getConversionEvents({ blockchainType: BlockchainType.EOS, blockchainId: '', symbol: '' }, 0, 0);
        expect(promise).rejects.toEqual(new Error('getConversionEvents not supported on eos'));
    });

    it('getConversionEventsByTimestamp on eos', async () => {
        const promise = sdk.history.getConversionEventsByTimestamp({ blockchainType: BlockchainType.EOS, blockchainId: '', symbol: '' }, 0, 0);
        expect(promise).rejects.toEqual(new Error('getConversionEventsByTimestamp not supported on eos'));
    });

    it('getTokenRateEvents on eos', async () => {
        const promise = sdk.history.getTokenRateEvents({ blockchainType: BlockchainType.EOS, blockchainId: '', symbol: '' }, 0, 0);
        expect(promise).rejects.toEqual(new Error('getTokenRateEvents not supported on eos'));
    });

    it('getTokenRateEventsByTimestamp on eos', async () => {
        const promise = sdk.history.getTokenRateEventsByTimestamp({ blockchainType: BlockchainType.EOS, blockchainId: '', symbol: '' }, 0, 0);
        expect(promise).rejects.toEqual(new Error('getTokenRateEventsByTimestamp not supported on eos'));
    });
});
