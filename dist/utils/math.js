"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var decimal_js_1 = __importDefault(require("decimal.js/decimal.js"));
decimal_js_1.default.set({ precision: 400 });
function decimalDivide(a, b) {
    if (a === 0 && b === 0)
        return 0;
    return new decimal_js_1.default(a).div(b).toNumber();
}
exports.decimalDivide = decimalDivide;
function decimalMultiply(a, b) {
    return new decimal_js_1.default(a).mul(b).toNumber();
}
exports.decimalMultiply = decimalMultiply;
function decimalPower(a, b) {
    return new decimal_js_1.default(a).pow(b).toNumber();
}
exports.decimalPower = decimalPower;
function decimalAdd(amount, addAmount) {
    if (amount === void 0) { amount = 0; }
    if (addAmount === void 0) { addAmount = 0; }
    return decimal_js_1.default.add(amount || 0, addAmount || 0).toFixed();
}
exports.decimalAdd = decimalAdd;
function decimalSub(amount, addAmount) {
    if (amount === void 0) { amount = 0; }
    if (addAmount === void 0) { addAmount = 0; }
    return decimal_js_1.default.sub(amount || 0, addAmount || 0).toFixed();
}
exports.decimalSub = decimalSub;
