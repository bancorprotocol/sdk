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
var index_1 = require("./blockchains/ethereum/index");
var eos_1 = require("./blockchains/eos");
var path_generation_1 = require("./path_generation");
function init(args) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (args.eosNodeEndpoint)
                        eos_1.initEOS(args.eosNodeEndpoint);
                    if (!args.ethereumNodeEndpoint) return [3 /*break*/, 2];
                    return [4 /*yield*/, index_1.init(args.ethereumNodeEndpoint, args.ethereumContractRegistryAddress)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
exports.init = init;
function generateEosPaths() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, eos_1.buildPathsFile()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.generateEosPaths = generateEosPaths;
function generatePath(sourceToken, targetToken, amount, getBestPath) {
    if (amount === void 0) { amount = "1"; }
    if (getBestPath === void 0) { getBestPath = getEthCheapestPath; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, path_generation_1.generatePathByBlockchainIds(sourceToken, targetToken, amount, getBestPath)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.generatePath = generatePath;
exports.calculateRateFromPaths = function (paths, amount) { return __awaiter(void 0, void 0, void 0, function () {
    var rate;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (paths.paths.length == 0)
                    return [2 /*return*/, amount];
                return [4 /*yield*/, calculateRateFromPath(paths, amount)];
            case 1:
                rate = _a.sent();
                paths.paths.shift();
                return [2 /*return*/, exports.calculateRateFromPaths(paths, rate)];
        }
    });
}); };
function calculateRateFromPath(paths, amount) {
    return __awaiter(this, void 0, void 0, function () {
        var blockchainType, convertPairs, i, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    blockchainType = paths.paths[0].type;
                    return [4 /*yield*/, getConverterPairs(paths.paths[0].path, blockchainType)];
                case 1:
                    convertPairs = _b.sent();
                    i = 0;
                    _b.label = 2;
                case 2:
                    if (!(i < convertPairs.length)) return [3 /*break*/, 7];
                    if (!(blockchainType == 'ethereum')) return [3 /*break*/, 4];
                    return [4 /*yield*/, index_1.getPathStepRate(convertPairs[i], amount)];
                case 3:
                    _a = _b.sent();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, eos_1.getPathStepRate(convertPairs[i], amount)];
                case 5:
                    _a = _b.sent();
                    _b.label = 6;
                case 6:
                    amount = _a;
                    i += 1;
                    return [3 /*break*/, 2];
                case 7: return [2 /*return*/, amount];
            }
        });
    });
}
exports.calculateRateFromPath = calculateRateFromPath;
function getConverterPairs(path, blockchainType) {
    return __awaiter(this, void 0, void 0, function () {
        var pairs, i, converterBlockchainId, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    pairs = [];
                    i = 0;
                    _b.label = 1;
                case 1:
                    if (!(i < path.length - 1)) return [3 /*break*/, 6];
                    if (!(blockchainType == 'ethereum')) return [3 /*break*/, 3];
                    return [4 /*yield*/, index_1.getConverterBlockchainId(path[i + 1])];
                case 2:
                    _a = _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = path[i + 1];
                    _b.label = 4;
                case 4:
                    converterBlockchainId = _a;
                    pairs.push({ converterBlockchainId: converterBlockchainId, fromToken: path[i], toToken: path[i + 2] });
                    _b.label = 5;
                case 5:
                    i += 2;
                    return [3 /*break*/, 1];
                case 6:
                    if (pairs.length == 0 && blockchainType == 'eos' && eos_1.isMultiConverter(path[0])) {
                        pairs.push({
                            converterBlockchainId: path[0], fromToken: path[0], toToken: path[0]
                        });
                    }
                    return [2 /*return*/, pairs];
            }
        });
    });
}
exports.getRateByPath = function (paths, amount) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.calculateRateFromPaths(paths, amount)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
function getRate(sourceToken, targetToken, amount) {
    return __awaiter(this, void 0, void 0, function () {
        var paths;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, generatePath(sourceToken, targetToken)];
                case 1:
                    paths = _a.sent();
                    return [4 /*yield*/, exports.getRateByPath(paths, amount)];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.getRate = getRate;
function getAllPathsAndRates(sourceToken, targetToken, amount) {
    if (amount === void 0) { amount = "1"; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(sourceToken.blockchainType == 'ethereum' && targetToken.blockchainType == 'ethereum')) return [3 /*break*/, 2];
                    return [4 /*yield*/, index_1.getAllPathsAndRates(sourceToken.blockchainId, targetToken.blockchainId, amount)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2: throw new Error(sourceToken.blockchainType + ' blockchain to ' + targetToken.blockchainType + ' blockchain not supported');
            }
        });
    });
}
exports.getAllPathsAndRates = getAllPathsAndRates;
function getEthShortestPath(paths, rates) {
    var index = 0;
    for (var i = 1; i < paths.length; i++) {
        if (shorterPath(paths, index, i) || (equalPath(paths, index, i) && cheaperRate(rates, index, i)))
            index = i;
    }
    return paths[index];
}
exports.getEthShortestPath = getEthShortestPath;
function getEthCheapestPath(paths, rates) {
    var index = 0;
    for (var i = 1; i < rates.length; i++) {
        if (cheaperRate(rates, index, i) || (equalRate(rates, index, i) && shorterPath(paths, index, i)))
            index = i;
    }
    return paths[index];
}
exports.getEthCheapestPath = getEthCheapestPath;
function shorterPath(paths, index1, index2) {
    return paths[index1].length > paths[index2].length;
}
function cheaperRate(rates, index1, index2) {
    // return Number(rates[index1]) < Number(rates[index2]);
    var rate1Parts = rates[index1].split(".").concat("");
    var rate2Parts = rates[index2].split(".").concat("");
    rate1Parts[0] = rate1Parts[0].padStart(rate2Parts[0].length, "0");
    rate2Parts[0] = rate2Parts[0].padStart(rate1Parts[0].length, "0");
    rate1Parts[1] = rate1Parts[1].padEnd(rate2Parts[1].length, "0");
    rate2Parts[1] = rate2Parts[1].padEnd(rate1Parts[1].length, "0");
    return rate1Parts.join("").localeCompare(rate2Parts.join("")) == -1;
}
function equalPath(paths, index1, index2) {
    return paths[index1].length == paths[index2].length;
}
function equalRate(rates, index1, index2) {
    return rates[index1] == rates[index2];
}
exports.default = {
    init: init,
    generateEosPaths: generateEosPaths,
    getRate: getRate,
    generatePath: generatePath,
    getRateByPath: exports.getRateByPath,
    buildPathsFile: eos_1.buildPathsFile,
    getAllPathsAndRates: getAllPathsAndRates,
    getEthShortestPath: getEthShortestPath,
    getEthCheapestPath: getEthCheapestPath
};
