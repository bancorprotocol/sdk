import Web3 from 'web3';
import Decimal from 'decimal.js';

export function fromWei(number, decimalDigits = 18) {
    return new Decimal(`${number}e-${decimalDigits}`).toFixed();
}

export function toWei(number, decimalDigits = 18) {
    return new Decimal(`${number}e+${decimalDigits}`).toFixed();
}

export async function timestampToBlockNumber(web3, timestamp) {
    const lo = await getBlock(web3, 1);
    const hi = await getBlock(web3, "latest");
    const block = await searchBlock(web3, lo, hi, timestamp);
    return block.number;
}

async function searchBlock(web3, lo, hi, timestamp) {
    while (true) {
        const midNumber = Math.round((timestamp - lo.timestamp) / (hi.timestamp - lo.timestamp) * (hi.number - lo.number) + lo.number);
        if (midNumber == lo.number)
            return await searchBetterBlock(web3, lo, timestamp, +1);
        if (midNumber == hi.number)
            return await searchBetterBlock(web3, hi, timestamp, -1);
        const mid = await getBlock(web3, midNumber);
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
        const nextBlock = await getBlock(web3, block.number + sign);
        if (nextBlock.timestamp * sign >= timestamp * sign)
            return (nextBlock.timestamp - timestamp) * sign < (timestamp - block.timestamp) * sign ? nextBlock : block;
        block = nextBlock;
    }
    return block;
}

async function getBlock(web3, number) {
    if (blocks[number])
        return blocks[number];
    const block = await web3.eth.getBlock(number);
    return blocks[block.number] = {number: block.number, timestamp: block.timestamp};
}

const blocks = {};
