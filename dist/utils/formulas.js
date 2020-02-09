"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var decimal_js_1 = __importDefault(require("decimal.js"));
var ZERO = new decimal_js_1.default(0);
var ONE = new decimal_js_1.default(1);
var MAX_RATIO = new decimal_js_1.default(1000000);
var MAX_FEE = new decimal_js_1.default(1000000);
function calculatePurchaseReturn(supply, reserveBalance, reserveRatio, depositAmount) {
    var _a;
    _a = Array.from(arguments).map(function (x) { return new decimal_js_1.default(x); }), supply = _a[0], reserveBalance = _a[1], reserveRatio = _a[2], depositAmount = _a[3];
    // special case for 0 deposit amount
    if (depositAmount.equals(ZERO))
        return ZERO;
    // special case if the ratio = 100%
    if (reserveRatio.equals(MAX_RATIO))
        return supply.mul(depositAmount).div(reserveBalance);
    // return supply * ((1 + depositAmount / reserveBalance) ^ (reserveRatio / 1000000) - 1)
    return supply.mul((ONE.add(depositAmount.div(reserveBalance))).pow(reserveRatio.div(MAX_RATIO)).sub(ONE));
}
exports.calculatePurchaseReturn = calculatePurchaseReturn;
function calculateSaleReturn(supply, reserveBalance, reserveRatio, sellAmount) {
    var _a;
    _a = Array.from(arguments).map(function (x) { return new decimal_js_1.default(x); }), supply = _a[0], reserveBalance = _a[1], reserveRatio = _a[2], sellAmount = _a[3];
    // special case for 0 sell amount
    if (sellAmount.equals(ZERO))
        return ZERO;
    // special case for selling the entire supply
    if (sellAmount.equals(supply))
        return reserveBalance;
    // special case if the ratio = 100%
    if (reserveRatio.equals(MAX_RATIO))
        return reserveBalance.mul(sellAmount).div(supply);
    // return reserveBalance * (1 - (1 - sellAmount / supply) ^ (1000000 / reserveRatio))
    return reserveBalance.mul(ONE.sub(ONE.sub(sellAmount.div(supply)).pow((MAX_RATIO.div(reserveRatio)))));
}
exports.calculateSaleReturn = calculateSaleReturn;
function calculateCrossReserveReturn(fromReserveBalance, fromReserveRatio, toReserveBalance, toReserveRatio, amount) {
    var _a;
    _a = Array.from(arguments).map(function (x) { return new decimal_js_1.default(x); }), fromReserveBalance = _a[0], fromReserveRatio = _a[1], toReserveBalance = _a[2], toReserveRatio = _a[3], amount = _a[4];
    // special case for equal ratios
    if (fromReserveRatio.equals(toReserveRatio))
        return toReserveBalance.mul(amount).div(fromReserveBalance.add(amount));
    // return toReserveBalance * (1 - (fromReserveBalance / (fromReserveBalance + amount)) ^ (fromReserveRatio / toReserveRatio))
    return toReserveBalance.mul(ONE.sub(fromReserveBalance.div(fromReserveBalance.add(amount)).pow(fromReserveRatio.div(toReserveRatio))));
}
exports.calculateCrossReserveReturn = calculateCrossReserveReturn;
function calculateFundCost(supply, reserveBalance, totalRatio, amount) {
    var _a;
    _a = Array.from(arguments).map(function (x) { return new decimal_js_1.default(x); }), supply = _a[0], reserveBalance = _a[1], totalRatio = _a[2], amount = _a[3];
    // special case for 0 amount
    if (amount.equals(ZERO))
        return ZERO;
    // special case if the total ratio = 100%
    if (totalRatio.equals(MAX_RATIO))
        return (amount.mul(reserveBalance).sub(ONE)).div(supply.add(ONE));
    // return reserveBalance * (((supply + amount) / supply) ^ (MAX_RATIO / totalRatio) - 1)
    return reserveBalance.mul(supply.add(amount).div(supply).pow(MAX_RATIO.div(totalRatio)).sub(ONE));
}
exports.calculateFundCost = calculateFundCost;
function calculateLiquidateReturn(supply, reserveBalance, totalRatio, amount) {
    var _a;
    _a = Array.from(arguments).map(function (x) { return new decimal_js_1.default(x); }), supply = _a[0], reserveBalance = _a[1], totalRatio = _a[2], amount = _a[3];
    // special case for 0 amount
    if (amount.equals(ZERO))
        return ZERO;
    // special case for liquidating the entire supply
    if (amount.equals(supply))
        return reserveBalance;
    // special case if the total ratio = 100%
    if (totalRatio.equals(MAX_RATIO))
        return amount.mul(reserveBalance).div(supply);
    // return reserveBalance * (1 - ((supply - amount) / supply) ^ (MAX_RATIO / totalRatio))
    return reserveBalance.mul(ONE.sub(supply.sub(amount).div(supply).pow(MAX_RATIO.div(totalRatio))));
}
exports.calculateLiquidateReturn = calculateLiquidateReturn;
function getFinalAmount(amount, conversionFee, magnitude) {
    var _a;
    _a = Array.from(arguments).map(function (x) { return new decimal_js_1.default(x); }), amount = _a[0], conversionFee = _a[1], magnitude = _a[2];
    return amount.mul(MAX_FEE.sub(conversionFee).pow(magnitude)).div(MAX_FEE.pow(magnitude));
}
exports.getFinalAmount = getFinalAmount;
