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
var ContractRegistry_1 = require("./contracts/ContractRegistry");
var BancorConverter_1 = require("./contracts/BancorConverter");
var BancorConverterV9_1 = require("./contracts/BancorConverterV9");
var BancorConverterRegistry_1 = require("./contracts/BancorConverterRegistry");
var ERC20Token_1 = require("./contracts/ERC20Token");
var SmartToken_1 = require("./contracts/SmartToken");
var utils = __importStar(require("./utils"));
var retrieve_converter_version = __importStar(require("./retrieve_converter_version"));
var fetch_conversion_events = __importStar(require("./fetch_conversion_events"));
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
var MULTICALL_CONTRACT_ABI = [{ "constant": false, "inputs": [{ "components": [{ "internalType": "address", "name": "target", "type": "address" }, { "internalType": "bytes", "name": "callData", "type": "bytes" }], "internalType": "struct Multicall.Call[]", "name": "calls", "type": "tuple[]" }, { "internalType": "bool", "name": "strict", "type": "bool" }], "name": "aggregate", "outputs": [{ "internalType": "uint256", "name": "blockNumber", "type": "uint256" }, { "components": [{ "internalType": "bool", "name": "success", "type": "bool" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "internalType": "struct Multicall.Return[]", "name": "returnData", "type": "tuple[]" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }];
var web3;
var networkType;
var converterRegistryAddress;
function init(nodeAddress) {
    return __awaiter(this, void 0, void 0, function () {
        var contractRegistry;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    web3 = new web3_1.default(new web3_1.default.providers.HttpProvider(nodeAddress));
                    return [4 /*yield*/, web3.eth.net.getNetworkType()];
                case 1:
                    networkType = _a.sent();
                    contractRegistry = new web3.eth.Contract(ContractRegistry_1.ContractRegistry, exports.getContractAddresses().registry);
                    return [4 /*yield*/, contractRegistry.methods.addressOf(web3_1.default.utils.asciiToHex('BancorConverterRegistry')).call()];
                case 2:
                    converterRegistryAddress = _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.init = init;
function getAnchorToken() {
    return exports.getContractAddresses().anchorToken;
}
exports.getAnchorToken = getAnchorToken;
function getRateByPath(path, amount) {
    return __awaiter(this, void 0, void 0, function () {
        var i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.toWei(path[0], amount)];
                case 1:
                    amount = _a.sent();
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < path.length - 1)) return [3 /*break*/, 5];
                    return [4 /*yield*/, exports.getReturn(path[i + 1], path[i], path[i + 2], amount)];
                case 3:
                    amount = _a.sent();
                    _a.label = 4;
                case 4:
                    i += 2;
                    return [3 /*break*/, 2];
                case 5: return [4 /*yield*/, exports.fromWei(path[path.length - 1], amount)];
                case 6: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.getRateByPath = getRateByPath;
function getAllPaths(sourceToken, targetToken) {
    return __awaiter(this, void 0, void 0, function () {
        var paths, graph, tokens, destToken;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    paths = [];
                    return [4 /*yield*/, exports.getGraph()];
                case 1:
                    graph = _a.sent();
                    tokens = [web3_1.default.utils.toChecksumAddress(sourceToken)];
                    destToken = web3_1.default.utils.toChecksumAddress(targetToken);
                    getAllPathsRecursive(paths, graph, tokens, destToken);
                    return [2 /*return*/, paths];
            }
        });
    });
}
exports.getAllPaths = getAllPaths;
function retrieveConverterVersion(converter) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, retrieve_converter_version.run(web3, converter)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.retrieveConverterVersion = retrieveConverterVersion;
function fetchConversionEvents(token, fromBlock, toBlock) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch_conversion_events.run(web3, token, fromBlock, toBlock)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.fetchConversionEvents = fetchConversionEvents;
function fetchConversionEventsByTimestamp(token, fromTimestamp, toTimestamp) {
    return __awaiter(this, void 0, void 0, function () {
        var fromBlock, toBlock;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, utils.timestampToBlockNumber(web3, fromTimestamp)];
                case 1:
                    fromBlock = _a.sent();
                    return [4 /*yield*/, utils.timestampToBlockNumber(web3, toTimestamp)];
                case 2:
                    toBlock = _a.sent();
                    return [4 /*yield*/, fetch_conversion_events.run(web3, token, fromBlock, toBlock)];
                case 3: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.fetchConversionEventsByTimestamp = fetchConversionEventsByTimestamp;
exports.getContractAddresses = function () {
    if (CONTRACT_ADDRESSES.hasOwnProperty(networkType))
        return CONTRACT_ADDRESSES[networkType];
    throw new Error(networkType + ' network not supported');
};
exports.toWei = function (token, amount) {
    return __awaiter(this, void 0, void 0, function () {
        var tokenContract, decimals;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tokenContract = new web3.eth.Contract(ERC20Token_1.ERC20Token, token);
                    return [4 /*yield*/, tokenContract.methods.decimals().call()];
                case 1:
                    decimals = _a.sent();
                    return [2 /*return*/, utils.toWei(amount, decimals)];
            }
        });
    });
};
exports.fromWei = function (token, amount) {
    return __awaiter(this, void 0, void 0, function () {
        var tokenContract, decimals;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tokenContract = new web3.eth.Contract(ERC20Token_1.ERC20Token, token);
                    return [4 /*yield*/, tokenContract.methods.decimals().call()];
                case 1:
                    decimals = _a.sent();
                    return [2 /*return*/, utils.fromWei(amount, decimals)];
            }
        });
    });
};
exports.getReturn = function (smartToken, fromToken, toToken, amount) {
    return __awaiter(this, void 0, void 0, function () {
        var tokenContract, converterAddress, converterContract, error_1, converterContract;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tokenContract = new web3.eth.Contract(SmartToken_1.SmartToken, smartToken);
                    return [4 /*yield*/, tokenContract.methods.owner().call()];
                case 1:
                    converterAddress = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 6]);
                    converterContract = new web3.eth.Contract(BancorConverter_1.BancorConverter, converterAddress);
                    return [4 /*yield*/, converterContract.methods.getReturn(fromToken, toToken, amount).call()];
                case 3: return [2 /*return*/, (_a.sent())['0']];
                case 4:
                    error_1 = _a.sent();
                    if (!error_1.message.includes('insufficient data for uint256'))
                        throw error_1;
                    converterContract = new web3.eth.Contract(BancorConverterV9_1.BancorConverterV9, converterAddress);
                    return [4 /*yield*/, converterContract.methods.getReturn(fromToken, toToken, amount).call()];
                case 5: return [2 /*return*/, (_a.sent())];
                case 6: return [2 /*return*/];
            }
        });
    });
};
exports.getGraph = function () {
    return __awaiter(this, void 0, void 0, function () {
        var graph, multicallContract, converterRegistry, convertibleTokens, calls, _a, blockNumber, returnData, _loop_1, i;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    graph = {};
                    multicallContract = new web3.eth.Contract(MULTICALL_CONTRACT_ABI, exports.getContractAddresses().multicall);
                    converterRegistry = new web3.eth.Contract(BancorConverterRegistry_1.BancorConverterRegistry, converterRegistryAddress);
                    return [4 /*yield*/, converterRegistry.methods.getConvertibleTokens().call()];
                case 1:
                    convertibleTokens = _b.sent();
                    calls = convertibleTokens.map(function (convertibleToken) { return [converterRegistry._address, converterRegistry.methods.getConvertibleTokenSmartTokens(convertibleToken).encodeABI()]; });
                    return [4 /*yield*/, multicallContract.methods.aggregate(calls, true).call()];
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
