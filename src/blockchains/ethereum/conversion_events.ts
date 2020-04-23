import Web3 from 'web3';
import { ERC20Token } from './abis';
import { fromWei } from '../../helpers';

const GENESIS_BLOCK_NUMBER = 3851136;

const OWNER_UPDATE_EVENT_HASH = Web3.utils.keccak256("OwnerUpdate(address,address)");

const CONVERSION_EVENT_LEGACY = [
    {"anonymous":false,"inputs":[{"indexed":true,"name":"fromToken","type":"address"},{"indexed":true,"name":"toToken","type":"address"},{"indexed":true,"name":"trader","type":"address"},{"indexed":false,"name":"inputAmount","type":"uint256"},{"indexed":false,"name":"outputAmount","type":"uint256"}],"name":"Change","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":true,"name":"fromToken","type":"address"},{"indexed":true,"name":"toToken","type":"address"},{"indexed":true,"name":"trader","type":"address"},{"indexed":false,"name":"inputAmount","type":"uint256"},{"indexed":false,"name":"outputAmount","type":"uint256"},{"indexed":false,"name":"_currentPriceN","type":"uint256"},{"indexed":false,"name":"_currentPriceD","type":"uint256"}],"name":"Conversion","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":true,"name":"fromToken","type":"address"},{"indexed":true,"name":"toToken","type":"address"},{"indexed":true,"name":"trader","type":"address"},{"indexed":false,"name":"inputAmount","type":"uint256"},{"indexed":false,"name":"outputAmount","type":"uint256"},{"indexed":false,"name":"conversionFee","type":"int256"}],"name":"Conversion","type":"event"}
];

function parseOwnerUpdateEvent(log) {
    const indexed = log.topics.length > 1;
    return {
        blockNumber: log.blockNumber,
        prevOwner: Web3.utils.toChecksumAddress(indexed ? log.topics[1].slice(-40) : log.data.slice(26, 66)),
        currOwner: Web3.utils.toChecksumAddress(indexed ? log.topics[2].slice(-40) : log.data.slice(90, 130))
    };
}

async function getTokenAmount(web3, decimals, token, amount) {
    if (amount == undefined || amount == "0") {
        return amount;
    }
    if (decimals[token] == undefined) {
        const tokenContract = new web3.eth.Contract(ERC20Token, token);
        decimals[token] = await tokenContract.methods.decimals().call();
    }
    return fromWei(amount, decimals[token]);
}

async function getPastLogs(web3, address, topic0, fromBlock, toBlock) {
    if (fromBlock <= toBlock) {
        try {
            return await web3.eth.getPastLogs({address: address, topics: [topic0], fromBlock: fromBlock, toBlock: toBlock});
        }
        catch (error) {
            const midBlock = (fromBlock + toBlock) >> 1;
            const arr1 = await getPastLogs(web3, address, topic0, fromBlock, midBlock);
            const arr2 = await getPastLogs(web3, address, topic0, midBlock + 1, toBlock);
            return [...arr1, ...arr2];
        }
    }
    return [];
}

async function getPastEvents(contract, eventName, fromBlock, toBlock) {
    if (fromBlock <= toBlock) {
        try {
            return await contract.getPastEvents(eventName, {fromBlock: fromBlock, toBlock: toBlock});
        }
        catch (error) {
            const midBlock = (fromBlock + toBlock) >> 1;
            const arr1 = await getPastEvents(contract, eventName, fromBlock, midBlock);
            const arr2 = await getPastEvents(contract, eventName, midBlock + 1, toBlock);
            return [...arr1, ...arr2];
        }
    }
    return [];
}

async function getOwnerUpdateEvents(web3, token, fromBlock, toBlock) {
    const logs = await getPastLogs(web3, token, OWNER_UPDATE_EVENT_HASH, fromBlock, toBlock);
    if (logs.length > 0)
        return logs.map(log => parseOwnerUpdateEvent(log));
    const prelogs = await getPastLogs(web3, token, OWNER_UPDATE_EVENT_HASH, GENESIS_BLOCK_NUMBER, fromBlock - 1);
    if (prelogs.length > 0)
        return [parseOwnerUpdateEvent(prelogs[prelogs.length - 1])];
    throw new Error("Inactive Token");
}

export async function get(web3, decimals, token, fromBlock, toBlock) {
    const result = [];

    const batches = [{fromBlock: fromBlock, toBlock: undefined, owner: undefined}];
    const events = await getOwnerUpdateEvents(web3, token, fromBlock, toBlock);
    for (const event of events.filter(event => event.blockNumber > fromBlock)) {
        batches[batches.length - 1].toBlock = event.blockNumber - 1;
        batches[batches.length - 1].owner = event.prevOwner;
        batches.push({fromBlock: event.blockNumber, toBlock: undefined, owner: undefined});
    }
    batches[batches.length - 1].toBlock = toBlock;
    batches[batches.length - 1].owner = events[events.length - 1].currOwner;

    let index = 0;
    for (const batch of batches) {
        for (const abi of CONVERSION_EVENT_LEGACY.slice(index)) {
            const converter = new web3.eth.Contract([abi], batch.owner);
            const events = await getPastEvents(converter, abi.name, batch.fromBlock, batch.toBlock);
            if (events.length > 0) {
                for (const event of events) {
                    result.push({
                        fromToken    : event.returnValues.fromToken,
                        toToken      : event.returnValues.toToken,
                        trader       : event.returnValues.trader,
                        inputAmount  : await getTokenAmount(web3, decimals, event.returnValues.fromToken, event.returnValues.inputAmount),
                        outputAmount : await getTokenAmount(web3, decimals, event.returnValues.toToken  , event.returnValues.outputAmount),
                        conversionFee: await getTokenAmount(web3, decimals, event.returnValues.toToken  , event.returnValues.conversionFee),
                        blockNumber  : event.blockNumber
                    });
                }
                index = CONVERSION_EVENT_LEGACY.indexOf(abi);
                break;
            }
        }
    }

    return result;
}
