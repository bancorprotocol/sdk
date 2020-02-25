"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var decimal_js_1 = __importDefault(require("decimal.js/decimal.js"));
decimal_js_1.default.set({ precision: 400 });
function fromWei(number, decimalDigits) {
    if (decimalDigits === void 0) { decimalDigits = 18; }
    return new decimal_js_1.default(number + "e-" + decimalDigits).toFixed();
}
exports.fromWei = fromWei;
function toWei(number, decimalDigits) {
    if (decimalDigits === void 0) { decimalDigits = 18; }
    return new decimal_js_1.default(number + "e+" + decimalDigits).toFixed();
}
exports.toWei = toWei;
