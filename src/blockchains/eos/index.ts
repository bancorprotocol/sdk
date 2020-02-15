import { JsonRpc } from 'eosjs';
import fetch from 'node-fetch';
import { converterBlockchainIds } from './converter_blockchain_ids';
import fs from 'fs';
import * as formulas from '../../utils/formulas';
import { ConversionStep, Token } from '../../path_generation';
import { Paths } from './paths';

interface Reserve {
    contract: string;
    currency: string;
    ratio: number;
}

let pathJson = Paths;
let jsonRpc;

const anchorToken : Token = {
    blockchainType: 'eos',
    blockchainId: 'bntbntbntbnt',
    symbol: 'BNT'
};

export function init(endpoint) {
    jsonRpc = new JsonRpc(endpoint, { fetch });
}

export function getAnchorToken() {
    return anchorToken;
}

export function isAnchorToken(token: Token) {
    return token.blockchainId == anchorToken.blockchainId && token.symbol == anchorToken.symbol;
}

export function getTokenBlockchainId(token: Token) {
    return { [token.symbol]: token.blockchainId };
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

function isFromSmartToken(step: ConversionStep, reserves: string[]) {
    return !reserves.includes(step.fromToken.blockchainId);
}

function isToSmartToken(step: ConversionStep, reserves: string[]) {
    return !reserves.includes(step.toToken.blockchainId);
}

export async function getConversionSteps(path: Token[]) {
    if (path.length == 1 && isMultiConverter(path[0]))
        return [{converter: {...path[0]}, fromToken: path[0], toToken: path[0]}] as ConversionStep[];
    const steps: ConversionStep[] = [];
    for (let i = 0; i < path.length - 1; i += 2)
        steps.push({converter: {...path[i + 1]}, fromToken: path[i], toToken: path[i + 2]});
    return steps;
}

export async function getConversionRate(step: ConversionStep, amount: string) {
    const toTokenBlockchainId = step.toToken.blockchainId;
    const fromTokenBlockchainId = step.fromToken.blockchainId;
    const fromTokenSymbol = step.fromToken.symbol;
    const toTokenSymbol = step.toToken.symbol;
    const isFromTokenMultiToken = isMultiConverter(fromTokenBlockchainId);
    const isToTokenMultiToken = isMultiConverter(toTokenBlockchainId);
    const converterBlockchainId = step.converter.blockchainId;
    let reserveSymbol;
    if (isFromTokenMultiToken)
        reserveSymbol = fromTokenSymbol;
    if (isToTokenMultiToken)
        reserveSymbol = toTokenSymbol;

    const reserves = await getReservesFromCode(converterBlockchainId, reserveSymbol);
    const reservesContacts = reserves.rows.map(res => res.contract);
    const conversionFee = await getConverterFeeFromSettings(converterBlockchainId);
    const isConversionFromSmartToken = isFromSmartToken(step, reservesContacts);
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

    const isConversionToSmartToken = isToSmartToken(step, reservesContacts);
    const balanceObject = { [fromTokenBlockchainId]: balanceFrom.rows[0].balance, [toTokenBlockchainId]: balanceTo.rows[0].balance };
    const converterReserves = {};
    reserves.rows.map((reserve: Reserve) => {
        converterReserves[reserve.contract] = {
            ratio: reserve.ratio, balance: balanceObject[reserve.contract]
        };
    });

    formulas.init();

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

async function getReserveTokens(converterBlockchainId, symbol, isMulti) {
    const reserves = await getReservesFromCode(converterBlockchainId, isMulti ? symbol : null);
    return reserves.rows.map(reserve => ({
        blockchainType: 'eos',
        blockchainId: reserve.contract,
        symbol: getSymbol(reserve.currency)
    }));
}

export async function getConversionPath(from: Token, to: Token) {
    const sourcePath = await getPathToAnchor(from);
    const targetPath = await getPathToAnchor(to);
    return getShortestPath(sourcePath, targetPath);
}

async function getPathToAnchor(token: Token) {
    if (isAnchorToken(token))
        return [getTokenBlockchainId(token)];

    const blockchainId = await getConverterBlockchainId(token);
    const reserveTokens = await getReserveTokens(Object.values(blockchainId)[0], token.symbol, isMultiConverter(token.blockchainId));
    for (const reserveToken of reserveTokens.filter(reserveToken => reserveToken.blockchainId != token.blockchainId)) {
        const path = await getPathToAnchor(reserveToken);
        if (path.length > 0)
            return [getTokenBlockchainId(token), blockchainId, ...path];
    }

    return [];
}

function getShortestPath(sourcePath, targetPath) {
    if (sourcePath.length > 0 && targetPath.length > 0) {
        let i = sourcePath.length - 1;
        let j = targetPath.length - 1;
        while (i >= 0 && j >= 0 && JSON.stringify(sourcePath[i]) == JSON.stringify(targetPath[j])) {
            i--;
            j--;
        }

        const path = [];
        for (let m = 0; m <= i + 1; m++)
            path.push(sourcePath[m]);
        for (let n = j; n >= 0; n--)
            path.push(targetPath[n]);

        let length = 0;
        for (let p = 0; p < path.length; p += 1) {
            for (let q = p + 2; q < path.length - p % 2; q += 2) {
                if (path[p] == path[q])
                    p = q;
            }
            path[length++] = path[p];
        }

        return path.slice(0, length);
    }

    return [];
}
