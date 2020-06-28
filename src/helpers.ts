import Decimal from 'decimal.js';
import { Token } from './types';

const ZERO = new Decimal(0);
const ONE = new Decimal(1);
const MAX_WEIGHT = new Decimal(1000000);
const MAX_FEE = new Decimal(1000000);

Decimal.set({precision: 100, rounding: Decimal.ROUND_DOWN});

export function toWei(amount, decimals) {
    return new Decimal(`${amount}e+${decimals}`).toFixed();
}

export function fromWei(amount, decimals) {
    return new Decimal(`${amount}e-${decimals}`).toFixed();
}

export function toDecimalPlaces(amount, decimals) {
    return amount.toDecimalPlaces(decimals).toFixed();
}

export function isTokenEqual(token1: Token, token2: Token) {
    return token1.blockchainType == token2.blockchainType &&
           token1.blockchainId.toLowerCase() == token2.blockchainId.toLowerCase() &&
           token1.symbol == token2.symbol;
}

export function purchaseRate(supply, reserveBalance, reserveWeight, amount) {
    [supply, reserveBalance, reserveWeight, amount] = Array.from(arguments).map(x => new Decimal(x));

    // special case for 0 deposit amount
    if (amount.equals(ZERO))
        return ZERO;

    // special case if the weight = 100%
    if (reserveWeight.equals(MAX_WEIGHT))
        return supply.mul(amount).div(reserveBalance);

    // return supply * ((1 + amount / reserveBalance) ^ (reserveWeight / MAX_WEIGHT) - 1)
    return supply.mul((ONE.add(amount.div(reserveBalance))).pow(reserveWeight.div(MAX_WEIGHT)).sub(ONE));
}

export function saleRate(supply, reserveBalance, reserveWeight, amount) {
    [supply, reserveBalance, reserveWeight, amount] = Array.from(arguments).map(x => new Decimal(x));

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

export function crossReserveRate(sourceReserveBalance, sourceReserveWeight, targetReserveBalance, targetReserveWeight, amount) {
    [sourceReserveBalance, sourceReserveWeight, targetReserveBalance, targetReserveWeight, amount] = Array.from(arguments).map(x => new Decimal(x));

    // special case for equal weights
    if (sourceReserveWeight.equals(targetReserveWeight))
        return targetReserveBalance.mul(amount).div(sourceReserveBalance.add(amount));

    // return targetReserveBalance * (1 - (sourceReserveBalance / (sourceReserveBalance + amount)) ^ (sourceReserveWeight / targetReserveWeight))
    return targetReserveBalance.mul(ONE.sub(sourceReserveBalance.div(sourceReserveBalance.add(amount)).pow(sourceReserveWeight.div(targetReserveWeight))));
}

export function fundCost(supply, reserveBalance, reserveRatio, amount) {
    [supply, reserveBalance, reserveRatio, amount] = Array.from(arguments).map(x => new Decimal(x));

    // special case for 0 amount
    if (amount.equals(ZERO))
        return ZERO;

    // special case if the reserve ratio = 100%
    if (reserveRatio.equals(MAX_WEIGHT))
        return (amount.mul(reserveBalance).sub(ONE)).div(supply.add(ONE));

    // return reserveBalance * (((supply + amount) / supply) ^ (MAX_WEIGHT / reserveRatio) - 1)
    return reserveBalance.mul(supply.add(amount).div(supply).pow(MAX_WEIGHT.div(reserveRatio)).sub(ONE));
}

export function fundSupplyAmount(supply, reserveBalance, reserveRatio, amount) {
    [supply, reserveBalance, reserveRatio, amount] = Array.from(arguments).map(x => new Decimal(x));

    // special case for 0 amount
    if (amount.equals(ZERO))
        return ZERO;

    // special case if the reserve ratio = 100%
    if (reserveRatio.equals(MAX_WEIGHT))
        return amount.mul(supply).div(reserveBalance);

    // return supply * ((amount / reserveBalance + 1) ^ (reserveRatio / MAX_WEIGHT) - 1)
    return supply.mul(amount.div(reserveBalance).add(ONE).pow(reserveRatio.div(MAX_WEIGHT)).sub(ONE));
}

export function liquidateRate(supply, reserveBalance, reserveRatio, amount) {
    [supply, reserveBalance, reserveRatio, amount] = Array.from(arguments).map(x => new Decimal(x));

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
    [amount, conversionFee, magnitude] = Array.from(arguments).map(x => new Decimal(x));
    return amount.mul(MAX_FEE.sub(conversionFee).pow(magnitude)).div(MAX_FEE.pow(magnitude));
}
