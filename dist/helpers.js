"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var decimal_js_1 = __importDefault(require("decimal.js"));
var ZERO = new decimal_js_1.default(0);
var ONE = new decimal_js_1.default(1);
var MAX_WEIGHT = new decimal_js_1.default(1000000);
var MAX_FEE = new decimal_js_1.default(1000000);
decimal_js_1.default.set({ precision: 100, rounding: decimal_js_1.default.ROUND_DOWN });
function toWei(amount, decimals) {
    return new decimal_js_1.default(amount + "e+" + decimals).toFixed();
}
exports.toWei = toWei;
function fromWei(amount, decimals) {
    return new decimal_js_1.default(amount + "e-" + decimals).toFixed();
}
exports.fromWei = fromWei;
function toDecimalPlaces(amount, decimals) {
    return amount.toDecimalPlaces(decimals).toFixed();
}
exports.toDecimalPlaces = toDecimalPlaces;
function isTokenEqual(token1, token2) {
    return token1.blockchainType == token2.blockchainType &&
        token1.blockchainId.toLowerCase() == token2.blockchainId.toLowerCase() &&
        token1.symbol == token2.symbol;
}
exports.isTokenEqual = isTokenEqual;
function purchaseRate(supply, reserveBalance, reserveWeight, amount) {
    var _a;
    _a = Array.from(arguments).map(function (x) { return new decimal_js_1.default(x); }), supply = _a[0], reserveBalance = _a[1], reserveWeight = _a[2], amount = _a[3];
    // special case for 0 deposit amount
    if (amount.equals(ZERO))
        return ZERO;
    // special case if the weight = 100%
    if (reserveWeight.equals(MAX_WEIGHT))
        return supply.mul(amount).div(reserveBalance);
    // return supply * ((1 + amount / reserveBalance) ^ (reserveWeight / MAX_WEIGHT) - 1)
    return supply.mul((ONE.add(amount.div(reserveBalance))).pow(reserveWeight.div(MAX_WEIGHT)).sub(ONE));
}
exports.purchaseRate = purchaseRate;
function saleRate(supply, reserveBalance, reserveWeight, amount) {
    var _a;
    _a = Array.from(arguments).map(function (x) { return new decimal_js_1.default(x); }), supply = _a[0], reserveBalance = _a[1], reserveWeight = _a[2], amount = _a[3];
    // special case for 0 sell amount
    if (amount.equals(ZERO))
        return ZERO;
    // special case for selling the entire supply
    if (amount.equals(supply))
        return reserveBalance;
    // special case if the weight = 100%
    if (reserveWeight.equals(MAX_WEIGHT))
        return reserveBalance.mul(amount).div(supply);
    // return reserveBalance * (1 - (1 - amount / supply) ^ (MAX_WEIGHT / reserveWeight))
    return reserveBalance.mul(ONE.sub(ONE.sub(amount.div(supply)).pow((MAX_WEIGHT.div(reserveWeight)))));
}
exports.saleRate = saleRate;
function crossReserveRate(sourceReserveBalance, sourceReserveWeight, targetReserveBalance, targetReserveWeight, amount) {
    var _a;
    _a = Array.from(arguments).map(function (x) { return new decimal_js_1.default(x); }), sourceReserveBalance = _a[0], sourceReserveWeight = _a[1], targetReserveBalance = _a[2], targetReserveWeight = _a[3], amount = _a[4];
    // special case for equal weights
    if (sourceReserveWeight.equals(targetReserveWeight))
        return targetReserveBalance.mul(amount).div(sourceReserveBalance.add(amount));
    // return targetReserveBalance * (1 - (sourceReserveBalance / (sourceReserveBalance + amount)) ^ (sourceReserveWeight / targetReserveWeight))
    return targetReserveBalance.mul(ONE.sub(sourceReserveBalance.div(sourceReserveBalance.add(amount)).pow(sourceReserveWeight.div(targetReserveWeight))));
}
exports.crossReserveRate = crossReserveRate;
function fundCost(supply, reserveBalance, reserveRatio, amount) {
    var _a;
    _a = Array.from(arguments).map(function (x) { return new decimal_js_1.default(x); }), supply = _a[0], reserveBalance = _a[1], reserveRatio = _a[2], amount = _a[3];
    // special case for 0 amount
    if (amount.equals(ZERO))
        return ZERO;
    // special case if the reserve ratio = 100%
    if (reserveRatio.equals(MAX_WEIGHT))
        return (amount.mul(reserveBalance).sub(ONE)).div(supply.add(ONE));
    // return reserveBalance * (((supply + amount) / supply) ^ (MAX_WEIGHT / reserveRatio) - 1)
    return reserveBalance.mul(supply.add(amount).div(supply).pow(MAX_WEIGHT.div(reserveRatio)).sub(ONE));
}
exports.fundCost = fundCost;
function fundSupplyAmount(supply, reserveBalance, reserveRatio, amount) {
    var _a;
    _a = Array.from(arguments).map(function (x) { return new decimal_js_1.default(x); }), supply = _a[0], reserveBalance = _a[1], reserveRatio = _a[2], amount = _a[3];
    // special case for 0 amount
    if (amount.equals(ZERO))
        return ZERO;
    // special case if the reserve ratio = 100%
    if (reserveRatio.equals(MAX_WEIGHT))
        return amount.mul(supply).div(reserveBalance);
    // return supply * ((amount / reserveBalance + 1) ^ (reserveRatio / MAX_WEIGHT) - 1)
    return supply.mul(amount.div(reserveBalance).add(ONE).pow(reserveRatio.div(MAX_WEIGHT)).sub(ONE));
}
exports.fundSupplyAmount = fundSupplyAmount;
function liquidateRate(supply, reserveBalance, reserveRatio, amount) {
    var _a;
    _a = Array.from(arguments).map(function (x) { return new decimal_js_1.default(x); }), supply = _a[0], reserveBalance = _a[1], reserveRatio = _a[2], amount = _a[3];
    // special case for 0 amount
    if (amount.equals(ZERO))
        return ZERO;
    // special case for liquidating the entire supply
    if (amount.equals(supply))
        return reserveBalance;
    // special case if the reserve ratio = 100%
    if (reserveRatio.equals(MAX_WEIGHT))
        return amount.mul(reserveBalance).div(supply);
    // return reserveBalance * (1 - ((supply - amount) / supply) ^ (MAX_WEIGHT / reserveRatio))
    return reserveBalance.mul(ONE.sub(supply.sub(amount).div(supply).pow(MAX_WEIGHT.div(reserveRatio))));
}
exports.liquidateRate = liquidateRate;
function getFinalAmount(amount, fee, magnitude) {
    var _a;
    _a = Array.from(arguments).map(function (x) { return new decimal_js_1.default(x); }), amount = _a[0], fee = _a[1], magnitude = _a[2];
    return amount.mul(MAX_FEE.sub(fee).pow(magnitude)).div(MAX_FEE.pow(magnitude));
}
exports.getFinalAmount = getFinalAmount;
function getReturn(func, args, amount, fee, direction, magnitude) {
    amount = new decimal_js_1.default(amount);
    return func.apply(void 0, __spreadArrays(args, [amount.mul(factor(fee, direction, magnitude, -1))])).mul(factor(fee, direction, magnitude, +1));
}
exports.getReturn = getReturn;
function factor(fee, direction, magnitude, sign) {
    return MAX_WEIGHT.sub(fee).div(MAX_WEIGHT).pow(magnitude).pow((direction + sign) / 2).mul(direction);
}
