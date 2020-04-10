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
var web3_1 = __importDefault(require("web3"));
var abis = __importStar(require("./abis"));
var utils = __importStar(require("../../utils"));
var conversionEvents = __importStar(require("./conversion_events"));
var converterVersion = __importStar(require("./converter_version"));
var timestamp_to_block_number_1 = require("./timestamp_to_block_number");
var CONTRACT_ADDRESSES = {
    main: {
        registry: '0x52Ae12ABe5D8BD778BD5397F99cA900624CfADD4',
        multicall: '0x5Eb3fa2DFECdDe21C950813C665E9364fa609bD2',
        anchorToken: '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C',
        nonStandardTokenDecimals: {
            '0xE0B7927c4aF23765Cb51314A0E0521A9645F0E2A': '9',
            '0xbdEB4b83251Fb146687fa19D1C660F99411eefe3': '18'
        }
    },
    ropsten: {
        registry: '0xFD95E724962fCfC269010A0c6700Aa09D5de3074',
        multicall: '0xf3ad7e31b052ff96566eedd218a823430e74b406',
        anchorToken: '0x62bd9D98d4E188e281D7B78e29334969bbE1053c',
        nonStandardTokenDecimals: {}
    }
};
var Ethereum = /** @class */ (function () {
    function Ethereum() {
    }
    Ethereum.create = function (nodeEndpoint) {
        return __awaiter(this, void 0, void 0, function () {
            var ethereum, _a, contractRegistry, bancorNetworkAddress, converterRegistryAddress;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        ethereum = new Ethereum();
                        ethereum.web3 = exports.getWeb3(nodeEndpoint);
                        _a = ethereum;
                        return [4 /*yield*/, ethereum.web3.eth.net.getNetworkType()];
                    case 1:
                        _a.networkType = _b.sent();
                        contractRegistry = new ethereum.web3.eth.Contract(abis.ContractRegistry, exports.getContractAddresses(ethereum).registry);
                        return [4 /*yield*/, contractRegistry.methods.addressOf(web3_1.default.utils.asciiToHex('BancorNetwork')).call()];
                    case 2:
                        bancorNetworkAddress = _b.sent();
                        return [4 /*yield*/, contractRegistry.methods.addressOf(web3_1.default.utils.asciiToHex('BancorConverterRegistry')).call()];
                    case 3:
                        converterRegistryAddress = _b.sent();
                        ethereum.bancorNetwork = new ethereum.web3.eth.Contract(abis.BancorNetwork, bancorNetworkAddress);
                        ethereum.converterRegistry = new ethereum.web3.eth.Contract(abis.BancorConverterRegistry, converterRegistryAddress);
                        ethereum.multicallContract = new ethereum.web3.eth.Contract(abis.MulticallContract, exports.getContractAddresses(ethereum).multicall);
                        ethereum.decimals = __assign({}, CONTRACT_ADDRESSES[ethereum.networkType].nonStandardTokenDecimals);
                        return [2 /*return*/, ethereum];
                }
            });
        });
    };
    Ethereum.destroy = function (ethereum) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (ethereum.web3.currentProvider && ethereum.web3.currentProvider.constructor.name == 'WebsocketProvider')
                    ethereum.web3.currentProvider.connection.close();
                return [2 /*return*/];
            });
        });
    };
    Ethereum.prototype.getAnchorToken = function () {
        return exports.getContractAddresses(this).anchorToken;
    };
    Ethereum.prototype.getRateByPath = function (path, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var tokens, sourceDecimals, targetDecimals;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokens = path.map(function (token) { return token.blockchainId; });
                        return [4 /*yield*/, exports.getDecimals(this, tokens[0])];
                    case 1:
                        sourceDecimals = _a.sent();
                        return [4 /*yield*/, exports.getDecimals(this, tokens[tokens.length - 1])];
                    case 2:
                        targetDecimals = _a.sent();
                        amount = utils.toWei(amount, sourceDecimals);
                        return [4 /*yield*/, exports.getReturn(this, tokens, amount)];
                    case 3:
                        amount = _a.sent();
                        amount = utils.fromWei(amount, targetDecimals);
                        return [2 /*return*/, amount];
                }
            });
        });
    };
    Ethereum.prototype.getAllPathsAndRates = function (sourceToken, targetToken, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var paths, graph, tokens, destToken, sourceDecimals, targetDecimals, rates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        paths = [];
                        return [4 /*yield*/, exports.getGraph(this)];
                    case 1:
                        graph = _a.sent();
                        tokens = [web3_1.default.utils.toChecksumAddress(sourceToken)];
                        destToken = web3_1.default.utils.toChecksumAddress(targetToken);
                        getAllPathsRecursive(paths, graph, tokens, destToken);
                        return [4 /*yield*/, exports.getDecimals(this, sourceToken)];
                    case 2:
                        sourceDecimals = _a.sent();
                        return [4 /*yield*/, exports.getDecimals(this, targetToken)];
                    case 3:
                        targetDecimals = _a.sent();
                        return [4 /*yield*/, exports.getRates(this, paths, utils.toWei(amount, sourceDecimals))];
                    case 4:
                        rates = _a.sent();
                        return [2 /*return*/, [paths, rates.map(function (rate) { return utils.fromWei(rate, targetDecimals); })]];
                }
            });
        });
    };
    Ethereum.prototype.getConverterVersion = function (converter) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, converterVersion.get(this.web3, converter.blockchainId)];
                    case 1: return [2 /*return*/, (_a.sent()).value];
                }
            });
        });
    };
    Ethereum.prototype.getConversionEvents = function (token, fromBlock, toBlock) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, conversionEvents.get(this.web3, this.decimals, token.blockchainId, fromBlock, toBlock)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Ethereum.prototype.getConversionEventsByTimestamp = function (token, fromTimestamp, toTimestamp) {
        return __awaiter(this, void 0, void 0, function () {
            var fromBlock, toBlock;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, timestamp_to_block_number_1.timestampToBlockNumber(this.web3, fromTimestamp)];
                    case 1:
                        fromBlock = _a.sent();
                        return [4 /*yield*/, timestamp_to_block_number_1.timestampToBlockNumber(this.web3, toTimestamp)];
                    case 2:
                        toBlock = _a.sent();
                        return [4 /*yield*/, conversionEvents.get(this.web3, this.decimals, token.blockchainId, fromBlock, toBlock)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return Ethereum;
}());
exports.Ethereum = Ethereum;
exports.getWeb3 = function (nodeEndpoint) {
    var web3 = new web3_1.default();
    web3.setProvider(nodeEndpoint);
    return web3;
};
exports.getContractAddresses = function (ethereum) {
    if (CONTRACT_ADDRESSES[ethereum.networkType])
        return CONTRACT_ADDRESSES[ethereum.networkType];
    throw new Error(ethereum.networkType + ' network not supported');
};
exports.getReturn = function (ethereum, path, amount) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ethereum.bancorNetwork.methods.getReturnByPath(path, amount).call()];
                case 1: return [2 /*return*/, (_a.sent())['0']];
            }
        });
    });
};
exports.getDecimals = function (ethereum, token) {
    return __awaiter(this, void 0, void 0, function () {
        var tokenContract, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!(ethereum.decimals[token] == undefined)) return [3 /*break*/, 2];
                    tokenContract = new ethereum.web3.eth.Contract(abis.ERC20Token, token);
                    _a = ethereum.decimals;
                    _b = token;
                    return [4 /*yield*/, tokenContract.methods.decimals().call()];
                case 1:
                    _a[_b] = _c.sent();
                    _c.label = 2;
                case 2: return [2 /*return*/, ethereum.decimals[token]];
            }
        });
    });
};
exports.getRates = function (ethereum, paths, amount) {
    return __awaiter(this, void 0, void 0, function () {
        var calls, _a, blockNumber, returnData;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    calls = paths.map(function (path) { return [ethereum.bancorNetwork._address, ethereum.bancorNetwork.methods.getReturnByPath(path, amount).encodeABI()]; });
                    return [4 /*yield*/, ethereum.multicallContract.methods.aggregate(calls, false).call()];
                case 1:
                    _a = _b.sent(), blockNumber = _a[0], returnData = _a[1];
                    return [2 /*return*/, returnData.map(function (item) { return item.success ? web3_1.default.utils.toBN(item.data.substr(0, 66)).toString() : '0'; })];
            }
        });
    });
};
exports.getGraph = function (ethereum) {
    return __awaiter(this, void 0, void 0, function () {
        var graph, convertibleTokens, calls, _a, blockNumber, returnData, _loop_1, i;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    graph = {};
                    return [4 /*yield*/, ethereum.converterRegistry.methods.getConvertibleTokens().call()];
                case 1:
                    convertibleTokens = _b.sent();
                    calls = convertibleTokens.map(function (convertibleToken) { return [ethereum.converterRegistry._address, ethereum.converterRegistry.methods.getConvertibleTokenSmartTokens(convertibleToken).encodeABI()]; });
                    return [4 /*yield*/, ethereum.multicallContract.methods.aggregate(calls, true).call()];
                case 2:
                    _a = _b.sent(), blockNumber = _a[0], returnData = _a[1];
                    _loop_1 = function (i) {
                        for (var _i = 0, _a = Array.from(Array((returnData[i].data.length - 130) / 64).keys()).map(function (n) { return web3_1.default.utils.toChecksumAddress(returnData[i].data.substr(64 * n + 154, 40)); }); _i < _a.length; _i++) {
                            var smartToken = _a[_i];
                            if (convertibleTokens[i] != smartToken) {
                                updateGraph(graph, convertibleTokens[i], smartToken);
                                updateGraph(graph, smartToken, convertibleTokens[i]);
                            }
                        }
                    };
                    for (i = 0; i < returnData.length; i++) {
                        _loop_1(i);
                    }
                    return [2 /*return*/, graph];
            }
        });
    });
};
function updateGraph(graph, key, value) {
    if (graph[key] == undefined)
        graph[key] = [value];
    else if (!graph[key].includes(value))
        graph[key].push(value);
}
function getAllPathsRecursive(paths, graph, tokens, destToken) {
    var prevToken = tokens[tokens.length - 1];
    if (prevToken == destToken)
        paths.push(tokens);
    else
        for (var _i = 0, _a = graph[prevToken].filter(function (token) { return !tokens.includes(token); }); _i < _a.length; _i++) {
            var nextToken = _a[_i];
            getAllPathsRecursive(paths, graph, __spreadArrays(tokens, [nextToken]), destToken);
        }
}
