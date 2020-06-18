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
var helpers = __importStar(require("../../helpers"));
var conversionEvents = __importStar(require("./conversion_events"));
var converterVersion = __importStar(require("./converter_version"));
var timestamp_to_block_number_1 = require("./timestamp_to_block_number");
var types_1 = require("../../types");
var CONTRACT_ADDRESSES = {
    main: {
        registry: '0x52Ae12ABe5D8BD778BD5397F99cA900624CfADD4',
        multicall: '0x5Eb3fa2DFECdDe21C950813C665E9364fa609bD2',
        anchorToken: '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C',
        pivotTokens: [
            '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C',
            '0x309627af60F0926daa6041B8279484312f2bf060'
        ],
        nonStandardTokenDecimals: {
            '0xE0B7927c4aF23765Cb51314A0E0521A9645F0E2A': '9',
            '0xbdEB4b83251Fb146687fa19D1C660F99411eefe3': '18',
            '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE': '18'
        }
    },
    ropsten: {
        registry: '0xFD95E724962fCfC269010A0c6700Aa09D5de3074',
        multicall: '0xf3ad7e31b052ff96566eedd218a823430e74b406',
        anchorToken: '0x62bd9D98d4E188e281D7B78e29334969bbE1053c',
        pivotTokens: [
            '0x62bd9D98d4E188e281D7B78e29334969bbE1053c'
        ],
        nonStandardTokenDecimals: {}
    },
    dummy: {
        registry: '0x0000000000000000000000000000000000000000',
        multicall: '0x0000000000000000000000000000000000000000',
        anchorToken: '0x0000000000000000000000000000000000000000',
        pivotTokens: [],
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
                        ethereum.getPathsFunc = ethereum.getSomePathsFunc;
                        return [4 /*yield*/, ethereum.refresh()];
                    case 4:
                        _b.sent();
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
    Ethereum.prototype.refresh = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this;
                        _b = getGraph;
                        return [4 /*yield*/, exports.getTokens(this)];
                    case 1:
                        _a.graph = _b.apply(void 0, [_c.sent()]);
                        this.trees = getTrees(this.graph, exports.getContractAddresses(this).pivotTokens);
                        return [2 /*return*/];
                }
            });
        });
    };
    Ethereum.prototype.getAnchorToken = function () {
        return { blockchainType: types_1.BlockchainType.Ethereum, blockchainId: exports.getContractAddresses(this).anchorToken };
    };
    Ethereum.prototype.getPaths = function (sourceToken, targetToken) {
        return __awaiter(this, void 0, void 0, function () {
            var sourceAddress, targetAddress, addressPaths;
            return __generator(this, function (_a) {
                sourceAddress = web3_1.default.utils.toChecksumAddress(sourceToken.blockchainId);
                targetAddress = web3_1.default.utils.toChecksumAddress(targetToken.blockchainId);
                addressPaths = this.getPathsFunc(sourceAddress, targetAddress);
                return [2 /*return*/, addressPaths.map(function (addressPath) { return addressPath.map(function (address) { return ({ blockchainType: types_1.BlockchainType.Ethereum, blockchainId: address }); }); })];
            });
        });
    };
    Ethereum.prototype.getRates = function (tokenPaths, tokenAmount) {
        return __awaiter(this, void 0, void 0, function () {
            var addressPaths, sourceDecimals, targetDecimals, tokenRates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        addressPaths = tokenPaths.map(function (tokenPath) { return tokenPath.map(function (token) { return web3_1.default.utils.toChecksumAddress(token.blockchainId); }); });
                        return [4 /*yield*/, exports.getDecimals(this, addressPaths[0][0])];
                    case 1:
                        sourceDecimals = _a.sent();
                        return [4 /*yield*/, exports.getDecimals(this, addressPaths[0].slice(-1)[0])];
                    case 2:
                        targetDecimals = _a.sent();
                        return [4 /*yield*/, getRatesSafe(this, addressPaths, helpers.toWei(tokenAmount, sourceDecimals))];
                    case 3:
                        tokenRates = _a.sent();
                        return [2 /*return*/, tokenRates.map(function (tokenRate) { return helpers.fromWei(tokenRate, targetDecimals); })];
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
    Ethereum.prototype.getAllPathsFunc = function (sourceToken, targetToken) {
        var paths = [];
        var tokens = [web3_1.default.utils.toChecksumAddress(sourceToken)];
        var destToken = web3_1.default.utils.toChecksumAddress(targetToken);
        getAllPathsRecursive(paths, this.graph, tokens, destToken);
        return paths;
    };
    Ethereum.prototype.getSomePathsFunc = function (sourceToken, targetToken) {
        var _this = this;
        var commonTokens = this.graph[sourceToken].filter(function (token) { return _this.graph[targetToken].includes(token); });
        var paths = commonTokens.map(function (commonToken) { return [sourceToken, commonToken, targetToken]; });
        var pivotTokens = exports.getContractAddresses(this).pivotTokens;
        for (var _i = 0, pivotTokens_1 = pivotTokens; _i < pivotTokens_1.length; _i++) {
            var pivotToken1 = pivotTokens_1[_i];
            for (var _a = 0, pivotTokens_2 = pivotTokens; _a < pivotTokens_2.length; _a++) {
                var pivotToken2 = pivotTokens_2[_a];
                var sourcePath = getOnePathRecursive(this.trees[pivotToken1], sourceToken);
                var middlePath = getOnePathRecursive(this.trees[pivotToken2], pivotToken1);
                var targetPath = getOnePathRecursive(this.trees[pivotToken2], targetToken);
                paths.push(getMergedPath(sourcePath.concat(middlePath.slice(1)), targetPath));
            }
        }
        return Array.from(new Set(paths.map(function (path) { return path.join(','); }))).map(function (path) { return path.split(','); });
    };
    Ethereum.getNormalizedToken = function (token) {
        return Object.assign({}, token, { blockchainId: web3_1.default.utils.toChecksumAddress(token.blockchainId) });
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
exports.getDecimals = function (ethereum, token) {
    return __awaiter(this, void 0, void 0, function () {
        var tokenContract, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!(ethereum.decimals[token] == undefined)) return [3 /*break*/, 4];
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    tokenContract = new ethereum.web3.eth.Contract(abis.ERC20Token, token);
                    _a = ethereum.decimals;
                    _b = token;
                    return [4 /*yield*/, tokenContract.methods.decimals().call()];
                case 2:
                    _a[_b] = _d.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _c = _d.sent();
                    // falling back to 18 decimals
                    ethereum.decimals[token] = 18;
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, ethereum.decimals[token]];
            }
        });
    });
};
function getRatesSafe(ethereum, paths, amount) {
    return __awaiter(this, void 0, void 0, function () {
        var error_1, mid, arr1, arr2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 6]);
                    return [4 /*yield*/, exports.getRates(ethereum, paths, amount)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    error_1 = _a.sent();
                    if (!(paths.length > 1)) return [3 /*break*/, 5];
                    mid = paths.length >> 1;
                    return [4 /*yield*/, getRatesSafe(ethereum, paths.slice(0, mid), amount)];
                case 3:
                    arr1 = _a.sent();
                    return [4 /*yield*/, getRatesSafe(ethereum, paths.slice(mid, paths.length), amount)];
                case 4:
                    arr2 = _a.sent();
                    return [2 /*return*/, __spreadArrays(arr1, arr2)];
                case 5: return [2 /*return*/, ['0']];
                case 6: return [2 /*return*/];
            }
        });
    });
}
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
exports.getTokens = function (ethereum) {
    return __awaiter(this, void 0, void 0, function () {
        var convertibleTokens, calls, _a, blockNumber, returnData, smartTokenLists;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, ethereum.converterRegistry.methods.getConvertibleTokens().call()];
                case 1:
                    convertibleTokens = _b.sent();
                    calls = convertibleTokens.map(function (convertibleToken) { return [ethereum.converterRegistry._address, ethereum.converterRegistry.methods.getConvertibleTokenSmartTokens(convertibleToken).encodeABI()]; });
                    return [4 /*yield*/, ethereum.multicallContract.methods.aggregate(calls, true).call()];
                case 2:
                    _a = _b.sent(), blockNumber = _a[0], returnData = _a[1];
                    smartTokenLists = returnData.map(function (item) { return Array.from(Array((item.data.length - 130) / 64).keys()).map(function (n) { return web3_1.default.utils.toChecksumAddress(item.data.substr(64 * n + 154, 40)); }); });
                    return [2 /*return*/, convertibleTokens.reduce(function (obj, item, index) {
                            var _a;
                            return (__assign(__assign({}, obj), (_a = {}, _a[item] = smartTokenLists[index], _a)));
                        }, {})];
            }
        });
    });
};
function getGraph(tokens) {
    var graph = {};
    var smartTokens = {};
    for (var convertibleToken in tokens) {
        for (var _i = 0, _a = tokens[convertibleToken]; _i < _a.length; _i++) {
            var smartToken = _a[_i];
            if (smartTokens[smartToken] == undefined)
                smartTokens[smartToken] = [convertibleToken];
            else
                smartTokens[smartToken].push(convertibleToken);
        }
    }
    for (var smartToken in smartTokens) {
        for (var _b = 0, _c = smartTokens[smartToken]; _b < _c.length; _b++) {
            var convertibleToken = _c[_b];
            updateGraph(graph, smartToken, [smartToken, convertibleToken]);
            updateGraph(graph, convertibleToken, [smartToken, smartToken]);
        }
    }
    for (var smartToken in smartTokens) {
        for (var _d = 0, _e = smartTokens[smartToken]; _d < _e.length; _d++) {
            var sourceToken = _e[_d];
            for (var _f = 0, _g = smartTokens[smartToken]; _f < _g.length; _f++) {
                var targetToken = _g[_f];
                if (sourceToken != targetToken)
                    updateGraph(graph, sourceToken, [smartToken, targetToken]);
            }
        }
    }
    return graph;
}
function getTrees(graph, pivotTokens) {
    var trees = {};
    for (var _i = 0, pivotTokens_3 = pivotTokens; _i < pivotTokens_3.length; _i++) {
        var pivotToken = pivotTokens_3[_i];
        trees[pivotToken] = getTree(graph, pivotToken);
    }
    return trees;
}
function updateGraph(graph, key, value) {
    if (graph[key] == undefined)
        graph[key] = [value];
    else
        graph[key].push(value);
}
function getTree(graph, root) {
    var _a;
    var tree = (_a = {}, _a[root] = [], _a);
    var queue = [root];
    while (queue.length > 0) {
        var dst = queue.shift();
        for (var _i = 0, _b = graph[dst].filter(function (src) { return tree[src[1]] === undefined; }); _i < _b.length; _i++) {
            var src = _b[_i];
            tree[src[1]] = [src[0], dst];
            queue.push(src[1]);
        }
    }
    return tree;
}
function getAllPathsRecursive(paths, graph, tokens, destToken) {
    var prevToken = tokens[tokens.length - 1];
    if (prevToken == destToken)
        paths.push(tokens);
    else
        for (var _i = 0, _a = graph[prevToken].filter(function (pair) { return !tokens.includes(pair[1]); }); _i < _a.length; _i++) {
            var pair = _a[_i];
            getAllPathsRecursive(paths, graph, __spreadArrays(tokens, pair), destToken);
        }
}
function getOnePathRecursive(tree, token) {
    if (tree[token].length > 0)
        return __spreadArrays([token, tree[token][0]], getOnePathRecursive(tree, tree[token][1]));
    return [token];
}
function getMergedPath(sourcePath, targetPath) {
    if (sourcePath.length > 0 && targetPath.length > 0) {
        var i = sourcePath.length - 1;
        var j = targetPath.length - 1;
        while (i >= 0 && j >= 0 && sourcePath[i] == targetPath[j]) {
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
