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
var helpers = __importStar(require("../../helpers"));
var types_1 = require("../../types");
var legacy_converters_1 = __importDefault(require("./legacy_converters"));
var anchorToken = {
    blockchainType: types_1.BlockchainType.EOS,
    blockchainId: 'bntbntbntbnt',
    symbol: 'BNT'
};
var EOS = /** @class */ (function () {
    function EOS() {
    }
    EOS.create = function (nodeEndpoint) {
        return __awaiter(this, void 0, void 0, function () {
            var eos;
            return __generator(this, function (_a) {
                eos = new EOS();
                eos.jsonRpc = new eosjs_1.JsonRpc(nodeEndpoint, { fetch: node_fetch_1.default });
                return [2 /*return*/, eos];
            });
        });
    };
    EOS.destroy = function (eos) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    EOS.prototype.refresh = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    EOS.prototype.getAnchorToken = function () {
        return anchorToken;
    };
    EOS.prototype.getPath = function (from, to) {
        return __awaiter(this, void 0, void 0, function () {
            var anchorToken, sourcePath, targetPath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        anchorToken = this.getAnchorToken();
                        return [4 /*yield*/, this.getPathToAnchor(this.jsonRpc, from, anchorToken)];
                    case 1:
                        sourcePath = _a.sent();
                        return [4 /*yield*/, this.getPathToAnchor(this.jsonRpc, to, anchorToken)];
                    case 2:
                        targetPath = _a.sent();
                        return [2 /*return*/, this.getShortestPath(sourcePath, targetPath)];
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
                        return [4 /*yield*/, this.getConversionRate(this.jsonRpc, path[i + 1], path[i], path[i + 2], amount)];
                    case 2:
                        amount = _a.sent();
                        _a.label = 3;
                    case 3:
                        i += 2;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, amount.toString()];
                }
            });
        });
    };
    EOS.prototype.getConverterVersion = function (converter) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, '1.0'];
            });
        });
    };
    EOS.prototype.getConversionEvents = function (token, fromBlock, toBlock) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('getConversionEvents not supported on eos');
            });
        });
    };
    EOS.prototype.getConversionEventsByTimestamp = function (token, fromTimestamp, toTimestamp) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('getConversionEventsByTimestamp not supported on eos');
            });
        });
    };
    EOS.prototype.getConverterSettings = function (jsonRpc, converter) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, jsonRpc.get_table_rows({
                            json: true,
                            code: converter.blockchainId,
                            scope: converter.blockchainId,
                            table: 'settings',
                            limit: 1
                        })];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.rows[0]];
                }
            });
        });
    };
    ;
    EOS.prototype.getSmartTokenStat = function (jsonRpc, smartToken) {
        return __awaiter(this, void 0, void 0, function () {
            var stat;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, jsonRpc.get_table_rows({
                            json: true,
                            code: smartToken.blockchainId,
                            scope: smartToken.symbol,
                            table: 'stat',
                            limit: 1
                        })];
                    case 1:
                        stat = _a.sent();
                        return [2 /*return*/, stat.rows[0]];
                }
            });
        });
    };
    ;
    EOS.prototype.getReserves = function (jsonRpc, converter) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, jsonRpc.get_table_rows({
                            json: true,
                            code: converter.blockchainId,
                            scope: converter.blockchainId,
                            table: 'reserves',
                            limit: 10
                        })];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.rows];
                }
            });
        });
    };
    ;
    EOS.prototype.getReserveBalance = function (jsonRpc, converter, reserveToken) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, jsonRpc.get_table_rows({
                            json: true,
                            code: reserveToken.blockchainId,
                            scope: converter.blockchainId,
                            table: 'accounts',
                            limit: 1
                        })];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, this.getBalance(res.rows[0].balance)];
                }
            });
        });
    };
    ;
    EOS.prototype.getReserve = function (reserves, reserveToken) {
        var _this = this;
        return reserves.filter(function (reserve) {
            return reserve.contract == reserveToken.blockchainId &&
                _this.getSymbol(reserve.currency) == reserveToken.symbol;
        })[0];
    };
    EOS.prototype.getBalance = function (asset) {
        return asset.split(' ')[0];
    };
    EOS.prototype.getSymbol = function (asset) {
        return asset.split(' ')[1];
    };
    EOS.prototype.getDecimals = function (amount) {
        return amount.split('.')[1].length;
    };
    EOS.prototype.getConversionRate = function (jsonRpc, smartToken, sourceToken, targetToken, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var smartTokenStat, converterBlockchainId, converter, conversionSettings, conversionFee, reserves, magnitude, targetDecimals, returnAmount, supply, reserveBalance, reserveRatio, supply, reserveBalance, reserveRatio, sourceReserveBalance, sourceReserveRatio, targetReserveBalance, targetReserveRatio;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSmartTokenStat(jsonRpc, smartToken)];
                    case 1:
                        smartTokenStat = _a.sent();
                        return [4 /*yield*/, smartTokenStat.issuer];
                    case 2:
                        converterBlockchainId = _a.sent();
                        converter = {
                            blockchainType: types_1.BlockchainType.EOS,
                            blockchainId: converterBlockchainId,
                            symbol: smartToken.symbol
                        };
                        return [4 /*yield*/, this.getConverterSettings(jsonRpc, converter)];
                    case 3:
                        conversionSettings = _a.sent();
                        conversionFee = conversionSettings.fee;
                        return [4 /*yield*/, this.getReserves(jsonRpc, converter)];
                    case 4:
                        reserves = _a.sent();
                        magnitude = 1;
                        targetDecimals = 4;
                        if (!helpers.isTokenEqual(sourceToken, smartToken)) return [3 /*break*/, 6];
                        supply = this.getBalance(smartTokenStat.supply);
                        return [4 /*yield*/, this.getReserveBalance(jsonRpc, converter, targetToken)];
                    case 5:
                        reserveBalance = _a.sent();
                        reserveRatio = this.getReserve(reserves, targetToken).ratio;
                        targetDecimals = this.getDecimals(reserveBalance);
                        returnAmount = helpers.calculateSaleReturn(supply, reserveBalance, reserveRatio, amount);
                        return [3 /*break*/, 11];
                    case 6:
                        if (!helpers.isTokenEqual(targetToken, smartToken)) return [3 /*break*/, 8];
                        supply = this.getBalance(smartTokenStat.supply);
                        return [4 /*yield*/, this.getReserveBalance(jsonRpc, converter, sourceToken)];
                    case 7:
                        reserveBalance = _a.sent();
                        reserveRatio = this.getReserve(reserves, sourceToken).ratio;
                        targetDecimals = this.getDecimals(supply);
                        returnAmount = helpers.calculatePurchaseReturn(supply, reserveBalance, reserveRatio, amount);
                        return [3 /*break*/, 11];
                    case 8: return [4 /*yield*/, this.getReserveBalance(jsonRpc, converter, sourceToken)];
                    case 9:
                        sourceReserveBalance = _a.sent();
                        sourceReserveRatio = this.getReserve(reserves, sourceToken).ratio;
                        return [4 /*yield*/, this.getReserveBalance(jsonRpc, converter, targetToken)];
                    case 10:
                        targetReserveBalance = _a.sent();
                        targetReserveRatio = this.getReserve(reserves, targetToken).ratio;
                        targetDecimals = this.getDecimals(targetReserveBalance);
                        returnAmount = helpers.calculateCrossReserveReturn(sourceReserveBalance, sourceReserveRatio, targetReserveBalance, targetReserveRatio, amount);
                        magnitude = 2;
                        _a.label = 11;
                    case 11:
                        returnAmount = helpers.getFinalAmount(returnAmount, conversionFee, magnitude);
                        return [2 /*return*/, helpers.toDecimalPlaces(returnAmount, targetDecimals)];
                }
            });
        });
    };
    EOS.prototype.getTokenSmartTokens = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var smartTokens, converterAccount, converter, reserveAccount, smartTokenAccount;
            return __generator(this, function (_a) {
                smartTokens = [];
                // search in legacy converters
                for (converterAccount in legacy_converters_1.default) {
                    converter = legacy_converters_1.default[converterAccount];
                    // check if the token is the converter smart token
                    if (converter.smartToken[token.blockchainId] == token.symbol)
                        smartTokens.push(token);
                    // check if the token is one of the converter's reserve tokens
                    for (reserveAccount in converter.reserves) {
                        if (reserveAccount == token.blockchainId && converter.reserves[reserveAccount] == token.symbol) {
                            smartTokenAccount = Object.keys(converter.smartToken)[0];
                            smartTokens.push({
                                blockchainType: types_1.BlockchainType.EOS,
                                blockchainId: smartTokenAccount,
                                symbol: converter.smartToken[smartTokenAccount]
                            });
                        }
                    }
                }
                return [2 /*return*/, smartTokens];
            });
        });
    };
    EOS.prototype.getPathToAnchor = function (jsonRpc, token, anchorToken) {
        return __awaiter(this, void 0, void 0, function () {
            var smartTokens;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (helpers.isTokenEqual(token, anchorToken))
                            return [2 /*return*/, [token]];
                        return [4 /*yield*/, this.getTokenSmartTokens(token)];
                    case 1:
                        smartTokens = _a.sent();
                        if (smartTokens.length == 0)
                            return [2 /*return*/, []];
                        return [2 /*return*/, [token, smartTokens[0], anchorToken]];
                }
            });
        });
    };
    EOS.prototype.getShortestPath = function (sourcePath, targetPath) {
        if (sourcePath.length > 0 && targetPath.length > 0) {
            var i = sourcePath.length - 1;
            var j = targetPath.length - 1;
            while (i >= 0 && j >= 0 && helpers.isTokenEqual(sourcePath[i], targetPath[j])) {
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
                    if (helpers.isTokenEqual(path[p], path[q]))
                        p = q;
                }
                path[length_1++] = path[p];
            }
            return path.slice(0, length_1);
        }
        return [];
    };
    return EOS;
}());
exports.EOS = EOS;
