import { SDK } from '../src/index';
import * as eos from '../src/blockchains/eos';
import * as ethereum from '../src/blockchains/ethereum';

describe('rates test', () => {
    const sdk = new SDK();

    beforeEach(async () => {
        jest.restoreAllMocks();
    });

    afterEach(async () => {
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

    for (const event of events) {
        for (const offset of [-1, 0, +1]) {
            it('getConversionEvents on ethereum', async () => {
                setConverterVersionGetter(sdk, logs, events);
                const received = await sdk.getConversionEvents({ blockchainType: 'ethereum', blockchainId: '0x'.padEnd(42, '1') }, 1, event.blockNumber + offset);
                expect(received.length).toEqual(events.filter(e => 1 <= e.blockNumber && e.blockNumber <= event.blockNumber + offset).length);
            });
        }
    }

    for (const event of events) {
        for (const offset of [-1, 0, +1]) {
            it('getConversionEventsByTimestamp on ethereum', async () => {
                setConverterVersionGetter(sdk, logs, events);
                const received = await sdk.getConversionEventsByTimestamp({ blockchainType: 'ethereum', blockchainId: '0x'.padEnd(42, '1') }, 1, event.blockNumber + offset);
                expect(received.length).toEqual(events.filter(e => 1 <= e.blockNumber && e.blockNumber <= event.blockNumber + offset).length);
            });
        }
    }
});

function setConverterVersionGetter(sdk, logs, events) {
    sdk.ethereum.web3 = {
        eth: {
            getBlock: function(number) {
                if (number == "latest")
                    number = Number.MAX_SAFE_INTEGER;
                return {number: number, timestamp: number};
            },
            getPastLogs: function({address: address, topics: [topic0], fromBlock: fromBlock, toBlock: toBlock}) {
                return logs.filter(log => fromBlock <= log.blockNumber && log.blockNumber <= toBlock);
            },
            Contract: function(abi, address) {
                return {
                    getPastEvents: function(eventName, {fromBlock: fromBlock, toBlock: toBlock}) {
                        return events.filter(event => fromBlock <= event.blockNumber && event.blockNumber <= toBlock);
                    },
                    methods: {
                        decimals: function() {
                            return {
                                call: function() {
                                    return '18';
                                }
                            };
                        }
                    }
                };
            }
        }
    };
}
