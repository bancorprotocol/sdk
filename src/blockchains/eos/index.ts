import { JsonRpc } from 'eosjs';
import fetch from 'node-fetch';
import { converterBlockchainIds } from './converter_blockchain_ids';
import fs from 'fs';
import * as formulas from './formulas';
import { Token, Converter } from '../../path_generation';
import * as paths from './paths';

interface Reserve {
    contract: string;
    currency: string;
    ratio: number;
}

export class EOS {
    jsonRpc: JsonRpc;

    constructor(nodeAddress: string) {
        this.jsonRpc = new JsonRpc(nodeAddress, { fetch });
    }

    close() {
    }

    getAnchorToken() {
        return getAnchorToken(); // calling global function
    }

    async getConversionPath(from: Token, to: Token) {
        const anchorToken = this.getAnchorToken();
        const sourcePath = await getPathToAnchor(this.jsonRpc, from, anchorToken);
        const targetPath = await getPathToAnchor(this.jsonRpc, to, anchorToken);
        return getShortestPath(sourcePath, targetPath);
    }

    async getRateByPath(path, amount) {
        for (let i = 0; i < path.length - 1; i += 2)
            amount = await getConversionRate(this.jsonRpc, {...path[i + 1]}, path[i], path[i + 2], amount);
        return amount;
    }

    async buildPathsFile() {
        const tokens = {};
        const smartTokens = {};
        await Promise.all(converterBlockchainIds.map(async converterBlockchainId => {
            const smartToken = await getSmartToken(this.jsonRpc, converterBlockchainId);
            const smartTokenContract = smartToken.rows[0].smart_contract;
            const smartTokenName = getSymbol(smartToken.rows[0].smart_currency);
            const reservesObject = await getReservesFromCode(this.jsonRpc, converterBlockchainId);
            const reserves = Object.values(reservesObject.rows);
            smartTokens[smartTokenContract] = { [smartTokenName]: { [smartTokenName]: converterBlockchainId } };
            reserves.map((reserveObj: Reserve) => {
                const reserveSymbol = getSymbol(reserveObj.currency);
                const existingRecord = tokens[reserveObj.contract];
                if (existingRecord)
                    existingRecord[reserveSymbol][smartTokenName] = converterBlockchainId;

                tokens[reserveObj.contract] = existingRecord ? existingRecord : { [reserveSymbol]: { [smartTokenName]: converterBlockchainId } };
            });
        }));
        fs.writeFileSync('./src/blockchains/eos/paths.ts',
            `export const anchorTokenId = '${paths.anchorTokenId}';\n` +
            `export const anchorTokenSymbol = '${paths.anchorTokenSymbol}';\n` +
            `export const registry = ${JSON.stringify(paths.registry, null, 4)}`,
            { encoding: "utf8" }
        );
    }
}

export const getReservesFromCode = async (jsonRpc, code, symbol?) => {
    return await jsonRpc.jsonRpc.get_table_rows({
        json: true,
        code: code,
        scope: symbol ? symbol : code,
        table: 'reserves',
        limit: 10
    });
};

export const getConverterSettings = async (jsonRpc, code) => {
    return await jsonRpc.get_table_rows({
        json: true,
        code: code,
        scope: code,
        table: 'settings',
        limit: 10
    });
};

export const getSmartToken = async (jsonRpc, code) => {
    return await jsonRpc.get_table_rows({
        json: true,
        code: code,
        scope: code,
        table: 'settings',
        limit: 10
    });
};

export const getSmartTokenSupply = async (jsonRpc, account, code) => {
    return await jsonRpc.get_table_rows({
        json: true,
        code: account,
        scope: code,
        table: 'stat',
        limit: 10
    });
};

export const getReserveBalances = async (jsonRpc, code, scope, table = 'accounts') => {
    return await jsonRpc.get_table_rows({
        json: true,
        code: code,
        scope: scope,
        table: table,
        limit: 10
    });
};

export const getAnchorToken = (): Token => {
    return {
        blockchainType: 'eos',
        blockchainId: paths.anchorTokenId,
        symbol: paths.anchorTokenSymbol
    };
};

export const getRegistry = (): {convertibleTokens: object, smartTokens: object} => {
    return paths.registry;
};

function getBalance(string) {
    return string.split(' ')[0];
}

function getSymbol(string) {
    return string.split(' ')[1];
}

function isMultiConverter(blockchhainId) {
    return getRegistry().smartTokens[blockchhainId] && getRegistry().smartTokens[blockchhainId].isMultiConverter;
}

async function getConversionRate(jsonRpc: JsonRpc, converter: Converter, fromToken: Token, toToken: Token, amount: string) {
    const toTokenBlockchainId = toToken.blockchainId;
    const fromTokenBlockchainId = fromToken.blockchainId;
    const fromTokenSymbol = fromToken.symbol;
    const toTokenSymbol = toToken.symbol;
    const isFromTokenMultiToken = isMultiConverter(fromTokenBlockchainId);
    const isToTokenMultiToken = isMultiConverter(toTokenBlockchainId);
    const converterBlockchainId = converter.blockchainId;

    let reserveSymbol;
    if (isFromTokenMultiToken)
        reserveSymbol = fromTokenSymbol;
    if (isToTokenMultiToken)
        reserveSymbol = toTokenSymbol;

    const reserves = await getReservesFromCode(jsonRpc, converterBlockchainId, reserveSymbol);
    const reservesContacts = reserves.rows.map(res => res.contract);
    const conversionFee = (await getConverterSettings(jsonRpc, converterBlockchainId)).rows[0].fee;
    const isConversionFromSmartToken = !reservesContacts.includes(fromToken.blockchainId);
    const isConversionToSmartToken = !reservesContacts.includes(toToken.blockchainId);

    let balanceFrom;
    if (isToTokenMultiToken)
        balanceFrom = await getReserveBalances(jsonRpc, converterBlockchainId, toTokenSymbol, 'reserves');
    else
        balanceFrom = await getReserveBalances(jsonRpc, fromTokenBlockchainId, converterBlockchainId);

    let balanceTo;
    if (isFromTokenMultiToken)
        balanceTo = await getReserveBalances(jsonRpc, converterBlockchainId, fromTokenSymbol, 'reserves');
    else
        balanceTo = await getReserveBalances(jsonRpc, toTokenBlockchainId, converterBlockchainId);

    const balanceObject = {
        [fromTokenBlockchainId]: balanceFrom.rows[0].balance,
        [toTokenBlockchainId]: balanceTo.rows[0].balance
    };

    const converterReserves = {};
    reserves.rows.map((reserve: Reserve) => {
        converterReserves[reserve.contract] = {
            ratio: reserve.ratio, balance: balanceObject[reserve.contract]
        };
    });

    formulas.init();

    if (isConversionFromSmartToken) {
        const token = getRegistry().smartTokens[fromTokenBlockchainId] || getRegistry().convertibleTokens[fromTokenBlockchainId];
        const tokenSymbol = Object.keys(token[fromTokenSymbol])[0];
        const tokenSupplyObj = await getSmartTokenSupply(jsonRpc, fromTokenBlockchainId, tokenSymbol);
        const supply = getBalance(tokenSupplyObj.rows[0].supply);
        const reserveBalance = getBalance(balanceTo.rows[0].balance);
        const reserveRatio = converterReserves[toTokenBlockchainId].ratio;
        const amountWithoutFee = formulas.calculateSaleReturn(supply, reserveBalance, reserveRatio, amount);
        return formulas.getFinalAmount(amountWithoutFee, conversionFee, 1).toFixed();
    }

    else if (isConversionToSmartToken) {
        const token = getRegistry().smartTokens[toTokenBlockchainId] || getRegistry().convertibleTokens[toTokenBlockchainId];
        const tokenSymbol = Object.keys(token[toTokenSymbol])[0];
        const tokenSupplyObj = await getSmartTokenSupply(jsonRpc, toTokenBlockchainId, tokenSymbol);
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

function getConverterBlockchainId(token: Token) {
    if (getRegistry().convertibleTokens[token.blockchainId])
        return getRegistry().convertibleTokens[token.blockchainId][token.symbol];
    return getRegistry().smartTokens[token.blockchainId][token.symbol];
}

async function getPathToAnchor(jsonRpc: JsonRpc, token: Token, anchorToken: Token) {
    if (token.blockchainId == anchorToken.blockchainId && token.symbol == anchorToken.symbol)
        return [token];

    const blockchainId = getConverterBlockchainId(token);
    const symbol = isMultiConverter(token.blockchainId) ? token.symbol : null;
    const reserves = await getReservesFromCode(jsonRpc, Object.values(blockchainId)[0], symbol);

    for (const reserve of reserves.rows.filter(reserve => reserve.contract != token.blockchainId)) {
        const reserveToken: Token = { blockchainType: 'eos', blockchainId: reserve.contract, symbol: getSymbol(reserve.currency) };
        const path = await getPathToAnchor(jsonRpc, reserveToken, anchorToken);
        if (path.length > 0) {
            const smartToken: Token = { blockchainType: 'eos', blockchainId: Object.values(blockchainId)[0].toString(), symbol: Object.keys(blockchainId)[0].toString() };
            return [token, smartToken, ...path];
        }
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
