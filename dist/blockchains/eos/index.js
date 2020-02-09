"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var eosjs_1 = require("eosjs");
var node_fetch_1 = __importDefault(require("node-fetch"));
var converter_blockchain_ids_1 = require("./converter_blockchain_ids");
var fs_1 = __importDefault(require("fs"));
var formulas_1 = require("../../utils/formulas");
var paths_1 = require("./paths");
var pathJson = paths_1.Paths;
var jsonRpc;
function initEOS(endpoint) {
    jsonRpc = new eosjs_1.JsonRpc(endpoint, { fetch: node_fetch_1.default });
}
exports.initEOS = initEOS;
function getEosjsRpc() {
    return jsonRpc;
}
exports.getEosjsRpc = getEosjsRpc;
exports.getReservesFromCode = function (code, symbol) { return __awaiter(void 0, void 0, void 0, function () {
    var scope, rpc;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                scope = symbol ? symbol : code;
                rpc = getEosjsRpc();
                return [4 /*yield*/, rpc.get_table_rows({
                        json: true,
                        code: code,
                        scope: scope,
                        table: 'reserves',
                        limit: 10
                    })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getConverterSettings = function (code) { return __awaiter(void 0, void 0, void 0, function () {
    var rpc;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                rpc = getEosjsRpc();
                return [4 /*yield*/, rpc.get_table_rows({
                        json: true,
                        code: code,
                        scope: code,
                        table: 'settings',
                        limit: 10
                    })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getConverterFeeFromSettings = function (code) { return __awaiter(void 0, void 0, void 0, function () {
    var settings;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.getConverterSettings(code)];
            case 1:
                settings = _a.sent();
                return [2 /*return*/, settings.rows[0].fee];
        }
    });
}); };
function getSmartToken(code) {
    return __awaiter(this, void 0, void 0, function () {
        var rpc;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rpc = getEosjsRpc();
                    return [4 /*yield*/, rpc.get_table_rows({
                            json: true,
                            code: code,
                            scope: code,
                            table: 'settings',
                            limit: 10
                        })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.getSmartToken = getSmartToken;
exports.getSmartTokenSupply = function (account, code) { return __awaiter(void 0, void 0, void 0, function () {
    var rpc;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                rpc = getEosjsRpc();
                return [4 /*yield*/, rpc.get_table_rows({
                        json: true,
                        code: account,
                        scope: code,
                        table: 'stat',
                        limit: 10
                    })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.isMultiConverter = function (blockchhainId) {
    return pathJson.smartTokens[blockchhainId] && pathJson.smartTokens[blockchhainId].isMultiConverter;
};
exports.getReserveBalances = function (code, scope, table) {
    if (table === void 0) { table = 'accounts'; }
    return __awaiter(void 0, void 0, void 0, function () {
        var rpc;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rpc = getEosjsRpc();
                    return [4 /*yield*/, rpc.get_table_rows({
                            json: true,
                            code: code,
                            scope: scope,
                            table: table,
                            limit: 10
                        })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
exports.getReserveTokenSymbol = function (reserve) {
    return getSymbol(reserve.currency);
};
function getSymbol(string) {
    return string.split(' ')[1];
}
exports.getSymbol = getSymbol;
function getBalance(string) {
    return string.split(' ')[0];
}
exports.getBalance = getBalance;
function buildPathsFile() {
    return __awaiter(this, void 0, void 0, function () {
        var tokens, smartTokens;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tokens = {};
                    smartTokens = {};
                    return [4 /*yield*/, Promise.all(converter_blockchain_ids_1.converterBlockchainIds.map(function (converterBlockchainId) { return __awaiter(_this, void 0, void 0, function () {
                            var smartToken, smartTokenContract, smartTokenName, reservesObject, reserves;
                            var _a, _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0: return [4 /*yield*/, getSmartToken(converterBlockchainId)];
                                    case 1:
                                        smartToken = _c.sent();
                                        smartTokenContract = smartToken.rows[0].smart_contract;
                                        smartTokenName = getSymbol(smartToken.rows[0].smart_currency);
                                        return [4 /*yield*/, exports.getReservesFromCode(converterBlockchainId)];
                                    case 2:
                                        reservesObject = _c.sent();
                                        reserves = Object.values(reservesObject.rows);
                                        smartTokens[smartTokenContract] = (_a = {}, _a[smartTokenName] = (_b = {}, _b[smartTokenName] = converterBlockchainId, _b), _a);
                                        reserves.map(function (reserveObj) {
                                            var _a, _b;
                                            var reserveSymbol = exports.getReserveTokenSymbol(reserveObj);
                                            var existingRecord = tokens[reserveObj.contract];
                                            if (existingRecord)
                                                existingRecord[reserveSymbol][smartTokenName] = converterBlockchainId;
                                            tokens[reserveObj.contract] = existingRecord ? existingRecord : (_a = {}, _a[reserveSymbol] = (_b = {}, _b[smartTokenName] = converterBlockchainId, _b), _a);
                                        });
                                        return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, fs_1.default.writeFile('./src/blockchains/eos/paths.ts', "export const Paths = \n{convertibleTokens:" + JSON.stringify(tokens) + ", \n smartTokens: " + JSON.stringify(smartTokens) + "}", 'utf8', 
                        // eslint-disable-next-line no-console
                        function () { return console.log('Done making paths json'); })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.buildPathsFile = buildPathsFile;
function isFromSmartToken(pair, reserves) {
    return (!reserves.includes(Object.values(pair.fromToken)[0]));
}
function isToSmartToken(pair, reserves) {
    return (!reserves.includes(Object.values(pair.toToken)[0]));
}
function getPathStepRate(pair, amount) {
    return __awaiter(this, void 0, void 0, function () {
        var toTokenBlockchainId, fromTokenBlockchainId, fromTokenSymbol, toTokenSymbol, isFromTokenMultiToken, isToTokenMultiToken, converterBlockchainId, reserveSymbol, reserves, reservesContacts, fee, isConversionFromSmartToken, balanceFrom, balanceTo, isConversionToSmartToken, amountWithoutFee, magnitude, balanceObject, converterReserves, token, tokenSymbol, tokenSupplyObj, toReserveRatio, tokenSupply, reserveTokenBalance, token, tokenSymbol, tokenSupplyObj, toReserveRatio, tokenSupply, reserveTokenBalance;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    toTokenBlockchainId = Object.values(pair.toToken)[0];
                    fromTokenBlockchainId = Object.values(pair.fromToken)[0];
                    fromTokenSymbol = Object.keys(pair.fromToken)[0];
                    toTokenSymbol = Object.keys(pair.toToken)[0];
                    isFromTokenMultiToken = exports.isMultiConverter(fromTokenBlockchainId);
                    isToTokenMultiToken = exports.isMultiConverter(toTokenBlockchainId);
                    converterBlockchainId = Object.values(pair.converterBlockchainId)[0];
                    if (isFromTokenMultiToken)
                        reserveSymbol = fromTokenSymbol;
                    if (isToTokenMultiToken)
                        reserveSymbol = toTokenSymbol;
                    return [4 /*yield*/, exports.getReservesFromCode(converterBlockchainId, reserveSymbol)];
                case 1:
                    reserves = _b.sent();
                    reservesContacts = reserves.rows.map(function (res) { return res.contract; });
                    return [4 /*yield*/, exports.getConverterFeeFromSettings(converterBlockchainId)];
                case 2:
                    fee = _b.sent();
                    isConversionFromSmartToken = isFromSmartToken(pair, reservesContacts);
                    if (!isToTokenMultiToken) return [3 /*break*/, 4];
                    return [4 /*yield*/, exports.getReserveBalances(converterBlockchainId, toTokenSymbol, 'reserves')];
                case 3:
                    balanceFrom = _b.sent();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, exports.getReserveBalances(fromTokenBlockchainId, converterBlockchainId)];
                case 5:
                    balanceFrom = _b.sent();
                    _b.label = 6;
                case 6:
                    if (!isFromTokenMultiToken) return [3 /*break*/, 8];
                    return [4 /*yield*/, exports.getReserveBalances(converterBlockchainId, fromTokenSymbol, 'reserves')];
                case 7:
                    balanceTo = _b.sent();
                    return [3 /*break*/, 10];
                case 8: return [4 /*yield*/, exports.getReserveBalances(toTokenBlockchainId, converterBlockchainId)];
                case 9:
                    balanceTo = _b.sent();
                    _b.label = 10;
                case 10:
                    isConversionToSmartToken = isToSmartToken(pair, reservesContacts);
                    amountWithoutFee = 0;
                    magnitude = 0;
                    balanceObject = (_a = {}, _a[fromTokenBlockchainId] = balanceFrom.rows[0].balance, _a[toTokenBlockchainId] = balanceTo.rows[0].balance, _a);
                    converterReserves = {};
                    reserves.rows.map(function (reserve) {
                        converterReserves[reserve.contract] = {
                            ratio: reserve.ratio, balance: balanceObject[reserve.contract]
                        };
                    });
                    if (!isConversionFromSmartToken) return [3 /*break*/, 12];
                    token = pathJson.smartTokens[fromTokenBlockchainId] || pathJson.convertibleTokens[fromTokenBlockchainId];
                    tokenSymbol = Object.keys(token[fromTokenSymbol])[0];
                    return [4 /*yield*/, exports.getSmartTokenSupply(fromTokenBlockchainId, tokenSymbol)];
                case 11:
                    tokenSupplyObj = _b.sent();
                    toReserveRatio = converterReserves[toTokenBlockchainId].ratio;
                    tokenSupply = getBalance(tokenSupplyObj.rows[0].supply);
                    reserveTokenBalance = getBalance(balanceTo.rows[0].balance);
                    amountWithoutFee = formulas_1.sellSmartToken(reserveTokenBalance, toReserveRatio, amount, tokenSupply);
                    magnitude = 1;
                    return [3 /*break*/, 15];
                case 12:
                    if (!isConversionToSmartToken) return [3 /*break*/, 14];
                    token = pathJson.smartTokens[toTokenBlockchainId] || pathJson.convertibleTokens[toTokenBlockchainId];
                    tokenSymbol = Object.keys(token[toTokenSymbol])[0];
                    return [4 /*yield*/, exports.getSmartTokenSupply(toTokenBlockchainId, tokenSymbol)];
                case 13:
                    tokenSupplyObj = _b.sent();
                    toReserveRatio = converterReserves[fromTokenBlockchainId].ratio;
                    tokenSupply = getBalance(tokenSupplyObj.rows[0].supply);
                    reserveTokenBalance = getBalance(balanceFrom.rows[0].balance);
                    amountWithoutFee = formulas_1.buySmartToken(reserveTokenBalance, toReserveRatio, amount, tokenSupply);
                    magnitude = 1;
                    return [3 /*break*/, 15];
                case 14:
                    amountWithoutFee = formulas_1.shortConvert(amount, getBalance(converterReserves[toTokenBlockchainId].balance), getBalance(converterReserves[fromTokenBlockchainId].balance));
                    magnitude = 2;
                    _b.label = 15;
                case 15:
                    if (fee == 0)
                        return [2 /*return*/, amountWithoutFee];
                    return [2 /*return*/, formulas_1.returnWithFee(amountWithoutFee, fee, magnitude)];
            }
        });
    });
}
exports.getPathStepRate = getPathStepRate;
function getConverterBlockchainId(token) {
    return __awaiter(this, void 0, void 0, function () {
        var isSmart;
        return __generator(this, function (_a) {
            isSmart = !pathJson.convertibleTokens[token.blockchainId];
            return [2 /*return*/, pathJson[isSmart ? 'smartTokens' : 'convertibleTokens'][token.blockchainId][token.symbol]];
        });
    });
}
exports.getConverterBlockchainId = getConverterBlockchainId;
function getReserveBlockchainId(reserves, position) {
    return __awaiter(this, void 0, void 0, function () {
        var blockchainId, symbol, tok;
        return __generator(this, function (_a) {
            blockchainId = reserves[position].blockchainId;
            symbol = reserves[position].symbol;
            tok = {
                blockchainType: 'eos',
                blockchainId: blockchainId,
                symbol: symbol
            };
            return [2 /*return*/, tok];
        });
    });
}
exports.getReserveBlockchainId = getReserveBlockchainId;
function getReserves(converterBlockchainId, symbol, isMulti) {
    if (isMulti === void 0) { isMulti = false; }
    return __awaiter(this, void 0, void 0, function () {
        var reserves, tokens;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.getReservesFromCode(converterBlockchainId, isMulti ? symbol : null)];
                case 1:
                    reserves = _a.sent();
                    tokens = [];
                    reserves.rows.map(function (reserve) {
                        var symbol = getSymbol(reserve.currency);
                        tokens.push({ symbol: symbol, blockchainId: reserve.contract });
                    });
                    return [2 /*return*/, { reserves: tokens }];
            }
        });
    });
}
exports.getReserves = getReserves;
function getReservesCount(reserves) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, reserves.length];
        });
    });
}
exports.getReservesCount = getReservesCount;
