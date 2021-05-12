"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var sdk_module_1 = require("./sdk_module");
/**
 * The Pricing module provides access to pricing and rates logic for tokens in the bancor network
 */
var Pricing = /** @class */ (function (_super) {
    __extends(Pricing, _super);
    function Pricing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
    * returns the best conversion path and rate for a given pair of tokens in the bancor network
    *
    * @param sourceToken    source token
    * @param targetToken    target token
    * @param amount         input amount
    *
    * @returns  the best path and rate between the source token and the target token
    */
    Pricing.prototype.getPathAndRate = function (sourceToken, targetToken, amount) {
        if (amount === void 0) { amount = '1'; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.core.getPathsAndRates(sourceToken, targetToken, [amount])];
                    case 1: return [2 /*return*/, (_a.sent())[0]];
                }
            });
        });
    };
    /**
    * returns the best conversion paths and rates for a given pair of tokens and input amounts in the bancor network
    *
    * @param sourceToken    source token
    * @param targetToken    target token
    * @param amounts         input amounts
    *
    * @returns  the best paths and rates between the source token and the target token for each input amount
    */
    Pricing.prototype.getPathsAndRates = function (sourceToken, targetToken, amounts) {
        if (amounts === void 0) { amounts = ['1']; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.core.getPathsAndRates(sourceToken, targetToken, amounts)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
    * returns the rate for a given conversion path in the bancor network
    *
    * @param path    conversion path
    * @param amount  input amount
    *
    * @returns  output amount for a conversion on the given path
    */
    Pricing.prototype.getRateByPath = function (path, amount) {
        if (amount === void 0) { amount = '1'; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.core.getRateByPath(path, amount)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return Pricing;
}(sdk_module_1.SDKModule));
exports.Pricing = Pricing;
