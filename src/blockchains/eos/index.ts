import { JsonRpc } from 'eosjs';
import fetch from 'node-fetch';
import { converterBlockchainIds } from './converter_blockchain_ids';
import fs from 'fs';
import * as utils from '../../utils';
import { Token, Converter } from '../../path_generation';
import * as registry from './registry';

interface Reserve {
    contract: string;
    currency: string;
    ratio: number;
}

export class EOS {
    jsonRpc: JsonRpc;

    constructor(nodeEndpoint: string) {
        this.jsonRpc = new JsonRpc(nodeEndpoint, { fetch });
    }

    close() {
    }

    async init() {
    }

    getAnchorToken() {
        return getAnchorToken(); // calling global function
    }

    async getRateByPath(path: Token[], amount: string): Promise<string> {
        for (let i = 0; i < path.length - 1; i += 2)
            amount = await getConversionRate(this.jsonRpc, {...path[i + 1]}, path[i], path[i + 2], amount);
        return amount;
    }

    async getConversionPath(from: Token, to: Token): Promise<Token[]> {
        const anchorToken = this.getAnchorToken();
        const sourcePath = await getPathToAnchor(this.jsonRpc, from, anchorToken);
        const targetPath = await getPathToAnchor(this.jsonRpc, to, anchorToken);
        return getShortestPath(sourcePath, targetPath);
    }

    async getConverterVersion(converter: Converter): Promise<string> {
        return '1.0';
    }

    async getConversionEvents(token: Token, fromBlock: number, toBlock: number): Promise<object[]> {
        throw new Error('getConversionEvents not supported on EOS');
    }

    async getConversionEventsByTimestamp(token: Token, fromTimestamp: number, toTimestamp: number): Promise<object[]> {
        throw new Error('getConversionEventsByTimestamp not supported on EOS');
    }

    async buildPathsFile(): Promise<void> {
        const convertibleTokens = {};
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
                if (convertibleTokens[reserveObj.contract])
                    convertibleTokens[reserveObj.contract][reserveSymbol][smartTokenName] = converterBlockchainId;
                else
                    convertibleTokens[reserveObj.contract] = { [reserveSymbol]: { [smartTokenName]: converterBlockchainId } };
            });
        }));
        fs.writeFileSync(
            './src/blockchains/eos/registry.ts',
            `export const anchorTokenId = '${registry.anchorTokenId}';\n\n` +
            `export const anchorTokenSymbol = '${registry.anchorTokenSymbol}';\n\n` +
            `export const convertibleTokens = ${JSON.stringify(convertibleTokens, null, 4)};\n\n` +
            `export const smartTokens = ${JSON.stringify(smartTokens, null, 4)};\n`,
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
        blockchainId: registry.anchorTokenId,
        symbol: registry.anchorTokenSymbol
    };
};

export const getConvertibleTokens = (blockchainId): any => {
    return registry.convertibleTokens[blockchainId];
};

export const getSmartTokens = (blockchainId): any => {
    return registry.smartTokens[blockchainId];
};

function getBalance(string) {
    return string.split(' ')[0];
}

function getSymbol(string) {
    return string.split(' ')[1];
}

function isMultiConverter(blockchhainId) {
    return getSmartTokens(blockchhainId) && getSmartTokens(blockchhainId).isMultiConverter;
}

async function getConversionRate(jsonRpc: JsonRpc, converter: Converter, fromToken: Token, toToken: Token, amount: string) {
    const isFromTokenMultiToken = isMultiConverter(fromToken.blockchainId);
    const isToTokenMultiToken = isMultiConverter(toToken.blockchainId);

    let reserveSymbol;
    if (isFromTokenMultiToken)
        reserveSymbol = fromToken.symbol;
    if (isToTokenMultiToken)
        reserveSymbol = toToken.symbol;

    const reserves = await getReservesFromCode(jsonRpc, converter.blockchainId, reserveSymbol);
    const reservesContacts = reserves.rows.map(res => res.contract);
    const conversionFee = (await getConverterSettings(jsonRpc, converter.blockchainId)).rows[0].fee;
    const isConversionFromSmartToken = !reservesContacts.includes(fromToken.blockchainId);
    const isConversionToSmartToken = !reservesContacts.includes(toToken.blockchainId);

    let balanceFrom;
    if (isToTokenMultiToken)
        balanceFrom = await getReserveBalances(jsonRpc, converter.blockchainId, toToken.symbol, 'reserves');
    else
        balanceFrom = await getReserveBalances(jsonRpc, fromToken.blockchainId, converter.blockchainId);

    let balanceTo;
    if (isFromTokenMultiToken)
        balanceTo = await getReserveBalances(jsonRpc, converter.blockchainId, fromToken.symbol, 'reserves');
    else
        balanceTo = await getReserveBalances(jsonRpc, toToken.blockchainId, converter.blockchainId);

    const balanceObject = {
        [fromToken.blockchainId]: balanceFrom.rows[0].balance,
        [toToken.blockchainId]: balanceTo.rows[0].balance
    };

    const converterReserves = {};
    reserves.rows.map((reserve: Reserve) => {
        converterReserves[reserve.contract] = {
            ratio: reserve.ratio, balance: balanceObject[reserve.contract]
        };
    });

    if (isConversionFromSmartToken) {
        const token = getSmartTokens(fromToken.blockchainId) || getConvertibleTokens(fromToken.blockchainId);
        const tokenSymbol = Object.keys(token[fromToken.symbol])[0];
        const tokenSupplyObj = await getSmartTokenSupply(jsonRpc, fromToken.blockchainId, tokenSymbol);
        const supply = getBalance(tokenSupplyObj.rows[0].supply);
        const reserveBalance = getBalance(balanceTo.rows[0].balance);
        const reserveRatio = converterReserves[toToken.blockchainId].ratio;
        const amountWithoutFee = utils.calculateSaleReturn(supply, reserveBalance, reserveRatio, amount);
        return utils.getFinalAmount(amountWithoutFee, conversionFee, 1).toFixed();
    }

    else if (isConversionToSmartToken) {
        const token = getSmartTokens(toToken.blockchainId) || getConvertibleTokens(toToken.blockchainId);
        const tokenSymbol = Object.keys(token[toToken.symbol])[0];
        const tokenSupplyObj = await getSmartTokenSupply(jsonRpc, toToken.blockchainId, tokenSymbol);
        const supply = getBalance(tokenSupplyObj.rows[0].supply);
        const reserveBalance = getBalance(balanceFrom.rows[0].balance);
        const reserveRatio = converterReserves[fromToken.blockchainId].ratio;
        const amountWithoutFee = utils.calculatePurchaseReturn(supply, reserveBalance, reserveRatio, amount);
        return utils.getFinalAmount(amountWithoutFee, conversionFee, 1).toFixed();
    }

    else {
        const fromReserveBalance = getBalance(balanceFrom.rows[0].balance);
        const fromReserveRatio = converterReserves[fromToken.blockchainId].ratio;
        const toReserveBalance = getBalance(balanceTo.rows[0].balance);
        const toReserveRatio = converterReserves[toToken.blockchainId].ratio;
        const amountWithoutFee = utils.calculateCrossReserveReturn(fromReserveBalance, fromReserveRatio, toReserveBalance, toReserveRatio, amount);
        return utils.getFinalAmount(amountWithoutFee, conversionFee, 2).toFixed();
    }
}

function getConverterBlockchainId(token: Token) {
    if (getConvertibleTokens(token.blockchainId))
        return getConvertibleTokens(token.blockchainId)[token.symbol];
    return getSmartTokens(token.blockchainId)[token.symbol];
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
