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
exports.getConverterBlockchainId = function (token) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(token.blockchainType == 'ethereum')) return [3 /*break*/, 2];
                return [4 /*yield*/, ethereum.getConverterBlockchainId(token.blockchainId)];
            case 1: return [2 /*return*/, _a.sent()];
            case 2: return [4 /*yield*/, eos.getConverterBlockchainId(token)];
            case 3: return [2 /*return*/, _a.sent()];
        }
    });
}); };
function getConverterToken(blockchainId, connector, blockchainType) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(blockchainType == 'ethereum')) return [3 /*break*/, 2];
                    return [4 /*yield*/, ethereum.getConverterSmartToken(connector)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2: return [2 /*return*/, blockchainId];
            }
        });
    });
}
exports.getConverterToken = getConverterToken;
function generatePathByBlockchainIds(sourceToken, targetToken) {
    return __awaiter(this, void 0, void 0, function () {
        var pathObjects, paths, _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    pathObjects = { paths: [] };
                    _a = sourceToken.blockchainType + ',' + targetToken.blockchainType;
                    switch (_a) {
                        case 'eos,eos': return [3 /*break*/, 1];
                        case 'ethereum,ethereum': return [3 /*break*/, 3];
                        case 'eos,ethereum': return [3 /*break*/, 5];
                        case 'ethereum,eos': return [3 /*break*/, 8];
                    }
                    return [3 /*break*/, 11];
                case 1:
                    _c = (_b = pathObjects.paths).push;
                    _d = { type: 'eos' };
                    return [4 /*yield*/, getConversionPath(sourceToken, targetToken)];
                case 2:
                    _c.apply(_b, [(_d.path = _l.sent(), _d)]);
                    return [3 /*break*/, 11];
                case 3: return [4 /*yield*/, ethereum.getAllPaths(sourceToken.blockchainId, targetToken.blockchainId)];
                case 4:
                    paths = _l.sent();
                    pathObjects.paths.push({ type: 'ethereum', path: paths.reduce(function (a, b) { return a.length < b.length ? a : b; }) });
                    return [3 /*break*/, 11];
                case 5: return [4 /*yield*/, ethereum.getAllPaths(sourceToken.blockchainId, ethereum.anchorToken.blockchainId)];
                case 6:
                    paths = _l.sent();
                    _f = (_e = pathObjects.paths).push;
                    _g = { type: 'eos' };
                    return [4 /*yield*/, getConversionPath(sourceToken, null)];
                case 7:
                    _f.apply(_e, [(_g.path = _l.sent(), _g)]);
                    pathObjects.paths.push({ type: 'ethereum', path: paths.reduce(function (a, b) { return a.length < b.length ? a : b; }) });
                    return [3 /*break*/, 11];
                case 8: return [4 /*yield*/, ethereum.getAllPaths(ethereum.anchorToken.blockchainId, targetToken.blockchainId)];
                case 9:
                    paths = _l.sent();
                    pathObjects.paths.push({ type: 'ethereum', path: paths.reduce(function (a, b) { return a.length < b.length ? a : b; }) });
                    _j = (_h = pathObjects.paths).push;
                    _k = { type: 'eos' };
                    return [4 /*yield*/, getConversionPath(null, targetToken)];
                case 10:
                    _j.apply(_h, [(_k.path = _l.sent(), _k)]);
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/, pathObjects];
            }
        });
    });
}
exports.generatePathByBlockchainIds = generatePathByBlockchainIds;
function getPath(from, to) {
    var blockchainType = from ? from.blockchainType : to.blockchainType;
    var anchorToken = { eos: eos, ethereum: ethereum }[blockchainType].anchorToken;
    var path = {
        from: from ? from : anchorToken,
        to: to ? to : anchorToken
    };
    return path;
}
function getConversionPath(from, to) {
    return __awaiter(this, void 0, void 0, function () {
        var blockchainType, path;
        return __generator(this, function (_a) {
            blockchainType = from ? from.blockchainType : to.blockchainType;
            path = getPath(from, to);
            return [2 /*return*/, findPath(path, blockchainType)];
        });
    });
}
exports.getConversionPath = getConversionPath;
function findPath(pathObject, blockchainType) {
    return __awaiter(this, void 0, void 0, function () {
        var anchorToken, from, to;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    anchorToken = { eos: eos, ethereum: ethereum }[blockchainType].anchorToken;
                    return [4 /*yield*/, getPathToAnchorByBlockchainId(__assign({}, pathObject.from), anchorToken)];
                case 1:
                    from = _a.sent();
                    return [4 /*yield*/, getPathToAnchorByBlockchainId(__assign({}, pathObject.to), anchorToken)];
                case 2:
                    to = _a.sent();
                    return [2 /*return*/, getShortestPath(from, to)];
            }
        });
    });
}
exports.findPath = findPath;
function getPathToAnchorByBlockchainId(token, anchorToken) {
    return __awaiter(this, void 0, void 0, function () {
        var module, smartTokens, _a, isMulti, _i, smartTokens_1, smartToken, blockchainId, converterBlockchainId, reserveTokens, _b, _c, reserveToken, path;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    module = { eos: eos, ethereum: ethereum }[token.blockchainType];
                    if (module.isAnchorToken(token))
                        return [2 /*return*/, [module.getTokenBlockchainId(token)]];
                    if (!(token.blockchainType == 'eos')) return [3 /*break*/, 1];
                    _a = [token.blockchainId];
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, ethereum.getSmartTokens(token)];
                case 2:
                    _a = _d.sent();
                    _d.label = 3;
                case 3:
                    smartTokens = _a;
                    isMulti = token.blockchainType == 'eos' ? eos.isMultiConverter(token.blockchainId) : false;
                    _i = 0, smartTokens_1 = smartTokens;
                    _d.label = 4;
                case 4:
                    if (!(_i < smartTokens_1.length)) return [3 /*break*/, 11];
                    smartToken = smartTokens_1[_i];
                    return [4 /*yield*/, exports.getConverterBlockchainId(token.blockchainType == 'ethereum' ? { blockchainType: 'ethereum', blockchainId: smartToken } : token)];
                case 5:
                    blockchainId = _d.sent();
                    converterBlockchainId = token.blockchainType == 'ethereum' ? blockchainId : Object.values(blockchainId)[0];
                    return [4 /*yield*/, { eos: eos, ethereum: ethereum }[token.blockchainType].getReserveTokens(converterBlockchainId, token.symbol, isMulti)];
                case 6:
                    reserveTokens = _d.sent();
                    _b = 0, _c = reserveTokens.filter(function (reserveToken) { return reserveToken.blockchainId != token.blockchainId; });
                    _d.label = 7;
                case 7:
                    if (!(_b < _c.length)) return [3 /*break*/, 10];
                    reserveToken = _c[_b];
                    return [4 /*yield*/, getPathToAnchorByBlockchainId(reserveToken, anchorToken)];
                case 8:
                    path = _d.sent();
                    if (path.length > 0)
                        return [2 /*return*/, __spreadArrays([module.getTokenBlockchainId(token), token.blockchainType == 'eos' ? blockchainId : smartToken], path)];
                    _d.label = 9;
                case 9:
                    _b++;
                    return [3 /*break*/, 7];
                case 10:
                    _i++;
                    return [3 /*break*/, 4];
                case 11: return [2 /*return*/, []];
            }
        });
    });
}
exports.getPathToAnchorByBlockchainId = getPathToAnchorByBlockchainId;
function getShortestPath(sourcePath, targetPath) {
    if (sourcePath.length > 0 && targetPath.length > 0) {
        var i = sourcePath.length - 1;
        var j = targetPath.length - 1;
        while (i >= 0 && j >= 0 && JSON.stringify(sourcePath[i]) == JSON.stringify(targetPath[j])) {
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
