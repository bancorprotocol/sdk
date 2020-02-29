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
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./blockchains/eos/index");
var index_2 = require("./blockchains/ethereum/index");
var SDK = /** @class */ (function () {
    function SDK(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.eosNodeAddress, eosNodeAddress = _c === void 0 ? "" : _c, _d = _b.ethNodeAddress, ethNodeAddress = _d === void 0 ? "" : _d;
        this.eos = new index_1.EOS(eosNodeAddress);
        this.eth = new index_2.ETH(ethNodeAddress);
    }
    SDK.prototype.close = function () {
        this.eos.close();
        this.eth.close();
    };
    SDK.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.eth.init()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SDK.prototype.generatePath = function (sourceToken, targetToken, _a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.amount, amount = _c === void 0 ? '1' : _c, _d = _b.getBestPath, getBestPath = _d === void 0 ? this.getCheapestPath : _d;
        return __awaiter(this, void 0, void 0, function () {
            var eosPath, ethPaths, ethRates, _e;
            var _f, _g, _h;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        _e = sourceToken.blockchainType + ',' + targetToken.blockchainType;
                        switch (_e) {
                            case 'eos,eos': return [3 /*break*/, 1];
                            case 'ethereum,ethereum': return [3 /*break*/, 3];
                            case 'eos,ethereum': return [3 /*break*/, 5];
                            case 'ethereum,eos': return [3 /*break*/, 8];
                        }
                        return [3 /*break*/, 11];
                    case 1: return [4 /*yield*/, this.eos.getConversionPath(sourceToken, targetToken)];
                    case 2:
                        eosPath = _j.sent();
                        return [2 /*return*/, [eosPath]];
                    case 3: return [4 /*yield*/, this.eth.getAllPathsAndRates(sourceToken.blockchainId, targetToken.blockchainId, amount)];
                    case 4:
                        _f = _j.sent(), ethPaths = _f[0], ethRates = _f[1];
                        return [2 /*return*/, [getBestPath(ethPaths, ethRates).map(function (x) { return ({ blockchainType: 'ethereum', blockchainId: x }); })]];
                    case 5: return [4 /*yield*/, this.eos.getConversionPath(sourceToken, this.eos.getAnchorToken())];
                    case 6:
                        eosPath = _j.sent();
                        return [4 /*yield*/, this.eth.getAllPathsAndRates(this.eth.getAnchorToken(), targetToken.blockchainId, amount)];
                    case 7:
                        _g = _j.sent(), ethPaths = _g[0], ethRates = _g[1];
                        return [2 /*return*/, [eosPath, getBestPath(ethPaths, ethRates).map(function (x) { return ({ blockchainType: 'ethereum', blockchainId: x }); })]];
                    case 8: return [4 /*yield*/, this.eth.getAllPathsAndRates(sourceToken.blockchainId, this.eth.getAnchorToken(), amount)];
                    case 9:
                        _h = _j.sent(), ethPaths = _h[0], ethRates = _h[1];
                        return [4 /*yield*/, this.eos.getConversionPath(this.eos.getAnchorToken(), targetToken)];
                    case 10:
                        eosPath = _j.sent();
                        return [2 /*return*/, [getBestPath(ethPaths, ethRates).map(function (x) { return ({ blockchainType: 'ethereum', blockchainId: x }); }), eosPath]];
                    case 11: throw new Error(sourceToken.blockchainType + ' blockchain to ' + targetToken.blockchainType + ' blockchain not supported');
                }
            });
        });
    };
    SDK.prototype.getRateByPath = function (paths, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, paths_1, path, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, paths_1 = paths;
                        _b.label = 1;
                    case 1:
                        if (!(_i < paths_1.length)) return [3 /*break*/, 8];
                        path = paths_1[_i];
                        _a = path[0].blockchainType;
                        switch (_a) {
                            case 'eos': return [3 /*break*/, 2];
                            case 'ethereum': return [3 /*break*/, 4];
                        }
                        return [3 /*break*/, 6];
                    case 2: return [4 /*yield*/, this.eos.getRateByPath(path, amount)];
                    case 3:
                        amount = _b.sent();
                        return [3 /*break*/, 7];
                    case 4: return [4 /*yield*/, this.eth.getRateByPath(path.map(function (token) { return token.blockchainId; }), amount)];
                    case 5:
                        amount = _b.sent();
                        return [3 /*break*/, 7];
                    case 6: throw new Error(path[0].blockchainType + ' blockchain not supported');
                    case 7:
                        _i++;
                        return [3 /*break*/, 1];
                    case 8: return [2 /*return*/, amount];
                }
            });
        });
    };
    SDK.prototype.getRate = function (sourceToken, targetToken, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var paths;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.generatePath(sourceToken, targetToken)];
                    case 1:
                        paths = _a.sent();
                        return [4 /*yield*/, this.getRateByPath(paths, amount)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SDK.prototype.getAllPathsAndRates = function (sourceToken, targetToken, amount) {
        if (amount === void 0) { amount = '1'; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, paths, rates_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(sourceToken.blockchainType == 'ethereum' && targetToken.blockchainType == 'ethereum')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.eth.getAllPathsAndRates(sourceToken.blockchainId, targetToken.blockchainId, amount)];
                    case 1:
                        _a = _b.sent(), paths = _a[0], rates_1 = _a[1];
                        return [2 /*return*/, paths.map(function (path, i) { return ({ path: path.map(function (x) { return ({ blockchainType: 'ethereum', blockchainId: x }); }), rate: rates_1[i] }); })];
                    case 2: throw new Error(sourceToken.blockchainType + ' blockchain to ' + targetToken.blockchainType + ' blockchain not supported');
                }
            });
        });
    };
    SDK.prototype.retrieveConverterVersion = function (converter) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(converter.blockchainType == 'ethereum')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.eth.retrieveConverterVersion(converter.blockchainId)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: throw new Error(converter.blockchainType + ' blockchain not supported');
                }
            });
        });
    };
    SDK.prototype.fetchConversionEvents = function (token, fromBlock, toBlock) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(token.blockchainType == 'ethereum')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.eth.fetchConversionEvents(token.blockchainId, fromBlock, toBlock)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: throw new Error(token.blockchainType + ' blockchain not supported');
                }
            });
        });
    };
    SDK.prototype.fetchConversionEventsByTimestamp = function (token, fromTimestamp, toTimestamp) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(token.blockchainType == 'ethereum')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.eth.fetchConversionEventsByTimestamp(token.blockchainId, fromTimestamp, toTimestamp)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: throw new Error(token.blockchainType + ' blockchain not supported');
                }
            });
        });
    };
    SDK.prototype.buildPathsFile = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.eos.buildPathsFile()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SDK.prototype.getShortestPath = function (paths, rates) {
        var index = 0;
        for (var i = 1; i < paths.length; i++) {
            if (betterPath(paths, index, i) || (equalPath(paths, index, i) && betterRate(rates, index, i)))
                index = i;
        }
        return paths[index];
    };
    SDK.prototype.getCheapestPath = function (paths, rates) {
        var index = 0;
        for (var i = 1; i < rates.length; i++) {
            if (betterRate(rates, index, i) || (equalRate(rates, index, i) && betterPath(paths, index, i)))
                index = i;
        }
        return paths[index];
    };
    return SDK;
}());
exports.SDK = SDK;
function betterPath(paths, index1, index2) {
    return paths[index1].length > paths[index2].length;
}
function betterRate(rates, index1, index2) {
    // return Number(rates[index1]) < Number(rates[index2]);
    var rate1 = rates[index1].split('.').concat('');
    var rate2 = rates[index2].split('.').concat('');
    rate1[0] = rate1[0].padStart(rate2[0].length, '0');
    rate2[0] = rate2[0].padStart(rate1[0].length, '0');
    rate1[1] = rate1[1].padEnd(rate2[1].length, '0');
    rate2[1] = rate2[1].padEnd(rate1[1].length, '0');
    return rate1.join('') < rate2.join('');
}
function equalPath(paths, index1, index2) {
    return paths[index1].length == paths[index2].length;
}
function equalRate(rates, index1, index2) {
    return rates[index1] == rates[index2];
}
