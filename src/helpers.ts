import helpers from 'decimal.js';
import { Token } from './types';

const ZERO = new helpers(0);
const ONE = new helpers(1);
const MAX_WEIGHT = new helpers(1000000);
const MAX_FEE = new helpers(1000000);

helpers.set({precision: 100, rounding: helpers.ROUND_DOWN});

export function toWei(amount, decimals) {
    return new helpers(`${amount}e+${decimals}`).toFixed();
}

export function fromWei(amount, decimals) {
    return new helpers(`${amount}e-${decimals}`).toFixed();
}

export function toDecimalPlaces(amount, decimals) {
    return amount.toDecimalPlaces(decimals).toFixed();
}

export function isTokenEqual(token1: Token, token2: Token) {
    return token1.blockchainType == token2.blockchainType &&
           token1.blockchainId.toLowerCase() == token2.blockchainId.toLowerCase() &&
           token1.symbol == token2.symbol;
}

export function calculatePurchaseReturn(supply, reserveBalance, reserveWeight, depositAmount) {
    [supply, reserveBalance, reserveWeight, depositAmount] = Array.from(arguments).map(x => new helpers(x));

    // special case for 0 deposit amount
    if (depositAmount.equals(ZERO))
        return ZERO;

    // special case if the weight = 100%
    if (reserveWeight.equals(MAX_WEIGHT))
        return supply.mul(depositAmount).div(reserveBalance);

    // return supply * ((1 + depositAmount / reserveBalance) ^ (reserveWeight / 1000000) - 1)
    return supply.mul((ONE.add(depositAmount.div(reserveBalance))).pow(reserveWeight.div(MAX_WEIGHT)).sub(ONE));
}

export function calculateSaleReturn(supply, reserveBalance, reserveWeight, sellAmount) {
    [supply, reserveBalance, reserveWeight, sellAmount] = Array.from(arguments).map(x => new helpers(x));

    // special case for 0 sell amount
    if (sellAmount.equals(ZERO))
        return ZERO;

    // special case for selling the entire supply
    if (sellAmount.equals(supply))
        return reserveBalance;

    // special case if the weight = 100%
    if (reserveWeight.equals(MAX_WEIGHT))
        return reserveBalance.mul(sellAmount).div(supply);

    // return reserveBalance * (1 - (1 - sellAmount / supply) ^ (1000000 / reserveWeight))
    return reserveBalance.mul(ONE.sub(ONE.sub(sellAmount.div(supply)).pow((MAX_WEIGHT.div(reserveWeight)))));
}

export function calculateCrossReserveReturn(sourceReserveBalance, sourceReserveWeight, targetReserveBalance, targetReserveWeight, amount) {
    [sourceReserveBalance, sourceReserveWeight, targetReserveBalance, targetReserveWeight, amount] = Array.from(arguments).map(x => new helpers(x));

    // special case for equal weights
    if (sourceReserveWeight.equals(targetReserveWeight))
        return targetReserveBalance.mul(amount).div(sourceReserveBalance.add(amount));

    // return targetReserveBalance * (1 - (sourceReserveBalance / (sourceReserveBalance + amount)) ^ (sourceReserveWeight / targetReserveWeight))
    return targetReserveBalance.mul(ONE.sub(sourceReserveBalance.div(sourceReserveBalance.add(amount)).pow(sourceReserveWeight.div(targetReserveWeight))));
}

export function calculateFundCost(supply, reserveBalance, reserveRatio, amount) {
    [supply, reserveBalance, reserveRatio, amount] = Array.from(arguments).map(x => new helpers(x));

    // special case for 0 amount
    if (amount.equals(ZERO))
        return ZERO;

    // special case if the reserve ratio = 100%
    if (reserveRatio.equals(MAX_WEIGHT))
        return (amount.mul(reserveBalance).sub(ONE)).div(supply.add(ONE));

    // return reserveBalance * (((supply + amount) / supply) ^ (MAX_WEIGHT / reserveRatio) - 1)
    return reserveBalance.mul(supply.add(amount).div(supply).pow(MAX_WEIGHT.div(reserveRatio)).sub(ONE));
}

export function calculateLiquidateReturn(supply, reserveBalance, reserveRatio, amount) {
    [supply, reserveBalance, reserveRatio, amount] = Array.from(arguments).map(x => new helpers(x));

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

export function getFinalAmount(amount, conversionFee, magnitude) {
    [amount, conversionFee, magnitude] = Array.from(arguments).map(x => new helpers(x));
    return amount.mul(MAX_FEE.sub(conversionFee).pow(magnitude)).div(MAX_FEE.pow(magnitude));
}
