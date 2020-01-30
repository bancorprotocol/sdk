"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var decimal_1 = __importDefault(require("../../utils/decimal"));
function fromWei(number, decimalDigits) {
    if (decimalDigits === void 0) { decimalDigits = 18; }
    return new decimal_1.default(number + "e-" + decimalDigits).toFixed();
}
exports.fromWei = fromWei;
function toWei(number, decimalDigits) {
    if (decimalDigits === void 0) { decimalDigits = 18; }
    return new decimal_1.default(number + "e+" + decimalDigits).toFixed();
}
exports.toWei = toWei;
