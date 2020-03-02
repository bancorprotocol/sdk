"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var eosjs_1 = require("eosjs");
var node_fetch_1 = __importDefault(require("node-fetch"));
var converter_blockchain_ids_1 = require("./converter_blockchain_ids");
var fs_1 = __importDefault(require("fs"));
var utils = __importStar(require("../../utils"));
var registry = __importStar(require("./registry"));
var EOS = /** @class */ (function () {
    function EOS(nodeEndpoint) {
        this.jsonRpc = new eosjs_1.JsonRpc(nodeEndpoint, { fetch: node_fetch_1.default });
    }
    EOS.prototype.close = function () {
    };
    EOS.prototype.getAnchorToken = function () {
        return exports.getAnchorToken(); // calling global function
    };
    EOS.prototype.getConversionPath = function (from, to) {
        return __awaiter(this, void 0, void 0, function () {
            var anchorToken, sourcePath, targetPath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        anchorToken = this.getAnchorToken();
                        return [4 /*yield*/, getPathToAnchor(this.jsonRpc, from, anchorToken)];
                    case 1:
                        sourcePath = _a.sent();
                        return [4 /*yield*/, getPathToAnchor(this.jsonRpc, to, anchorToken)];
                    case 2:
                        targetPath = _a.sent();
                        return [2 /*return*/, getShortestPath(sourcePath, targetPath)];
                }
            });
        });
    };
    EOS.prototype.getRateByPath = function (path, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < path.length - 1)) return [3 /*break*/, 4];
                        return [4 /*yield*/, getConversionRate(this.jsonRpc, __assign({}, path[i + 1]), path[i], path[i + 2], amount)];
                    case 2:
                        amount = _a.sent();
                        _a.label = 3;
                    case 3:
                        i += 2;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, amount];
                }
            });
        });
    };
    EOS.prototype.buildPathsFile = function () {
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
                                        case 0: return [4 /*yield*/, exports.getSmartToken(this.jsonRpc, converterBlockchainId)];
                                        case 1:
                                            smartToken = _c.sent();
                                            smartTokenContract = smartToken.rows[0].smart_contract;
                                            smartTokenName = getSymbol(smartToken.rows[0].smart_currency);
                                            return [4 /*yield*/, exports.getReservesFromCode(this.jsonRpc, converterBlockchainId)];
                                        case 2:
                                            reservesObject = _c.sent();
                                            reserves = Object.values(reservesObject.rows);
                                            smartTokens[smartTokenContract] = (_a = {}, _a[smartTokenName] = (_b = {}, _b[smartTokenName] = converterBlockchainId, _b), _a);
                                            reserves.map(function (reserveObj) {
                                                var _a, _b;
                                                var reserveSymbol = getSymbol(reserveObj.currency);
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
                        fs_1.default.writeFileSync('./src/blockchains/eos/registry.ts', "export const anchorTokenId = '" + registry.anchorTokenId + "';\n\n" +
                            ("export const anchorTokenSymbol = '" + registry.anchorTokenSymbol + "';\n\n") +
                            ("export const convertibleTokens = " + JSON.stringify(registry.convertibleTokens, null, 4) + ";\n\n") +
                            ("export const smartTokens = " + JSON.stringify(registry.smartTokens, null, 4) + ";\n"), { encoding: "utf8" });
                        return [2 /*return*/];
                }
            });
        });
    };
    return EOS;
}());
exports.EOS = EOS;
exports.getReservesFromCode = function (jsonRpc, code, symbol) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, jsonRpc.jsonRpc.get_table_rows({
                    json: true,
                    code: code,
                    scope: symbol ? symbol : code,
                    table: 'reserves',
                    limit: 10
                })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getConverterSettings = function (jsonRpc, code) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, jsonRpc.get_table_rows({
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
exports.getSmartToken = function (jsonRpc, code) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, jsonRpc.get_table_rows({
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
exports.getSmartTokenSupply = function (jsonRpc, account, code) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, jsonRpc.get_table_rows({
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
exports.getReserveBalances = function (jsonRpc, code, scope, table) {
    if (table === void 0) { table = 'accounts'; }
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, jsonRpc.get_table_rows({
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
exports.getAnchorToken = function () {
    return {
        blockchainType: 'eos',
        blockchainId: registry.anchorTokenId,
        symbol: registry.anchorTokenSymbol
    };
};
exports.getConvertibleTokens = function (blockchainId) {
    return registry.convertibleTokens[blockchainId];
};
exports.getSmartTokens = function (blockchainId) {
    return registry.smartTokens[blockchainId];
};
function getBalance(string) {
    return string.split(' ')[0];
}
function getSymbol(string) {
    return string.split(' ')[1];
}
function isMultiConverter(blockchhainId) {
    return exports.getSmartTokens(blockchhainId) && exports.getSmartTokens(blockchhainId).isMultiConverter;
}
function getConversionRate(jsonRpc, converter, fromToken, toToken, amount) {
    return __awaiter(this, void 0, void 0, function () {
        var toTokenBlockchainId, fromTokenBlockchainId, fromTokenSymbol, toTokenSymbol, isFromTokenMultiToken, isToTokenMultiToken, converterBlockchainId, reserveSymbol, reserves, reservesContacts, conversionFee, isConversionFromSmartToken, isConversionToSmartToken, balanceFrom, balanceTo, balanceObject, converterReserves, token, tokenSymbol, tokenSupplyObj, supply, reserveBalance, reserveRatio, amountWithoutFee, token, tokenSymbol, tokenSupplyObj, supply, reserveBalance, reserveRatio, amountWithoutFee, fromReserveBalance, fromReserveRatio, toReserveBalance, toReserveRatio, amountWithoutFee;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    toTokenBlockchainId = toToken.blockchainId;
                    fromTokenBlockchainId = fromToken.blockchainId;
                    fromTokenSymbol = fromToken.symbol;
                    toTokenSymbol = toToken.symbol;
                    isFromTokenMultiToken = isMultiConverter(fromTokenBlockchainId);
                    isToTokenMultiToken = isMultiConverter(toTokenBlockchainId);
                    converterBlockchainId = converter.blockchainId;
                    if (isFromTokenMultiToken)
                        reserveSymbol = fromTokenSymbol;
                    if (isToTokenMultiToken)
                        reserveSymbol = toTokenSymbol;
                    return [4 /*yield*/, exports.getReservesFromCode(jsonRpc, converterBlockchainId, reserveSymbol)];
                case 1:
                    reserves = _b.sent();
                    reservesContacts = reserves.rows.map(function (res) { return res.contract; });
                    return [4 /*yield*/, exports.getConverterSettings(jsonRpc, converterBlockchainId)];
                case 2:
                    conversionFee = (_b.sent()).rows[0].fee;
                    isConversionFromSmartToken = !reservesContacts.includes(fromToken.blockchainId);
                    isConversionToSmartToken = !reservesContacts.includes(toToken.blockchainId);
                    if (!isToTokenMultiToken) return [3 /*break*/, 4];
                    return [4 /*yield*/, exports.getReserveBalances(jsonRpc, converterBlockchainId, toTokenSymbol, 'reserves')];
                case 3:
                    balanceFrom = _b.sent();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, exports.getReserveBalances(jsonRpc, fromTokenBlockchainId, converterBlockchainId)];
                case 5:
                    balanceFrom = _b.sent();
                    _b.label = 6;
                case 6:
                    if (!isFromTokenMultiToken) return [3 /*break*/, 8];
                    return [4 /*yield*/, exports.getReserveBalances(jsonRpc, converterBlockchainId, fromTokenSymbol, 'reserves')];
                case 7:
                    balanceTo = _b.sent();
                    return [3 /*break*/, 10];
                case 8: return [4 /*yield*/, exports.getReserveBalances(jsonRpc, toTokenBlockchainId, converterBlockchainId)];
                case 9:
                    balanceTo = _b.sent();
                    _b.label = 10;
                case 10:
                    balanceObject = (_a = {},
                        _a[fromTokenBlockchainId] = balanceFrom.rows[0].balance,
                        _a[toTokenBlockchainId] = balanceTo.rows[0].balance,
                        _a);
                    converterReserves = {};
                    reserves.rows.map(function (reserve) {
                        converterReserves[reserve.contract] = {
                            ratio: reserve.ratio, balance: balanceObject[reserve.contract]
                        };
                    });
                    utils.init();
                    if (!isConversionFromSmartToken) return [3 /*break*/, 12];
                    token = exports.getSmartTokens(fromTokenBlockchainId) || exports.getConvertibleTokens(fromTokenBlockchainId);
                    tokenSymbol = Object.keys(token[fromTokenSymbol])[0];
                    return [4 /*yield*/, exports.getSmartTokenSupply(jsonRpc, fromTokenBlockchainId, tokenSymbol)];
                case 11:
                    tokenSupplyObj = _b.sent();
                    supply = getBalance(tokenSupplyObj.rows[0].supply);
                    reserveBalance = getBalance(balanceTo.rows[0].balance);
                    reserveRatio = converterReserves[toTokenBlockchainId].ratio;
                    amountWithoutFee = utils.calculateSaleReturn(supply, reserveBalance, reserveRatio, amount);
                    return [2 /*return*/, utils.getFinalAmount(amountWithoutFee, conversionFee, 1).toFixed()];
                case 12:
                    if (!isConversionToSmartToken) return [3 /*break*/, 14];
                    token = exports.getSmartTokens(toTokenBlockchainId) || exports.getConvertibleTokens(toTokenBlockchainId);
                    tokenSymbol = Object.keys(token[toTokenSymbol])[0];
                    return [4 /*yield*/, exports.getSmartTokenSupply(jsonRpc, toTokenBlockchainId, tokenSymbol)];
                case 13:
                    tokenSupplyObj = _b.sent();
                    supply = getBalance(tokenSupplyObj.rows[0].supply);
                    reserveBalance = getBalance(balanceFrom.rows[0].balance);
                    reserveRatio = converterReserves[fromTokenBlockchainId].ratio;
                    amountWithoutFee = utils.calculatePurchaseReturn(supply, reserveBalance, reserveRatio, amount);
                    return [2 /*return*/, utils.getFinalAmount(amountWithoutFee, conversionFee, 1).toFixed()];
                case 14:
                    fromReserveBalance = getBalance(balanceFrom.rows[0].balance);
                    fromReserveRatio = converterReserves[fromTokenBlockchainId].ratio;
                    toReserveBalance = getBalance(balanceTo.rows[0].balance);
                    toReserveRatio = converterReserves[toTokenBlockchainId].ratio;
                    amountWithoutFee = utils.calculateCrossReserveReturn(fromReserveBalance, fromReserveRatio, toReserveBalance, toReserveRatio, amount);
                    return [2 /*return*/, utils.getFinalAmount(amountWithoutFee, conversionFee, 2).toFixed()];
            }
        });
    });
}
function getConverterBlockchainId(token) {
    if (exports.getConvertibleTokens(token.blockchainId))
        return exports.getConvertibleTokens(token.blockchainId)[token.symbol];
    return exports.getSmartTokens(token.blockchainId)[token.symbol];
}
function getPathToAnchor(jsonRpc, token, anchorToken) {
    return __awaiter(this, void 0, void 0, function () {
        var blockchainId, symbol, reserves, _i, _a, reserve, reserveToken, path, smartToken;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (token.blockchainId == anchorToken.blockchainId && token.symbol == anchorToken.symbol)
                        return [2 /*return*/, [token]];
                    blockchainId = getConverterBlockchainId(token);
                    symbol = isMultiConverter(token.blockchainId) ? token.symbol : null;
                    return [4 /*yield*/, exports.getReservesFromCode(jsonRpc, Object.values(blockchainId)[0], symbol)];
                case 1:
                    reserves = _b.sent();
                    _i = 0, _a = reserves.rows.filter(function (reserve) { return reserve.contract != token.blockchainId; });
                    _b.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    reserve = _a[_i];
                    reserveToken = { blockchainType: 'eos', blockchainId: reserve.contract, symbol: getSymbol(reserve.currency) };
                    return [4 /*yield*/, getPathToAnchor(jsonRpc, reserveToken, anchorToken)];
                case 3:
                    path = _b.sent();
                    if (path.length > 0) {
                        smartToken = { blockchainType: 'eos', blockchainId: Object.values(blockchainId)[0].toString(), symbol: Object.keys(blockchainId)[0].toString() };
                        return [2 /*return*/, __spreadArrays([token, smartToken], path)];
                    }
                    _b.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/, []];
            }
        });
    });
}
function getShortestPath(sourcePath, targetPath) {
    if (sourcePath.length > 0 && targetPath.length > 0) {
        var i = sourcePath.length - 1;
        var j = targetPath.length - 1;
        while (i >= 0 && j >= 0 && JSON.stringify(sourcePath[i]) == JSON.stringify(targetPath[j])) {
            i--;
            j--;
        }
        var path = [];
        for (var m = 0; m <= i + 1; m++)
            path.push(sourcePath[m]);
        for (var n = j; n >= 0; n--)
            path.push(targetPath[n]);
        var length_1 = 0;
        for (var p = 0; p < path.length; p += 1) {
            for (var q = p + 2; q < path.length - p % 2; q += 2) {
                if (path[p] == path[q])
                    p = q;
            }
            path[length_1++] = path[p];
        }
        return path.slice(0, length_1);
    }
    return [];
}
