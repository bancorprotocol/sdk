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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./blockchains/eos/index");
var index_2 = require("./blockchains/ethereum/index");
var SDK = /** @class */ (function () {
    function SDK() {
    }
    SDK.create = function (settings) {
        return __awaiter(this, void 0, void 0, function () {
            var sdk, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        sdk = new SDK();
                        if (!settings.eosNodeEndpoint) return [3 /*break*/, 2];
                        _a = sdk;
                        return [4 /*yield*/, index_1.EOS.create(settings.eosNodeEndpoint)];
                    case 1:
                        _a.eos = _c.sent();
                        _c.label = 2;
                    case 2:
                        if (!settings.ethereumNodeEndpoint) return [3 /*break*/, 4];
                        _b = sdk;
                        return [4 /*yield*/, index_2.Ethereum.create(settings.ethereumNodeEndpoint)];
                    case 3:
                        _b.ethereum = _c.sent();
                        _c.label = 4;
                    case 4: return [2 /*return*/, sdk];
                }
            });
        });
    };
    SDK.destroy = function (sdk) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!sdk.eos) return [3 /*break*/, 2];
                        return [4 /*yield*/, index_1.EOS.destroy(sdk.eos)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!sdk.ethereum) return [3 /*break*/, 4];
                        return [4 /*yield*/, index_2.Ethereum.destroy(sdk.ethereum)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SDK.prototype.refresh = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.eos) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.eos.refresh()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!this.ethereum) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.ethereum.refresh()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SDK.prototype.getShortestPath = function (sourceToken, targetToken, amount) {
        if (amount === void 0) { amount = '1'; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getPath(this, sourceToken, targetToken, amount, getShortestPath)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SDK.prototype.getCheapestPath = function (sourceToken, targetToken, amount) {
        if (amount === void 0) { amount = '1'; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getPath(this, sourceToken, targetToken, amount, getCheapestPath)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SDK.prototype.getShortestPathRate = function (sourceToken, targetToken, amount) {
        if (amount === void 0) { amount = '1'; }
        return __awaiter(this, void 0, void 0, function () {
            var path;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getShortestPath(sourceToken, targetToken, amount)];
                    case 1:
                        path = _a.sent();
                        return [4 /*yield*/, this.getRateByPath(path, amount)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SDK.prototype.getCheapestPathRate = function (sourceToken, targetToken, amount) {
        if (amount === void 0) { amount = '1'; }
        return __awaiter(this, void 0, void 0, function () {
            var path;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getCheapestPath(sourceToken, targetToken, amount)];
                    case 1:
                        path = _a.sent();
                        return [4 /*yield*/, this.getRateByPath(path, amount)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SDK.prototype.getRateByPath = function (path, amount) {
        if (amount === void 0) { amount = '1'; }
        return __awaiter(this, void 0, void 0, function () {
            var bgn, end;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bgn = 0;
                        _a.label = 1;
                    case 1:
                        if (!(bgn < path.length)) return [3 /*break*/, 3];
                        end = path.slice(bgn).findIndex(function (token) { return token.blockchainType != path[bgn].blockchainType; }) >>> 0;
                        return [4 /*yield*/, this[path[bgn].blockchainType].getRateByPath(path.slice(bgn, end), amount)];
                    case 2:
                        amount = _a.sent();
                        bgn = end;
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/, amount];
                }
            });
        });
    };
    SDK.prototype.getAllPathsAndRates = function (sourceToken, targetToken, amount) {
        if (amount === void 0) { amount = '1'; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, paths, rates_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = pathType(sourceToken.blockchainType, targetToken.blockchainType);
                        switch (_a) {
                            case pathType('eos', 'eos'): return [3 /*break*/, 1];
                            case pathType('eos', 'ethereum'): return [3 /*break*/, 2];
                            case pathType('ethereum', 'eos'): return [3 /*break*/, 3];
                            case pathType('ethereum', 'ethereum'): return [3 /*break*/, 4];
                        }
                        return [3 /*break*/, 6];
                    case 1: throw new Error('getAllPathsAndRates from eos token to eos token not supported');
                    case 2: throw new Error('getAllPathsAndRates from eos token to ethereum token not supported');
                    case 3: throw new Error('getAllPathsAndRates from ethereum token to eos token not supported');
                    case 4: return [4 /*yield*/, this.ethereum.getAllPathsAndRates(sourceToken.blockchainId, targetToken.blockchainId, amount)];
                    case 5:
                        _b = _c.sent(), paths = _b[0], rates_1 = _b[1];
                        return [2 /*return*/, paths.map(function (path, i) { return ({ path: path.map(function (x) { return ({ blockchainType: 'ethereum', blockchainId: x }); }), rate: rates_1[i] }); })];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    SDK.prototype.getShortestPathAndRate = function (sourceToken, targetToken, amount) {
        if (amount === void 0) { amount = '1'; }
        return __awaiter(this, void 0, void 0, function () {
            var paths_rates, paths, rates, index, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAllPathsAndRates(sourceToken, targetToken, amount)];
                    case 1:
                        paths_rates = _a.sent();
                        paths = paths_rates.map(function (x) { return x.path.map(function (y) { return y.blockchainId; }); });
                        rates = paths_rates.map(function (x) { return x.rate; });
                        index = 0;
                        for (i = 1; i < paths_rates.length; i++) {
                            if (betterPath(paths, index, i) || (equalPath(paths, index, i) && betterRate(rates, index, i)))
                                index = i;
                        }
                        return [2 /*return*/, paths_rates[index]];
                }
            });
        });
    };
    SDK.prototype.getCheapestPathAndRate = function (sourceToken, targetToken, amount) {
        if (amount === void 0) { amount = '1'; }
        return __awaiter(this, void 0, void 0, function () {
            var paths_rates, paths, rates, index, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAllPathsAndRates(sourceToken, targetToken, amount)];
                    case 1:
                        paths_rates = _a.sent();
                        paths = paths_rates.map(function (x) { return x.path.map(function (y) { return y.blockchainId; }); });
                        rates = paths_rates.map(function (x) { return x.rate; });
                        index = 0;
                        for (i = 1; i < paths_rates.length; i++) {
                            if (betterRate(rates, index, i) || (equalRate(rates, index, i) && betterPath(paths, index, i)))
                                index = i;
                        }
                        return [2 /*return*/, paths_rates[index]];
                }
            });
        });
    };
    SDK.prototype.getConverterVersion = function (converter) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this[converter.blockchainType].getConverterVersion(converter)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SDK.prototype.getConversionEvents = function (token, fromBlock, toBlock) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this[token.blockchainType].getConversionEvents(token, fromBlock, toBlock)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SDK.prototype.getConversionEventsByTimestamp = function (token, fromTimestamp, toTimestamp) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this[token.blockchainType].getConversionEventsByTimestamp(token, fromTimestamp, toTimestamp)];
                    case 1: return [2 /*return*/, _a.sent()];
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
    return SDK;
}());
exports.SDK = SDK;
function getPath(sdk, sourceToken, targetToken, amount, getBestPath) {
    return __awaiter(this, void 0, void 0, function () {
        var eosPath, ethPaths, ethRates, _a;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _a = pathType(sourceToken.blockchainType, targetToken.blockchainType);
                    switch (_a) {
                        case pathType('eos', 'eos'): return [3 /*break*/, 1];
                        case pathType('eos', 'ethereum'): return [3 /*break*/, 3];
                        case pathType('ethereum', 'eos'): return [3 /*break*/, 6];
                        case pathType('ethereum', 'ethereum'): return [3 /*break*/, 9];
                    }
                    return [3 /*break*/, 11];
                case 1: return [4 /*yield*/, sdk.eos.getPath(sourceToken, targetToken)];
                case 2:
                    eosPath = _e.sent();
                    return [2 /*return*/, eosPath];
                case 3: return [4 /*yield*/, sdk.eos.getPath(sourceToken, sdk.eos.getAnchorToken())];
                case 4:
                    eosPath = _e.sent();
                    return [4 /*yield*/, sdk.ethereum.getAllPathsAndRates(sdk.ethereum.getAnchorToken(), targetToken.blockchainId, amount)];
                case 5:
                    _b = _e.sent(), ethPaths = _b[0], ethRates = _b[1];
                    return [2 /*return*/, __spreadArrays(eosPath, getBestPath(ethPaths, ethRates).map(function (x) { return ({ blockchainType: 'ethereum', blockchainId: x }); }))];
                case 6: return [4 /*yield*/, sdk.ethereum.getAllPathsAndRates(sourceToken.blockchainId, sdk.ethereum.getAnchorToken(), amount)];
                case 7:
                    _c = _e.sent(), ethPaths = _c[0], ethRates = _c[1];
                    return [4 /*yield*/, sdk.eos.getPath(sdk.eos.getAnchorToken(), targetToken)];
                case 8:
                    eosPath = _e.sent();
                    return [2 /*return*/, __spreadArrays(getBestPath(ethPaths, ethRates).map(function (x) { return ({ blockchainType: 'ethereum', blockchainId: x }); }), eosPath)];
                case 9: return [4 /*yield*/, sdk.ethereum.getAllPathsAndRates(sourceToken.blockchainId, targetToken.blockchainId, amount)];
                case 10:
                    _d = _e.sent(), ethPaths = _d[0], ethRates = _d[1];
                    return [2 /*return*/, getBestPath(ethPaths, ethRates).map(function (x) { return ({ blockchainType: 'ethereum', blockchainId: x }); })];
                case 11: return [2 /*return*/];
            }
        });
    });
}
function getShortestPath(paths, rates) {
    var index = 0;
    for (var i = 1; i < paths.length; i++) {
        if (betterPath(paths, index, i) || (equalPath(paths, index, i) && betterRate(rates, index, i)))
            index = i;
    }
    return paths[index];
}
function getCheapestPath(paths, rates) {
    var index = 0;
    for (var i = 1; i < rates.length; i++) {
        if (betterRate(rates, index, i) || (equalRate(rates, index, i) && betterPath(paths, index, i)))
            index = i;
    }
    return paths[index];
}
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
function pathType(blockchainType1, blockchainType2) {
    return blockchainType1 + ',' + blockchainType2;
}
