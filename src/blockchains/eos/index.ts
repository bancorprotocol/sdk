import { JsonRpc } from 'eosjs';
import fetch from 'node-fetch';
import { converterBlockchainIds } from './converter_blockchain_ids';
import fs from 'fs';
import { shortConvert, sellSmartToken, buySmartToken, returnWithFee } from '../../utils/formulas';
import { ConversionPathStep, Token } from '../../path_generation';
import { Paths } from './paths';

interface Reserve {
    contract: string;
    currency: string;
    ratio: number;
}

let pathJson;
let jsonRpc;

export function initEOS(endpoint) {
    pathJson = Paths;
    jsonRpc = new JsonRpc(endpoint, { fetch });
}

export function getEosjsRpc() {
    return jsonRpc;
}

export async function getReservesFromCode(code) {
    const rpc = getEosjsRpc();

    return await rpc.get_table_rows({
        json: true,
        code: code,
        scope: code,
        table: 'reserves',
        limit: 10
    });
}

export async function getConverterSettings(code) {
    const rpc = getEosjsRpc();

    return await rpc.get_table_rows({
        json: true,
        code: code,
        scope: code,
        table: 'settings',
        limit: 10
    });
}

async function getConverterFeeFromSettings(code) {
    const settings = await getConverterSettings(code);
    return settings.rows[0].fee;
}

export async function getSmartToken(code) {
    const rpc = getEosjsRpc();

    return await rpc.get_table_rows({
        json: true,
        code: code,
        scope: code,
        table: 'settings',
        limit: 10
    });
}

export async function getSmartTokenSupply(account, code) {
    const rpc = getEosjsRpc();

    return await rpc.get_table_rows({
        json: true,
        code: account,
        scope: code,
        table: 'stat',
        limit: 10
    });
}

export async function getReserveBalances(code, scope) {
    const rpc = getEosjsRpc();

    return await rpc.get_table_rows({
        json: true,
        code: code,
        scope: scope,
        table: 'accounts',
        limit: 10
    });
}

export function getReserveTokenSymbol(reserve: Reserve) {
    return getSymbol(reserve.currency);
}

export function getSymbol(string) {
    return string.split(' ')[1];
}

export function getBalance(string) {
    return string.split(' ')[0];
}

export async function buildPathsFile() {
    if (Paths) return;
    const tokens = {};
    await Promise.all(converterBlockchainIds.map(async converterBlockchainId => {
        const smartToken = await getSmartToken(converterBlockchainId);
        const smartTokenContract = smartToken.rows[0].smart_contract;
        const smartTokenName = getSymbol(smartToken.rows[0].smart_currency);
        const reservesObject = await getReservesFromCode(converterBlockchainId);
        const reserves = Object.values(reservesObject.rows);
        tokens[smartTokenContract] = { [smartTokenName]: [converterBlockchainId]};
        reserves.map((reserveObj: Reserve) => {
            const reserveSymbol = getReserveTokenSymbol(reserveObj);
            const existingRecord = tokens[reserveObj.contract];
            if (existingRecord)
                existingRecord[reserveSymbol].push(converterBlockchainId);

            tokens[reserveObj.contract] = existingRecord ? existingRecord : { [reserveSymbol]: [converterBlockchainId]};
        });
    }));
    // eslint-disable-next-line no-console
    fs.writeFile('./src/blockchains/eos/paths.ts', `export const Paths = ${JSON.stringify(tokens)}`, 'utf8', () => console.log('Done making paths json'));
}

function isFromSmartToken(pair: ConversionPathStep, reserves: string[]) {
    return (!reserves.includes(pair.fromToken));
}

function isToSmartToken(pair: ConversionPathStep, reserves: string[]) {
    return (!reserves.includes(pair.toToken));
}

export async function getPathStepRate(pair: ConversionPathStep, amount: string) {
    const converterBlockchainId = pair.converterBlockchainId;
    const reserves = await getReservesFromCode(converterBlockchainId);
    const reservesContacts = reserves.rows.map(res => res.contract);
    const fee = await getConverterFeeFromSettings(converterBlockchainId);
    const isConversionFromSmartToken = isFromSmartToken(pair, reservesContacts);
    const balanceFrom = await getReserveBalances(pair.fromToken, pair.converterBlockchainId);
    const balanceTo = await getReserveBalances(pair.toToken, pair.converterBlockchainId);
    const isConversionToSmartToken = isToSmartToken(pair, reservesContacts);
    let amountWithoutFee = 0;
    let magnitude = 0;
    const balanceObject = { [pair.fromToken]: balanceFrom.rows[0].balance, [pair.toToken]: balanceTo.rows[0].balance };
    const converterReserves = {};
    reserves.rows.map((reserve: Reserve) => {
        converterReserves[reserve.contract] = { ratio: reserve.ratio, balance: balanceObject[reserve.contract] };
    });

    if (isConversionFromSmartToken) {
        const tokenSymbol = Object.keys(pathJson[pair.fromToken])[0];
        const tokenSupplyObj = await getSmartTokenSupply(pair.fromToken, tokenSymbol);
        const toReserveRatio = converterReserves[pair.toToken].ratio;
        const tokenSupply = getBalance(tokenSupplyObj.rows[0].supply);
        const reserveTokenBalance = getBalance(balanceTo.rows[0].balance);
        amountWithoutFee = sellSmartToken(reserveTokenBalance, toReserveRatio, amount, tokenSupply);
        magnitude = 1;
    }

    else if (isConversionToSmartToken) {
        const tokenSymbol = Object.keys(pathJson[pair.toToken])[0];
        const tokenSupplyObj = await getSmartTokenSupply(pair.toToken, tokenSymbol);
        const toReserveRatio = converterReserves[pair.fromToken].ratio;
        const tokenSupply = getBalance(tokenSupplyObj.rows[0].supply);
        const reserveTokenBalance = getBalance(balanceFrom.rows[0].balance);
        amountWithoutFee = buySmartToken(reserveTokenBalance, toReserveRatio, amount, tokenSupply);
        magnitude = 1;
    }
    else {
        amountWithoutFee = shortConvert(amount, getBalance(converterReserves[pair.toToken].balance), getBalance(converterReserves[pair.fromToken].balance));
        magnitude = 2;
    }

    if (fee == 0)
        return amountWithoutFee;

    return returnWithFee(amountWithoutFee, fee, magnitude);
}

export async function getConverterBlockchainId(token: Token) {
    return pathJson[token.blockchainId][token.symbol][0];
}

export async function getReserveBlockchainId(reserves: Token[], position) {
    const blockchainId = reserves[position].blockchainId;
    const symbol = reserves[position].symbol;
    const tok: Token = {
        blockchainType: 'eos',
        blockchainId,
        symbol
    };

    return tok;
}

export async function getReserves(converterBlockchainId) {
    const reserves = await getReservesFromCode(converterBlockchainId);
    const tokens = [];
    reserves.rows.map(reserve => {
        const symbol = getSymbol(reserve.currency);

        tokens.push({ symbol, blockchainId: reserve.contract });
    });
    return { reserves: tokens };
}

export async function getReservesCount(reserves: Token[]) {
    return reserves.length;
}
