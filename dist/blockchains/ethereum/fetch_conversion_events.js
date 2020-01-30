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
var Web3 = require("web3");
var Decimal = require("decimal.js");
var GENESIS_BLOCK_NUMBER = 3851136;
var OWNER_UPDATE_EVENT_HASH = Web3.utils.keccak256("OwnerUpdate(address,address)");
var CONVERSION_EVENT_LEGACY = [
    { "anonymous": false, "inputs": [{ "indexed": true, "name": "fromToken", "type": "address" }, { "indexed": true, "name": "toToken", "type": "address" }, { "indexed": true, "name": "trader", "type": "address" }, { "indexed": false, "name": "inputAmount", "type": "uint256" }, { "indexed": false, "name": "outputAmount", "type": "uint256" }], "name": "Change", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": true, "name": "fromToken", "type": "address" }, { "indexed": true, "name": "toToken", "type": "address" }, { "indexed": true, "name": "trader", "type": "address" }, { "indexed": false, "name": "inputAmount", "type": "uint256" }, { "indexed": false, "name": "outputAmount", "type": "uint256" }, { "indexed": false, "name": "_currentPriceN", "type": "uint256" }, { "indexed": false, "name": "_currentPriceD", "type": "uint256" }], "name": "Conversion", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": true, "name": "fromToken", "type": "address" }, { "indexed": true, "name": "toToken", "type": "address" }, { "indexed": true, "name": "trader", "type": "address" }, { "indexed": false, "name": "inputAmount", "type": "uint256" }, { "indexed": false, "name": "outputAmount", "type": "uint256" }, { "indexed": false, "name": "conversionFee", "type": "int256" }], "name": "Conversion", "type": "event" }
];
var TOKEN_ABI = [
    { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }
];
var decimals = {};
Decimal.set({ precision: 78 });
function parseOwnerUpdateEvent(log) {
    var indexed = log.topics.length > 1;
    return {
        blockNumber: log.blockNumber,
        prevOwner: Web3.utils.toChecksumAddress(indexed ? log.topics[1].slice(-40) : log.data.slice(26, 66)),
        currOwner: Web3.utils.toChecksumAddress(indexed ? log.topics[2].slice(-40) : log.data.slice(90, 130))
    };
}
function getTokenAmount(web3, tokenAddress, weiAmount) {
    return __awaiter(this, void 0, void 0, function () {
        var token, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!(decimals[tokenAddress] == undefined)) return [3 /*break*/, 2];
                    token = new web3.eth.Contract(TOKEN_ABI, tokenAddress);
                    _a = decimals;
                    _b = tokenAddress;
                    return [4 /*yield*/, token.methods.decimals().call()];
                case 1:
                    _a[_b] = _c.sent();
                    _c.label = 2;
                case 2: return [2 /*return*/, new Decimal(weiAmount + "e-" + decimals[tokenAddress]).toFixed()];
            }
        });
    });
}
function getPastLogs(web3, address, topic0, fromBlock, toBlock) {
    return __awaiter(this, void 0, void 0, function () {
        var error_1, midBlock, arr1, arr2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(fromBlock <= toBlock)) return [3 /*break*/, 6];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 6]);
                    return [4 /*yield*/, web3.eth.getPastLogs({ address: address, topics: [topic0], fromBlock: fromBlock, toBlock: toBlock })];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_1 = _a.sent();
                    midBlock = (fromBlock + toBlock) >> 1;
                    return [4 /*yield*/, getPastLogs(web3, address, topic0, fromBlock, midBlock)];
                case 4:
                    arr1 = _a.sent();
                    return [4 /*yield*/, getPastLogs(web3, address, topic0, midBlock + 1, toBlock)];
                case 5:
                    arr2 = _a.sent();
                    return [2 /*return*/, __spreadArrays(arr1, arr2)];
                case 6: return [2 /*return*/, []];
            }
        });
    });
}
function getPastEvents(contract, eventName, fromBlock, toBlock) {
    return __awaiter(this, void 0, void 0, function () {
        var error_2, midBlock, arr1, arr2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(fromBlock <= toBlock)) return [3 /*break*/, 6];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 6]);
                    return [4 /*yield*/, contract.getPastEvents(eventName, { fromBlock: fromBlock, toBlock: toBlock })];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_2 = _a.sent();
                    midBlock = (fromBlock + toBlock) >> 1;
                    return [4 /*yield*/, getPastEvents(contract, eventName, fromBlock, midBlock)];
                case 4:
                    arr1 = _a.sent();
                    return [4 /*yield*/, getPastEvents(contract, eventName, midBlock + 1, toBlock)];
                case 5:
                    arr2 = _a.sent();
                    return [2 /*return*/, __spreadArrays(arr1, arr2)];
                case 6: return [2 /*return*/, []];
            }
        });
    });
}
function getOwnerUpdateEvents(web3, tokenAddress, fromBlock, toBlock) {
    return __awaiter(this, void 0, void 0, function () {
        var logs, prelogs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getPastLogs(web3, tokenAddress, OWNER_UPDATE_EVENT_HASH, fromBlock, toBlock)];
                case 1:
                    logs = _a.sent();
                    if (logs.length > 0)
                        return [2 /*return*/, logs.map(function (log) { return parseOwnerUpdateEvent(log); })];
                    return [4 /*yield*/, getPastLogs(web3, tokenAddress, OWNER_UPDATE_EVENT_HASH, GENESIS_BLOCK_NUMBER, fromBlock - 1)];
                case 2:
                    prelogs = _a.sent();
                    if (prelogs.length > 0)
                        return [2 /*return*/, [parseOwnerUpdateEvent(prelogs[prelogs.length - 1])]];
                    throw new Error("Inactive Token");
            }
        });
    });
}
function getConversionEvents(web3, tokenAddress, fromBlock, toBlock) {
    return __awaiter(this, void 0, void 0, function () {
        var result, batches, events, _i, _a, event_1, index, _b, batches_1, batch, _c, _d, abi, converter, events_2, _e, events_1, event_2, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    result = [];
                    batches = [{ fromBlock: fromBlock, toBlock: undefined, owner: undefined }];
                    return [4 /*yield*/, getOwnerUpdateEvents(web3, tokenAddress, fromBlock, toBlock)];
                case 1:
                    events = _j.sent();
                    for (_i = 0, _a = events.filter(function (event) { return event.blockNumber > fromBlock; }); _i < _a.length; _i++) {
                        event_1 = _a[_i];
                        batches[batches.length - 1].toBlock = event_1.blockNumber - 1;
                        batches[batches.length - 1].owner = event_1.prevOwner;
                        batches.push({ fromBlock: event_1.blockNumber, toBlock: undefined, owner: undefined });
                    }
                    batches[batches.length - 1].toBlock = toBlock;
                    batches[batches.length - 1].owner = events[events.length - 1].currOwner;
                    index = 0;
                    _b = 0, batches_1 = batches;
                    _j.label = 2;
                case 2:
                    if (!(_b < batches_1.length)) return [3 /*break*/, 12];
                    batch = batches_1[_b];
                    _c = 0, _d = CONVERSION_EVENT_LEGACY.slice(index);
                    _j.label = 3;
                case 3:
                    if (!(_c < _d.length)) return [3 /*break*/, 11];
                    abi = _d[_c];
                    converter = new web3.eth.Contract([abi], batch.owner);
                    return [4 /*yield*/, getPastEvents(converter, abi.name, batch.fromBlock, batch.toBlock)];
                case 4:
                    events_2 = _j.sent();
                    if (!(events_2.length > 0)) return [3 /*break*/, 10];
                    _e = 0, events_1 = events_2;
                    _j.label = 5;
                case 5:
                    if (!(_e < events_1.length)) return [3 /*break*/, 9];
                    event_2 = events_1[_e];
                    _g = (_f = result).push;
                    _h = {
                        fromToken: event_2.returnValues.fromToken,
                        toToken: event_2.returnValues.toToken,
                        trader: event_2.returnValues.trader
                    };
                    return [4 /*yield*/, getTokenAmount(web3, event_2.returnValues.fromToken, event_2.returnValues.inputAmount)];
                case 6:
                    _h.inputAmount = _j.sent();
                    return [4 /*yield*/, getTokenAmount(web3, event_2.returnValues.toToken, event_2.returnValues.outputAmount)];
                case 7:
                    _g.apply(_f, [(_h.outputAmount = _j.sent(),
                            _h.conversionFee = event_2.returnValues.conversionFee,
                            _h.blockNumber = event_2.blockNumber,
                            _h)]);
                    _j.label = 8;
                case 8:
                    _e++;
                    return [3 /*break*/, 5];
                case 9:
                    index = CONVERSION_EVENT_LEGACY.indexOf(abi);
                    return [3 /*break*/, 11];
                case 10:
                    _c++;
                    return [3 /*break*/, 3];
                case 11:
                    _b++;
                    return [3 /*break*/, 2];
                case 12: return [2 /*return*/, result];
            }
        });
    });
}
function run(nodeAddress, tokenAddress, fromBlock, toBlock) {
    return __awaiter(this, void 0, void 0, function () {
        var web3, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    web3 = new Web3(nodeAddress);
                    return [4 /*yield*/, getConversionEvents(web3, tokenAddress, fromBlock, toBlock)];
                case 1:
                    result = _a.sent();
                    if (web3.currentProvider.constructor.name == "WebsocketProvider")
                        web3.currentProvider.connection.close();
                    return [2 /*return*/, result];
            }
        });
    });
}
exports.run = run;
