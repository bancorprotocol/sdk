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
var utils = __importStar(require("./utils"));
var conversion_events = __importStar(require("./conversion_events"));
var converter_version = __importStar(require("./converter_version"));
var CONTRACT_ADDRESSES = {
    main: {
        registry: '0x52Ae12ABe5D8BD778BD5397F99cA900624CfADD4',
        multicall: '0x5Eb3fa2DFECdDe21C950813C665E9364fa609bD2',
        anchorToken: '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C',
    },
    ropsten: {
        registry: '0xFD95E724962fCfC269010A0c6700Aa09D5de3074',
        multicall: '0xf3ad7e31b052ff96566eedd218a823430e74b406',
        anchorToken: '0x62bd9D98d4E188e281D7B78e29334969bbE1053c',
    }
};
var ContractRegistry = [
    { "constant": true, "inputs": [{ "name": "_contractName", "type": "bytes32" }], "name": "addressOf", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }
];
var BancorNetwork = [
    { "constant": true, "inputs": [{ "name": "_path", "type": "address[]" }, { "name": "_amount", "type": "uint256" }], "name": "getReturnByPath", "outputs": [{ "name": "", "type": "uint256" }, { "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }
];
var BancorConverterRegistry = [
    { "constant": true, "inputs": [], "name": "getConvertibleTokens", "outputs": [{ "name": "", "type": "address[]" }], "payable": false, "stateMutability": "view", "type": "function" },
    { "constant": true, "inputs": [{ "name": "_convertibleToken", "type": "address" }], "name": "getConvertibleTokenSmartTokens", "outputs": [{ "name": "", "type": "address[]" }], "payable": false, "stateMutability": "view", "type": "function" }
];
var ERC20Token = [
    { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }
];
var MulticallContract = [
    { "constant": false, "inputs": [{ "components": [{ "internalType": "address", "name": "target", "type": "address" }, { "internalType": "bytes", "name": "callData", "type": "bytes" }], "internalType": "struct Multicall.Call[]", "name": "calls", "type": "tuple[]" }, { "internalType": "bool", "name": "strict", "type": "bool" }], "name": "aggregate", "outputs": [{ "internalType": "uint256", "name": "blockNumber", "type": "uint256" }, { "components": [{ "internalType": "bool", "name": "success", "type": "bool" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "internalType": "struct Multicall.Return[]", "name": "returnData", "type": "tuple[]" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }
];
var ETH = /** @class */ (function () {
    function ETH(nodeAddress) {
        this.decimals = {};
        this.web3 = new web3_1.default(nodeAddress);
    }
    ETH.prototype.close = function () {
        if (this.web3.currentProvider.constructor.name == "WebsocketProvider")
            this.web3.currentProvider.connection.close();
    };
    ETH.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, contractRegistry, bancorNetworkAddress, converterRegistryAddress;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.web3.eth.net.getNetworkType()];
                    case 1:
                        _a.networkType = _b.sent();
                        contractRegistry = new this.web3.eth.Contract(ContractRegistry, exports.getContractAddresses(this).registry);
                        return [4 /*yield*/, contractRegistry.methods.addressOf(web3_1.default.utils.asciiToHex('BancorNetwork')).call()];
                    case 2:
                        bancorNetworkAddress = _b.sent();
                        return [4 /*yield*/, contractRegistry.methods.addressOf(web3_1.default.utils.asciiToHex('BancorConverterRegistry')).call()];
                    case 3:
                        converterRegistryAddress = _b.sent();
                        this.bancorNetwork = new this.web3.eth.Contract(BancorNetwork, bancorNetworkAddress);
                        this.converterRegistry = new this.web3.eth.Contract(BancorConverterRegistry, converterRegistryAddress);
                        this.multicallContract = new this.web3.eth.Contract(MulticallContract, exports.getContractAddresses(this).multicall);
                        return [2 /*return*/];
                }
            });
        });
    };
    ETH.prototype.getAnchorToken = function () {
        return exports.getContractAddresses(this).anchorToken;
    };
    ETH.prototype.getRateByPath = function (path, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var sourceDecimals, targetDecimals;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, exports.getDecimals(this, path[0])];
                    case 1:
                        sourceDecimals = _a.sent();
                        return [4 /*yield*/, exports.getDecimals(this, path[path.length - 1])];
                    case 2:
                        targetDecimals = _a.sent();
                        amount = utils.toWei(amount, sourceDecimals);
                        return [4 /*yield*/, exports.getReturn(this, path, amount)];
                    case 3:
                        amount = _a.sent();
                        amount = utils.fromWei(amount, targetDecimals);
                        return [2 /*return*/, amount];
                }
            });
        });
    };
    ETH.prototype.getAllPathsAndRates = function (sourceToken, targetToken, amount) {
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
    ETH.prototype.getConverterVersion = function (converter) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, converter_version.get(this, converter)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ETH.prototype.getConversionEvents = function (token, fromBlock, toBlock) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, conversion_events.get(this, token, fromBlock, toBlock)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ETH.prototype.getConversionEventsByTimestamp = function (token, fromTimestamp, toTimestamp) {
        return __awaiter(this, void 0, void 0, function () {
            var fromBlock, toBlock;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, utils.timestampToBlockNumber(this, fromTimestamp)];
                    case 1:
                        fromBlock = _a.sent();
                        return [4 /*yield*/, utils.timestampToBlockNumber(this, toTimestamp)];
                    case 2:
                        toBlock = _a.sent();
                        return [4 /*yield*/, conversion_events.get(this, token, fromBlock, toBlock)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return ETH;
}());
exports.ETH = ETH;
exports.getContractAddresses = function (_this) {
    if (CONTRACT_ADDRESSES[_this.networkType])
        return CONTRACT_ADDRESSES[_this.networkType];
    throw new Error(_this.networkType + ' network not supported');
};
exports.getReturn = function (_this, path, amount) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, _this.bancorNetwork.methods.getReturnByPath(path, amount).call()];
                case 1: return [2 /*return*/, (_a.sent())['0']];
            }
        });
    });
};
exports.getDecimals = function (_this, token) {
    return __awaiter(this, void 0, void 0, function () {
        var tokenContract, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!(_this.decimals[token] == undefined)) return [3 /*break*/, 2];
                    tokenContract = new _this.web3.eth.Contract(ERC20Token, token);
                    _a = _this.decimals;
                    _b = token;
                    return [4 /*yield*/, tokenContract.methods.decimals().call()];
                case 1:
                    _a[_b] = _c.sent();
                    _c.label = 2;
                case 2: return [2 /*return*/, _this.decimals[token]];
            }
        });
    });
};
exports.getRates = function (_this, paths, amount) {
    return __awaiter(this, void 0, void 0, function () {
        var calls, _a, blockNumber, returnData;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    calls = paths.map(function (path) { return [_this.bancorNetwork._address, _this.bancorNetwork.methods.getReturnByPath(path, amount).encodeABI()]; });
                    return [4 /*yield*/, _this.multicallContract.methods.aggregate(calls, false).call()];
                case 1:
                    _a = _b.sent(), blockNumber = _a[0], returnData = _a[1];
                    return [2 /*return*/, returnData.map(function (item) { return item.success ? web3_1.default.utils.toBN(item.data.substr(0, 66)).toString() : "0"; })];
            }
        });
    });
};
exports.getGraph = function (_this) {
    return __awaiter(this, void 0, void 0, function () {
        var graph, convertibleTokens, calls, _a, blockNumber, returnData, _loop_1, i;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    graph = {};
                    return [4 /*yield*/, _this.converterRegistry.methods.getConvertibleTokens().call()];
                case 1:
                    convertibleTokens = _b.sent();
                    calls = convertibleTokens.map(function (convertibleToken) { return [_this.converterRegistry._address, _this.converterRegistry.methods.getConvertibleTokenSmartTokens(convertibleToken).encodeABI()]; });
                    return [4 /*yield*/, _this.multicallContract.methods.aggregate(calls, true).call()];
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
