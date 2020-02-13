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
/* eslint-disable max-len */
/* eslint-disable no-sync */
/* eslint-disable prefer-reflect */
var web3_1 = __importDefault(require("web3"));
var BancorConverterV9_1 = require("./contracts/BancorConverterV9");
var utils_1 = require("./utils");
var BancorConverter_1 = require("./contracts/BancorConverter");
var ContractRegistry_1 = require("./contracts/ContractRegistry");
var BancorConverterRegistry_1 = require("./contracts/BancorConverterRegistry");
var SmartToken_1 = require("./contracts/SmartToken");
var ERC20Token_1 = require("./contracts/ERC20Token");
var retrieve_contract_version = __importStar(require("./retrieve_contract_version"));
var fetch_conversion_events = __importStar(require("./fetch_conversion_events"));
var web3;
var registry;
exports.anchorToken = {
    blockchainType: 'ethereum',
    blockchainId: '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C'
};
function init(ethereumNodeUrl, ethereumContractRegistryAddress) {
    return __awaiter(this, void 0, void 0, function () {
        var contractRegistryContract, registryBlockchainId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    web3 = new web3_1.default(new web3_1.default.providers.HttpProvider(ethereumNodeUrl));
                    contractRegistryContract = new web3.eth.Contract(ContractRegistry_1.ContractRegistry, ethereumContractRegistryAddress);
                    return [4 /*yield*/, contractRegistryContract.methods.addressOf(web3_1.default.utils.asciiToHex('BancorConverterRegistry')).call()];
                case 1:
                    registryBlockchainId = _a.sent();
                    registry = new web3.eth.Contract(BancorConverterRegistry_1.BancorConverterRegistry, registryBlockchainId);
                    return [2 /*return*/];
            }
        });
    });
}
exports.init = init;
exports.getAmountInTokenWei = function (token, amount, web3) { return __awaiter(void 0, void 0, void 0, function () {
    var tokenContract, decimals;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                tokenContract = new web3.eth.Contract(ERC20Token_1.ERC20Token, token);
                return [4 /*yield*/, tokenContract.methods.decimals().call()];
            case 1:
                decimals = _a.sent();
                return [2 /*return*/, utils_1.toWei(amount, decimals)];
        }
    });
}); };
exports.getConversionReturn = function (converterPair, amount, ABI, web3) { return __awaiter(void 0, void 0, void 0, function () {
    var converterContract, returnAmount;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                converterContract = new web3.eth.Contract(ABI, converterPair.converterBlockchainId);
                return [4 /*yield*/, converterContract.methods.getReturn(converterPair.fromToken, converterPair.toToken, amount).call()];
            case 1:
                returnAmount = _a.sent();
                return [2 /*return*/, returnAmount];
        }
    });
}); };
function getPathStepRate(converterPair, amount) {
    return __awaiter(this, void 0, void 0, function () {
        var amountInTokenWei, tokenContract, tokenDecimals, returnAmount, error_1, returnAmount;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.getAmountInTokenWei(converterPair.fromToken, amount, web3)];
                case 1:
                    amountInTokenWei = _a.sent();
                    tokenContract = new web3.eth.Contract(ERC20Token_1.ERC20Token, converterPair.toToken);
                    return [4 /*yield*/, tokenContract.methods.decimals().call()];
                case 2:
                    tokenDecimals = _a.sent();
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 8]);
                    return [4 /*yield*/, exports.getConversionReturn(converterPair, amountInTokenWei, BancorConverter_1.BancorConverter, web3)];
                case 4:
                    returnAmount = _a.sent();
                    return [2 /*return*/, utils_1.fromWei(returnAmount['0'], tokenDecimals)];
                case 5:
                    error_1 = _a.sent();
                    if (!error_1.message.includes('insufficient data for uint256')) return [3 /*break*/, 7];
                    return [4 /*yield*/, exports.getConversionReturn(converterPair, amountInTokenWei, BancorConverterV9_1.BancorConverterV9, web3)];
                case 6:
                    returnAmount = _a.sent();
                    return [2 /*return*/, utils_1.fromWei(returnAmount, tokenDecimals)];
                case 7: throw error_1;
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.getPathStepRate = getPathStepRate;
function getConverterBlockchainId(tokenBlockchainId) {
    return __awaiter(this, void 0, void 0, function () {
        var tokenContract;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tokenContract = new web3.eth.Contract(SmartToken_1.SmartToken, tokenBlockchainId);
                    return [4 /*yield*/, tokenContract.methods.owner().call()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.getConverterBlockchainId = getConverterBlockchainId;
function retrieveContractVersion(contract) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, retrieve_contract_version.run(web3, contract)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.retrieveContractVersion = retrieveContractVersion;
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
                case 0: return [4 /*yield*/, utils_1.timestampToBlockNumber(web3, fromTimestamp)];
                case 1:
                    fromBlock = _a.sent();
                    return [4 /*yield*/, utils_1.timestampToBlockNumber(web3, toTimestamp)];
                case 2:
                    toBlock = _a.sent();
                    return [4 /*yield*/, fetch_conversion_events.run(web3, token, fromBlock, toBlock)];
                case 3: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.fetchConversionEventsByTimestamp = fetchConversionEventsByTimestamp;
function registryDataUpdate(registryData, key, value) {
    if (registryData[key] == undefined)
        registryData[key] = [value];
    else if (!registryData[key].includes(value))
        registryData[key].push(value);
}
function getAllPathsRecursive(paths, path, targetToken, registryData) {
    var prevToken = path[path.length - 1];
    if (prevToken == targetToken)
        paths.push(path);
    else
        for (var _i = 0, _a = registryData[prevToken].filter(function (token) { return !path.includes(token); }); _i < _a.length; _i++) {
            var nextToken = _a[_i];
            getAllPathsRecursive(paths, __spreadArrays(path, [nextToken]), targetToken, registryData);
        }
}
function getAllPaths(sourceToken, targetToken) {
    return __awaiter(this, void 0, void 0, function () {
        var MULTICALL_ABI, MULTICALL_ADDRESS, multicall, convertibleTokens, calls, _a, blockNumber, returnData, registryData, _loop_1, i, paths;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    MULTICALL_ABI = [{ "constant": false, "inputs": [{ "components": [{ "internalType": "address", "name": "target", "type": "address" }, { "internalType": "bytes", "name": "callData", "type": "bytes" }], "internalType": "struct Multicall.Call[]", "name": "calls", "type": "tuple[]" }, { "internalType": "bool", "name": "strict", "type": "bool" }], "name": "aggregate", "outputs": [{ "internalType": "uint256", "name": "blockNumber", "type": "uint256" }, { "components": [{ "internalType": "bool", "name": "success", "type": "bool" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "internalType": "struct Multicall.Return[]", "name": "returnData", "type": "tuple[]" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }];
                    MULTICALL_ADDRESS = '0x5Eb3fa2DFECdDe21C950813C665E9364fa609bD2';
                    multicall = new web3.eth.Contract(MULTICALL_ABI, MULTICALL_ADDRESS);
                    return [4 /*yield*/, registry.methods.getConvertibleTokens().call()];
                case 1:
                    convertibleTokens = _b.sent();
                    calls = convertibleTokens.map(function (convertibleToken) { return [registry._address, registry.methods.getConvertibleTokenSmartTokens(convertibleToken).encodeABI()]; });
                    return [4 /*yield*/, multicall.methods.aggregate(calls, true).call()];
                case 2:
                    _a = _b.sent(), blockNumber = _a[0], returnData = _a[1];
                    registryData = {};
                    _loop_1 = function (i) {
                        for (var _i = 0, _a = Array.from(Array((returnData[i].data.length - 130) / 64).keys()).map(function (n) { return web3_1.default.utils.toChecksumAddress(returnData[i].data.substr(64 * n + 154, 40)); }); _i < _a.length; _i++) {
                            var smartToken = _a[_i];
                            if (convertibleTokens[i] != smartToken) {
                                registryDataUpdate(registryData, convertibleTokens[i], smartToken);
                                registryDataUpdate(registryData, smartToken, convertibleTokens[i]);
                            }
                        }
                    };
                    for (i = 0; i < returnData.length; i++) {
                        _loop_1(i);
                    }
                    paths = [];
                    getAllPathsRecursive(paths, [sourceToken], targetToken, registryData);
                    return [2 /*return*/, paths];
            }
        });
    });
}
exports.getAllPaths = getAllPaths;
