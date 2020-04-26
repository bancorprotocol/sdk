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
var ethereum_1 = require("./blockchains/ethereum");
var eos_1 = require("./blockchains/eos");
var types_1 = require("./types");
var Core = /** @class */ (function () {
    function Core() {
        this.blockchains = {};
    }
    Core.prototype.create = function (settings) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!settings.ethereumNodeEndpoint) return [3 /*break*/, 2];
                        _a = this.blockchains;
                        _b = types_1.BlockchainType.Ethereum;
                        return [4 /*yield*/, ethereum_1.Ethereum.create(settings.ethereumNodeEndpoint)];
                    case 1:
                        _a[_b] = _e.sent();
                        _e.label = 2;
                    case 2:
                        if (!settings.eosNodeEndpoint) return [3 /*break*/, 4];
                        _c = this.blockchains;
                        _d = types_1.BlockchainType.EOS;
                        return [4 /*yield*/, eos_1.EOS.create(settings.eosNodeEndpoint)];
                    case 3:
                        _c[_d] = _e.sent();
                        _e.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Core.prototype.destroy = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.blockchains[types_1.BlockchainType.Ethereum]) return [3 /*break*/, 2];
                        return [4 /*yield*/, ethereum_1.Ethereum.destroy(this.blockchains[types_1.BlockchainType.Ethereum])];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!this.blockchains[types_1.BlockchainType.EOS]) return [3 /*break*/, 4];
                        return [4 /*yield*/, eos_1.EOS.destroy(this.blockchains[types_1.BlockchainType.EOS])];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Core.prototype.refresh = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _i, blockchainType;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = [];
                        for (_b in this.blockchains)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        blockchainType = _a[_i];
                        return [4 /*yield*/, this.blockchains[blockchainType].refresh()];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Core.prototype.getPaths = function (sourceToken, targetToken) {
        return __awaiter(this, void 0, void 0, function () {
            var f, cartesian, sourceBlockchain, targetBlockchain, sourcePaths, targetPaths;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        f = function (a, b) { return [].concat.apply([], a.map(function (d) { return b.map(function (e) { return [].concat(d, e); }); })); };
                        cartesian = function (a, b) {
                            var c = [];
                            for (var _i = 2; _i < arguments.length; _i++) {
                                c[_i - 2] = arguments[_i];
                            }
                            return (b ? cartesian.apply(void 0, __spreadArrays([f(a, b)], c)) : a);
                        };
                        if (!(sourceToken.blockchainType == targetToken.blockchainType)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.blockchains[sourceToken.blockchainType].getPaths(sourceToken, targetToken)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        sourceBlockchain = this.blockchains[sourceToken.blockchainType];
                        targetBlockchain = this.blockchains[targetToken.blockchainType];
                        return [4 /*yield*/, sourceBlockchain.getPaths(sourceToken, sourceBlockchain.getAnchorToken())];
                    case 3:
                        sourcePaths = _a.sent();
                        return [4 /*yield*/, targetBlockchain.getPaths(targetBlockchain.getAnchorToken(), targetToken)];
                    case 4:
                        targetPaths = _a.sent();
                        return [2 /*return*/, cartesian(sourcePaths, targetPaths)];
                }
            });
        });
    };
    Core.prototype.getRates = function (paths, amount) {
        if (amount === void 0) { amount = '1'; }
        return __awaiter(this, void 0, void 0, function () {
            var path0Form, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        path0Form = this.pathForm(paths[0]);
                        if (paths.slice(1).some(function (path) { return _this.pathForm(path) != path0Form; }))
                            throw new Error('getRates input paths must bear the same source and the same target tokens');
                        _a = this.pathType(paths[0][0].blockchainType, paths[0].slice(-1)[0].blockchainType);
                        switch (_a) {
                            case this.pathType(types_1.BlockchainType.Ethereum, types_1.BlockchainType.Ethereum): return [3 /*break*/, 1];
                            case this.pathType(types_1.BlockchainType.Ethereum, types_1.BlockchainType.EOS): return [3 /*break*/, 3];
                            case this.pathType(types_1.BlockchainType.EOS, types_1.BlockchainType.Ethereum): return [3 /*break*/, 4];
                            case this.pathType(types_1.BlockchainType.EOS, types_1.BlockchainType.EOS): return [3 /*break*/, 5];
                        }
                        return [3 /*break*/, 7];
                    case 1: return [4 /*yield*/, this.blockchains[types_1.BlockchainType.Ethereum].getRates(paths, amount)];
                    case 2: return [2 /*return*/, _b.sent()];
                    case 3: throw new Error('getRates from ethereum token to eos token not supported');
                    case 4: throw new Error('getRates from eos token to ethereum token not supported');
                    case 5: return [4 /*yield*/, Promise.all(paths.map(function (path) { return _this.blockchains[types_1.BlockchainType.EOS].getRateByPath(path, amount); }))];
                    case 6: return [2 /*return*/, _b.sent()];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Core.prototype.pathType = function (blockchainType1, blockchainType2) {
        return blockchainType1 + ',' + blockchainType2;
    };
    Core.prototype.pathForm = function (path) {
        return JSON.stringify(path[0]) + JSON.stringify(path[path.length - 1]);
    };
    return Core;
}());
exports.Core = Core;
