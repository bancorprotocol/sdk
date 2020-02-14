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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var eos = __importStar(require("./blockchains/eos/index"));
var ethereum = __importStar(require("./blockchains/ethereum/index"));
function init(args) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (args.eosNodeEndpoint)
                        eos.init(args.eosNodeEndpoint);
                    if (!args.ethereumNodeEndpoint) return [3 /*break*/, 2];
                    return [4 /*yield*/, ethereum.init(args.ethereumNodeEndpoint, args.ethereumContractRegistryAddress)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
exports.init = init;
function buildPathsFile() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, eos.buildPathsFile()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.buildPathsFile = buildPathsFile;
function generatePath(sourceToken, targetToken) {
    return __awaiter(this, void 0, void 0, function () {
        var eosPath, ethPaths, ethShortestPath, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    ethShortestPath = function (paths) { return paths.reduce(function (a, b) { return a.length < b.length ? a : b; }).map(function (x) { return ({ blockchainType: 'ethereum', blockchainId: x }); }); };
                    _a = sourceToken.blockchainType + ',' + targetToken.blockchainType;
                    switch (_a) {
                        case 'eos,eos': return [3 /*break*/, 1];
                        case 'ethereum,ethereum': return [3 /*break*/, 3];
                        case 'eos,ethereum': return [3 /*break*/, 5];
                        case 'ethereum,eos': return [3 /*break*/, 8];
                    }
                    return [3 /*break*/, 11];
                case 1: return [4 /*yield*/, eos.getConversionPath(sourceToken, targetToken)];
                case 2:
                    eosPath = _b.sent();
                    return [2 /*return*/, [eosPath]];
                case 3: return [4 /*yield*/, ethereum.getAllPaths(sourceToken.blockchainId, targetToken.blockchainId)];
                case 4:
                    ethPaths = _b.sent();
                    return [2 /*return*/, [ethShortestPath(ethPaths)]];
                case 5: return [4 /*yield*/, eos.getConversionPath(sourceToken, eos.anchorToken)];
                case 6:
                    eosPath = _b.sent();
                    return [4 /*yield*/, ethereum.getAllPaths(ethereum.anchorToken, targetToken.blockchainId)];
                case 7:
                    ethPaths = _b.sent();
                    return [2 /*return*/, [eosPath, ethShortestPath(ethPaths)]];
                case 8: return [4 /*yield*/, ethereum.getAllPaths(sourceToken.blockchainId, ethereum.anchorToken)];
                case 9:
                    ethPaths = _b.sent();
                    return [4 /*yield*/, eos.getConversionPath(eos.anchorToken, targetToken)];
                case 10:
                    eosPath = _b.sent();
                    return [2 /*return*/, [ethShortestPath(ethPaths), eosPath]];
                case 11: return [2 /*return*/, []];
            }
        });
    });
}
exports.generatePath = generatePath;
function getRateByPath(paths, amount) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, paths_1, path, _a, i, i;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _i = 0, paths_1 = paths;
                    _b.label = 1;
                case 1:
                    if (!(_i < paths_1.length)) return [3 /*break*/, 13];
                    path = paths_1[_i];
                    _a = path[0].blockchainType;
                    switch (_a) {
                        case 'eos': return [3 /*break*/, 2];
                        case 'ethereum': return [3 /*break*/, 7];
                    }
                    return [3 /*break*/, 12];
                case 2:
                    i = 0;
                    _b.label = 3;
                case 3:
                    if (!(i < path.length - 1)) return [3 /*break*/, 6];
                    return [4 /*yield*/, eos.getPathStepRate({ converter: __assign({}, path[i + 1]), fromToken: path[i], toToken: path[i + 2] }, amount)];
                case 4:
                    amount = _b.sent();
                    _b.label = 5;
                case 5:
                    i += 2;
                    return [3 /*break*/, 3];
                case 6: return [3 /*break*/, 12];
                case 7:
                    i = 0;
                    _b.label = 8;
                case 8:
                    if (!(i < path.length - 1)) return [3 /*break*/, 11];
                    return [4 /*yield*/, ethereum.getPathStepRate(path[i + 1].blockchainId, path[i].blockchainId, path[i + 2].blockchainId, amount)];
                case 9:
                    amount = _b.sent();
                    _b.label = 10;
                case 10:
                    i += 2;
                    return [3 /*break*/, 8];
                case 11: return [3 /*break*/, 12];
                case 12:
                    _i++;
                    return [3 /*break*/, 1];
                case 13: return [2 /*return*/, amount];
            }
        });
    });
}
exports.getRateByPath = getRateByPath;
function getRate(sourceToken, targetToken, amount) {
    return __awaiter(this, void 0, void 0, function () {
        var paths;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, generatePath(sourceToken, targetToken)];
                case 1:
                    paths = _a.sent();
                    return [4 /*yield*/, getRateByPath(paths, amount)];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.getRate = getRate;
function retrieveConverterVersion(converter) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(converter.blockchainType == 'ethereum')) return [3 /*break*/, 2];
                    return [4 /*yield*/, ethereum.retrieveConverterVersion(converter.blockchainId)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2: throw new Error(converter.blockchainType + ' blockchain not supported');
            }
        });
    });
}
exports.retrieveConverterVersion = retrieveConverterVersion;
function fetchConversionEvents(token, fromBlock, toBlock) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(token.blockchainType == 'ethereum')) return [3 /*break*/, 2];
                    return [4 /*yield*/, ethereum.fetchConversionEvents(token.blockchainId, fromBlock, toBlock)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2: throw new Error(token.blockchainType + ' blockchain not supported');
            }
        });
    });
}
exports.fetchConversionEvents = fetchConversionEvents;
function fetchConversionEventsByTimestamp(token, fromTimestamp, toTimestamp) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(token.blockchainType == 'ethereum')) return [3 /*break*/, 2];
                    return [4 /*yield*/, ethereum.fetchConversionEventsByTimestamp(token.blockchainId, fromTimestamp, toTimestamp)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2: throw new Error(token.blockchainType + ' blockchain not supported');
            }
        });
    });
}
exports.fetchConversionEventsByTimestamp = fetchConversionEventsByTimestamp;
function getAllPaths(sourceToken, targetToken) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(sourceToken.blockchainType == 'ethereum' && targetToken.blockchainType == 'ethereum')) return [3 /*break*/, 2];
                    return [4 /*yield*/, ethereum.getAllPaths(sourceToken.blockchainId, targetToken.blockchainId)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2: throw new Error(sourceToken.blockchainType + ' blockchain to ' + targetToken.blockchainType + ' blockchain not supported');
            }
        });
    });
}
exports.getAllPaths = getAllPaths;
exports.default = {
    init: init,
    getRate: getRate,
    generatePath: generatePath,
    getRateByPath: getRateByPath,
    buildPathsFile: buildPathsFile,
    retrieveConverterVersion: retrieveConverterVersion,
    fetchConversionEvents: fetchConversionEvents,
    fetchConversionEventsByTimestamp: fetchConversionEventsByTimestamp,
    getAllPaths: getAllPaths
};
