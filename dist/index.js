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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SDK = void 0;
var core_1 = require("./core");
var history_1 = require("./history");
var pricing_1 = require("./pricing");
var utils_1 = require("./utils");
/**
 * Main SDK object, should be instantiated using the `create` static method
 */
var SDK = /** @class */ (function () {
    function SDK() {
        /** History module */
        this.history = null;
        /** Pricing module */
        this.pricing = null;
        /** Utils module */
        this.utils = null;
        /** @internal */
        this._core = new core_1.Core();
    }
    /**
    * creates and initializes a new SDK object
    * should be called as the first step before using the SDK
    *
    * @param settings   initialization settings
    *
    * @returns  new SDK object
    */
    SDK.create = function (settings) {
        return __awaiter(this, void 0, void 0, function () {
            var sdk;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sdk = new SDK();
                        return [4 /*yield*/, sdk._core.create(settings)];
                    case 1:
                        _a.sent();
                        sdk.history = new history_1.History(sdk._core);
                        sdk.pricing = new pricing_1.Pricing(sdk._core);
                        sdk.utils = new utils_1.Utils(sdk._core);
                        return [2 /*return*/, sdk];
                }
            });
        });
    };
    /**
    * cleans up and destroys an existing SDK object
    * should be called as the last step after the SDK work is complete to free up resources
    *
    * @param sdk   sdk object
    */
    SDK.destroy = function (sdk) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sdk.history = null;
                        sdk.pricing = null;
                        sdk.utils = null;
                        return [4 /*yield*/, sdk._core.destroy()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
    * refreshes the local cache with data from the converter registry
    * should be called periodically to support new pools
    */
    SDK.prototype.refresh = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._core.refresh()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return SDK;
}());
exports.SDK = SDK;
