import { JsonRpc } from 'eosjs';
import fetch from 'node-fetch';
import { converterBlockchainIds } from './converter_blockchain_ids';
import fs from 'fs';
import Decimal from 'decimal.js';
import * as formulas from '../../utils/formulas';
import { ConversionPathStep, Token } from '../../path_generation';
import { Paths } from './paths';

interface Reserve {
    contract: string;
    currency: string;
    ratio: number;
}

let pathJson = Paths;
let jsonRpc;

export const anchorToken: Token = {
    blockchainType: 'eos',
    blockchainId: 'bntbntbntbnt',
    symbol: 'BNT'
};

export function init(endpoint) {
    jsonRpc = new JsonRpc(endpoint, { fetch });
}

export function isAnchorToken(token: Token) {
    return token.blockchainId == anchorToken.blockchainId && token.symbol == anchorToken.symbol;
}

export function getTokenBlockchainId(token: Token) {
    return { [token.symbol]: token.blockchainId.toLowerCase() };
}

export function getEosjsRpc() {
    return jsonRpc;
}

export const getReservesFromCode = async (code, symbol?) => {
    const scope = symbol ? symbol : code;
    const rpc = getEosjsRpc();

    return await rpc.get_table_rows({
        json: true,
        code: code,
        scope: scope,
        table: 'reserves',
        limit: 10
    });
};

export const getConverterSettings = async code => {
    const rpc = getEosjsRpc();

    return await rpc.get_table_rows({
        json: true,
        code: code,
        scope: code,
        table: 'settings',
        limit: 10
    });
};

export const getConverterFeeFromSettings = async code => {
    const settings = await getConverterSettings(code);
    return settings.rows[0].fee;
};

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

export const getSmartTokenSupply = async (account, code) => {
    const rpc = getEosjsRpc();

    return await rpc.get_table_rows({
        json: true,
        code: account,
        scope: code,
        table: 'stat',
        limit: 10
    });
};

export const isMultiConverter = blockchhainId => {
    return pathJson.smartTokens[blockchhainId] && pathJson.smartTokens[blockchhainId].isMultiConverter;
};

export const getReserveBalances = async (code, scope, table = 'accounts') => {
    const rpc = getEosjsRpc();

    return await rpc.get_table_rows({
        json: true,
        code: code,
        scope: scope,
        table: table,
        limit: 10
    });
};

export const getReserveTokenSymbol = (reserve: Reserve) => {
    return getSymbol(reserve.currency);
};

export function getSymbol(string) {
    return string.split(' ')[1];
}

export function getBalance(string) {
    return string.split(' ')[0];
}

export async function buildPathsFile() {
    const tokens = {};
    const smartTokens = {};
    await Promise.all(converterBlockchainIds.map(async converterBlockchainId => {
        const smartToken = await getSmartToken(converterBlockchainId);
        const smartTokenContract = smartToken.rows[0].smart_contract;
        const smartTokenName = getSymbol(smartToken.rows[0].smart_currency);
        const reservesObject = await getReservesFromCode(converterBlockchainId);
        const reserves = Object.values(reservesObject.rows);
        smartTokens[smartTokenContract] = { [smartTokenName]: { [smartTokenName]: converterBlockchainId } };
        reserves.map((reserveObj: Reserve) => {
            const reserveSymbol = getReserveTokenSymbol(reserveObj);
            const existingRecord = tokens[reserveObj.contract];
            if (existingRecord)
                existingRecord[reserveSymbol][smartTokenName] = converterBlockchainId;

            tokens[reserveObj.contract] = existingRecord ? existingRecord : { [reserveSymbol]: { [smartTokenName]: converterBlockchainId } };
        });
    }));
    await fs.writeFile('./src/blockchains/eos/paths.ts',
        `export const Paths = \n{convertibleTokens:${JSON.stringify(tokens)}, \n smartTokens: ${JSON.stringify(smartTokens)}}`,
        'utf8',
        // eslint-disable-next-line no-console
        () => console.log('Done making paths json'));
}

function isFromSmartToken(pair: ConversionPathStep, reserves: string[]) {
    return (!reserves.includes(Object.values(pair.fromToken)[0]));
}

function isToSmartToken(pair: ConversionPathStep, reserves: string[]) {
    return (!reserves.includes(Object.values(pair.toToken)[0]));
}

export async function getPathStepRate(pair: ConversionPathStep, amount: string) {
    const toTokenBlockchainId = Object.values(pair.toToken)[0];
    const fromTokenBlockchainId = Object.values(pair.fromToken)[0];
    const fromTokenSymbol = Object.keys(pair.fromToken)[0];
    const toTokenSymbol = Object.keys(pair.toToken)[0];
    const isFromTokenMultiToken = isMultiConverter(fromTokenBlockchainId);
    const isToTokenMultiToken = isMultiConverter(toTokenBlockchainId);
    const converterBlockchainId = Object.values(pair.converterBlockchainId)[0];
    let reserveSymbol;
    if (isFromTokenMultiToken)
        reserveSymbol = fromTokenSymbol;
    if (isToTokenMultiToken)
        reserveSymbol = toTokenSymbol;

    const reserves = await getReservesFromCode(converterBlockchainId, reserveSymbol);
    const reservesContacts = reserves.rows.map(res => res.contract);
    const conversionFee = await getConverterFeeFromSettings(converterBlockchainId);
    const isConversionFromSmartToken = isFromSmartToken(pair, reservesContacts);
    let balanceFrom;
    if (isToTokenMultiToken)
        balanceFrom = await getReserveBalances(converterBlockchainId, toTokenSymbol, 'reserves');
    else
        balanceFrom = await getReserveBalances(fromTokenBlockchainId, converterBlockchainId);
    let balanceTo;
    if (isFromTokenMultiToken)
        balanceTo = await getReserveBalances(converterBlockchainId, fromTokenSymbol, 'reserves');
    else
        balanceTo = await getReserveBalances(toTokenBlockchainId, converterBlockchainId);

    const isConversionToSmartToken = isToSmartToken(pair, reservesContacts);
    const balanceObject = { [fromTokenBlockchainId]: balanceFrom.rows[0].balance, [toTokenBlockchainId]: balanceTo.rows[0].balance };
    const converterReserves = {};
    reserves.rows.map((reserve: Reserve) => {
        converterReserves[reserve.contract] = {
            ratio: reserve.ratio, balance: balanceObject[reserve.contract]
        };
    });

    Decimal.set({precision: 100, rounding: Decimal.ROUND_DOWN});

    if (isConversionFromSmartToken) {
        const token = pathJson.smartTokens[fromTokenBlockchainId] || pathJson.convertibleTokens[fromTokenBlockchainId];
        const tokenSymbol = Object.keys(token[fromTokenSymbol])[0];
        const tokenSupplyObj = await getSmartTokenSupply(fromTokenBlockchainId, tokenSymbol);
        const supply = getBalance(tokenSupplyObj.rows[0].supply);
        const reserveBalance = getBalance(balanceTo.rows[0].balance);
        const reserveRatio = converterReserves[toTokenBlockchainId].ratio;
        const amountWithoutFee = formulas.calculateSaleReturn(supply, reserveBalance, reserveRatio, amount);
        return formulas.getFinalAmount(amountWithoutFee, conversionFee, 1).toFixed();
    }

    else if (isConversionToSmartToken) {
        const token = pathJson.smartTokens[toTokenBlockchainId] || pathJson.convertibleTokens[toTokenBlockchainId];
        const tokenSymbol = Object.keys(token[toTokenSymbol])[0];
        const tokenSupplyObj = await getSmartTokenSupply(toTokenBlockchainId, tokenSymbol);
        const supply = getBalance(tokenSupplyObj.rows[0].supply);
        const reserveBalance = getBalance(balanceFrom.rows[0].balance);
        const reserveRatio = converterReserves[fromTokenBlockchainId].ratio;
        const amountWithoutFee = formulas.calculatePurchaseReturn(supply, reserveBalance, reserveRatio, amount);
        return formulas.getFinalAmount(amountWithoutFee, conversionFee, 1).toFixed();
    }
    else {
        const fromReserveBalance = getBalance(balanceFrom.rows[0].balance);
        const fromReserveRatio = converterReserves[fromTokenBlockchainId].ratio;
        const toReserveBalance = getBalance(balanceTo.rows[0].balance);
        const toReserveRatio = converterReserves[toTokenBlockchainId].ratio;
        const amountWithoutFee = formulas.calculateCrossReserveReturn(fromReserveBalance, fromReserveRatio, toReserveBalance, toReserveRatio, amount);
        return formulas.getFinalAmount(amountWithoutFee, conversionFee, 2).toFixed();
    }
}

export async function getConverterBlockchainId(token: Token) {
    if (pathJson.convertibleTokens[token.blockchainId])
        return pathJson.convertibleTokens[token.blockchainId][token.symbol];
    return pathJson.smartTokens[token.blockchainId][token.symbol];
}

export async function getReserveTokens(converterBlockchainId, symbol, isMulti) {
    const reserves = await getReservesFromCode(converterBlockchainId, isMulti ? symbol : null);
    return reserves.rows.map(reserve => ({
        blockchainType: 'eos',
        blockchainId: reserve.contract,
        symbol: getSymbol(reserve.currency)
    }));
}
