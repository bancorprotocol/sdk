import { JsonRpc } from 'eosjs';
import fetch from 'node-fetch';
import * as utils from '../../utils';
import { Token, Converter, ConversionEvent } from '../../types';
import legacyConverters from './legacy_converters';

const anchorToken:Token = {
    blockchainType: 'eos',
    blockchainId: 'bntbntbntbnt',
    symbol: 'BNT'
};

export class EOS {
    jsonRpc: JsonRpc;

    static async create(nodeEndpoint: string): Promise<EOS> {
        const eos = new EOS();
        eos.jsonRpc = new JsonRpc(nodeEndpoint, { fetch });
        return eos;
    }

    static async destroy(eos: EOS): Promise<void> {
    }

    async refresh(): Promise<void> {
    }

    getAnchorToken(): Token {
        return getAnchorToken(); // calling global function
    }

    async getPath(from: Token, to: Token): Promise<Token[]> {
        const anchorToken = this.getAnchorToken();
        const sourcePath = await getPathToAnchor(this.jsonRpc, from, anchorToken);
        const targetPath = await getPathToAnchor(this.jsonRpc, to, anchorToken);
        return getShortestPath(sourcePath, targetPath);
    }

    async getRateByPath(path: Token[], amount): Promise<string> {
        for (let i = 0; i < path.length - 1; i += 2)
            amount = await getConversionRate(this.jsonRpc, path[i + 1], path[i], path[i + 2], amount);
        return amount;
    }

    async getConverterVersion(converter: Converter): Promise<string> {
        return '1.0';
    }

    async getConversionEvents(token: Token, fromBlock: number, toBlock: number): Promise<ConversionEvent[]> {
        throw new Error('getConversionEvents not supported on eos');
    }

    async getConversionEventsByTimestamp(token: Token, fromTimestamp: number, toTimestamp: number): Promise<ConversionEvent[]> {
        throw new Error('getConversionEventsByTimestamp not supported on eos');
    }
}

async function getConverterSettings(jsonRpc, converter: Converter) {
    let res = await jsonRpc.get_table_rows({
        json: true,
        code: converter.blockchainId,
        scope: converter.blockchainId,
        table: 'settings',
        limit: 1
    });
    return res.rows[0];
};

async function getSmartTokenStat(jsonRpc, smartToken: Token) {
    let stat = await jsonRpc.get_table_rows({
        json: true,
        code: smartToken.blockchainId,
        scope: smartToken.symbol,
        table: 'stat',
        limit: 1
    });
    return stat.rows[0];
};

async function getReserves(jsonRpc, converter: Converter) {
    let res = await jsonRpc.get_table_rows({
        json: true,
        code: converter.blockchainId,
        scope: converter.blockchainId,
        table: 'reserves',
        limit: 10
    });
    return res.rows;
};

async function getReserveBalance(jsonRpc, converter: Converter, reserveToken: Token) {
    let res = await jsonRpc.get_table_rows({
        json: true,
        code: reserveToken.blockchainId,
        scope: converter.blockchainId,
        table: 'accounts',
        limit: 1
    });
    return getBalance(res.rows[0].balance);
};

function getReserve(reserves, reserveToken: Token) {
    return reserves.filter(reserve => {
        return reserve.contract == reserveToken.blockchainId &&
               getSymbol(reserve.currency) == reserveToken.symbol;
    })[0];
}

export const getAnchorToken = (): Token => {
    return anchorToken;
};

function getBalance(asset) {
    return asset.split(' ')[0];
}

function getSymbol(asset) {
    return asset.split(' ')[1];
}

function getDecimals(amount) {
    return amount.split('.')[1].length;
}

async function getConversionRate(jsonRpc: JsonRpc, smartToken: Token, sourceToken: Token, targetToken: Token, amount: string) {
    let smartTokenStat = await getSmartTokenStat(jsonRpc, smartToken);
    let converterBlockchainId = await smartTokenStat.issuer;
    let converter: Converter = {
        blockchainType: 'eos',
        blockchainId: converterBlockchainId,
        symbol: smartToken.symbol
    };

    let conversionSettings = await getConverterSettings(jsonRpc, converter);
    let conversionFee = conversionSettings.fee;
    let reserves = await getReserves(jsonRpc, converter);
    let magnitude = 1;
    let targetDecimals = 4;
    let returnAmount;

    // sale
    if (utils.isTokenEqual(sourceToken, smartToken)) {
        let supply = getBalance(smartTokenStat.supply);
        let reserveBalance = await getReserveBalance(jsonRpc, converter, targetToken);
        let reserveRatio = getReserve(reserves, targetToken).ratio;
        targetDecimals = getDecimals(reserveBalance);
        returnAmount = utils.calculateSaleReturn(supply, reserveBalance, reserveRatio, amount);
    }
    // purchase
    else if (utils.isTokenEqual(targetToken, smartToken)) {
        let supply = getBalance(smartTokenStat.supply);
        let reserveBalance = await getReserveBalance(jsonRpc, converter, sourceToken);
        let reserveRatio = getReserve(reserves, sourceToken).ratio;
        targetDecimals = getDecimals(supply);
        returnAmount = utils.calculatePurchaseReturn(supply, reserveBalance, reserveRatio, amount);
    }
    else {
        // cross convert
        let sourceReserveBalance = await getReserveBalance(jsonRpc, converter, sourceToken);
        let sourceReserveRatio = getReserve(reserves, sourceToken).ratio;
        let targetReserveBalance = await getReserveBalance(jsonRpc, converter, targetToken);
        let targetReserveRatio = getReserve(reserves, targetToken).ratio;
        targetDecimals = getDecimals(targetReserveBalance);
        returnAmount = utils.calculateCrossReserveReturn(sourceReserveBalance, sourceReserveRatio, targetReserveBalance, targetReserveRatio, amount);
        magnitude = 2;
    }

    returnAmount = utils.getFinalAmount(returnAmount, conversionFee, magnitude);
    return utils.toDecimalPlaces(returnAmount, targetDecimals);
}

async function getTokenSmartTokens(token: Token) {
    let smartTokens: Token[] = [];

    // search in legacy converters
    for (let converterAccount in legacyConverters) {
        let converter = legacyConverters[converterAccount];

        // check if the token is the converter smart token
        if (converter.smartToken[token.blockchainId] == token.symbol)
            smartTokens.push(token);

        // check if the token is one of the converter's reserve tokens
        for (let reserveAccount in converter.reserves) {
            if (reserveAccount == token.blockchainId && converter.reserves[reserveAccount] == token.symbol) {
                let smartTokenAccount = Object.keys(converter.smartToken)[0];
                smartTokens.push({
                    blockchainType: 'eos',
                    blockchainId: smartTokenAccount,
                    symbol: converter.smartToken[smartTokenAccount]
                });
            }
        }
    }

    return smartTokens;
}

async function getPathToAnchor(jsonRpc: JsonRpc, token: Token, anchorToken: Token) {
    if (utils.isTokenEqual(token, anchorToken))
        return [token];

    // hardcoded path for legacy converters
    const smartTokens = await getTokenSmartTokens(token);
    if (smartTokens.length == 0)
        return [];

    return [token, smartTokens[0], anchorToken];
}

function getShortestPath(sourcePath, targetPath) {
    if (sourcePath.length > 0 && targetPath.length > 0) {
        let i = sourcePath.length - 1;
        let j = targetPath.length - 1;
        while (i >= 0 && j >= 0 && utils.isTokenEqual(sourcePath[i], targetPath[j])) {
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
                if (utils.isTokenEqual(path[p], path[q]))
                    p = q;
            }
            path[length++] = path[p];
        }

        return path.slice(0, length);
    }

    return [];
}
