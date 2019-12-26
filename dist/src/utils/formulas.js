"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable max-len */
var math = __importStar(require("./math"));
function shortConvert(toTokenAmount, toTokenReserveBalance, toTokenReserve) {
    return math.decimalMultiply(toTokenReserveBalance, math.decimalDivide(toTokenAmount, math.decimalAdd(toTokenAmount, toTokenReserve)));
}
exports.shortConvert = shortConvert;
function buySmartToken(tokenReserveBalance, tokenReserveRatio, amount, smartTokenSupply) {
    return math.decimalMultiply(smartTokenSupply, math.decimalSub(math.decimalPower(math.decimalAdd(1, math.decimalDivide(amount, tokenReserveBalance)), math.decimalDivide(tokenReserveRatio, '1000000')), 1));
}
exports.buySmartToken = buySmartToken;
function sellSmartToken(tokenReserveBalance, tokenReserveRatio, amount, smartTokenSupply) {
    return math.decimalMultiply(tokenReserveBalance, math.decimalSub(1, math.decimalPower(math.decimalSub(1, math.decimalDivide(amount, smartTokenSupply)), math.decimalDivide(1, math.decimalDivide(tokenReserveRatio, '1000000')))));
}
exports.sellSmartToken = sellSmartToken;
function returnWithFee(amountBeforeFee, conversionFee, magnitude, feeResolution) {
    if (feeResolution === void 0) { feeResolution = '1000000'; }
    return math.decimalMultiply(amountBeforeFee, math.decimalDivide(math.decimalPower(math.decimalSub(feeResolution, conversionFee), magnitude), math.decimalPower(feeResolution, magnitude)));
}
exports.returnWithFee = returnWithFee;
