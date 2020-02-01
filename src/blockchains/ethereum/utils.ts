import Web3 from 'web3';
import Decimal from 'decimal.js';

export function fromWei(number, decimalDigits = 18) {
    return new Decimal(`${number}e-${decimalDigits}`).toFixed();
}

export function toWei(number, decimalDigits = 18) {
    return new Decimal(`${number}e+${decimalDigits}`).toFixed();
}

export async function timestampToBlockNumber(nodeAddress, timestamp) {
    const web3 = new Web3(nodeAddress);
    const lo = await web3.eth.getBlock(1);
    const hi = await web3.eth.getBlock("latest");
    const block = await searchBlock(web3, lo, hi, timestamp);
    if (web3.currentProvider.constructor.name == "WebsocketProvider")
        web3.currentProvider.connection.close();
    return block.number;
}

async function searchBlock(web3, lo, hi, timestamp) {
    while (true) {
        const midNumber = Math.round((timestamp - lo.timestamp) / (hi.timestamp - lo.timestamp) * (hi.number - lo.number) + lo.number);
        if (midNumber == lo.number)
            return await searchBetterBlock(web3, lo, timestamp, +1);
        if (midNumber == hi.number)
            return await searchBetterBlock(web3, hi, timestamp, -1);
        const mid = await web3.eth.getBlock(midNumber);
        if (mid.timestamp < timestamp)
            lo = mid;
        else if (mid.timestamp > timestamp)
            hi = mid;
        else
            return mid;
    }
}

async function searchBetterBlock(web3, block, timestamp, sign) {
    while (block.timestamp * sign < timestamp * sign) {
        const nextBlock = await web3.eth.getBlock(block.number + sign);
        if (nextBlock.timestamp * sign >= timestamp * sign)
            return (nextBlock.timestamp - timestamp) * sign < (timestamp - block.timestamp) * sign ? nextBlock : block;
        block = nextBlock;
    }
    return block;
}
