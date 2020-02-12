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
function generatePathByBlockchainIds(sourceToken, targetToken) {
    return __awaiter(this, void 0, void 0, function () {
        var pathObjects, paths, _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    pathObjects = [];
                    _a = sourceToken.blockchainType + ',' + targetToken.blockchainType;
                    switch (_a) {
                        case 'eos,eos': return [3 /*break*/, 1];
                        case 'ethereum,ethereum': return [3 /*break*/, 3];
                        case 'eos,ethereum': return [3 /*break*/, 5];
                        case 'ethereum,eos': return [3 /*break*/, 8];
                    }
                    return [3 /*break*/, 11];
                case 1:
                    _c = (_b = pathObjects).push;
                    _d = { type: 'eos' };
                    return [4 /*yield*/, eos.getConversionPath(sourceToken, targetToken)];
                case 2:
                    _c.apply(_b, [(_d.path = _l.sent(), _d)]);
                    return [3 /*break*/, 11];
                case 3: return [4 /*yield*/, ethereum.getAllPaths(sourceToken.blockchainId, targetToken.blockchainId)];
                case 4:
                    paths = _l.sent();
                    pathObjects.push({ type: 'ethereum', path: paths.reduce(function (a, b) { return a.length < b.length ? a : b; }) });
                    return [3 /*break*/, 11];
                case 5: return [4 /*yield*/, ethereum.getAllPaths(sourceToken.blockchainId, ethereum.anchorToken.blockchainId)];
                case 6:
                    paths = _l.sent();
                    _f = (_e = pathObjects).push;
                    _g = { type: 'eos' };
                    return [4 /*yield*/, eos.getConversionPath(sourceToken, eos.anchorToken)];
                case 7:
                    _f.apply(_e, [(_g.path = _l.sent(), _g)]);
                    pathObjects.push({ type: 'ethereum', path: paths.reduce(function (a, b) { return a.length < b.length ? a : b; }) });
                    return [3 /*break*/, 11];
                case 8: return [4 /*yield*/, ethereum.getAllPaths(ethereum.anchorToken.blockchainId, targetToken.blockchainId)];
                case 9:
                    paths = _l.sent();
                    pathObjects.push({ type: 'ethereum', path: paths.reduce(function (a, b) { return a.length < b.length ? a : b; }) });
                    _j = (_h = pathObjects).push;
                    _k = { type: 'eos' };
                    return [4 /*yield*/, eos.getConversionPath(eos.anchorToken, targetToken)];
                case 10:
                    _j.apply(_h, [(_k.path = _l.sent(), _k)]);
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/, pathObjects];
            }
        });
    });
}
exports.generatePathByBlockchainIds = generatePathByBlockchainIds;
