import Decimal from 'decimal.js';

const ZERO = new Decimal(0);
const ONE = new Decimal(1);
const MAX_RATIO = new Decimal(1000000);
const MAX_FEE = new Decimal(1000000);

export function calculatePurchaseReturn(supply, reserveBalance, reserveRatio, depositAmount) {
    [supply, reserveBalance, reserveRatio, depositAmount] = Array.from(arguments).map(x => new Decimal(x));

    // special case for 0 deposit amount
    if (depositAmount.equals(ZERO))
        return ZERO;

    // special case if the ratio = 100%
    if (reserveRatio.equals(MAX_RATIO))
        return supply.mul(depositAmount).div(reserveBalance);

    // return supply * ((1 + depositAmount / reserveBalance) ^ (reserveRatio / 1000000) - 1)
    return supply.mul((ONE.add(depositAmount.div(reserveBalance))).pow(reserveRatio.div(MAX_RATIO)).sub(ONE));
}

export function calculateSaleReturn(supply, reserveBalance, reserveRatio, sellAmount) {
    [supply, reserveBalance, reserveRatio, sellAmount] = Array.from(arguments).map(x => new Decimal(x));

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

export function calculateCrossReserveReturn(fromReserveBalance, fromReserveRatio, toReserveBalance, toReserveRatio, amount) {
    [fromReserveBalance, fromReserveRatio, toReserveBalance, toReserveRatio, amount] = Array.from(arguments).map(x => new Decimal(x));

    // special case for equal ratios
    if (fromReserveRatio.equals(toReserveRatio))
        return toReserveBalance.mul(amount).div(fromReserveBalance.add(amount));

    // return toReserveBalance * (1 - (fromReserveBalance / (fromReserveBalance + amount)) ^ (fromReserveRatio / toReserveRatio))
    return toReserveBalance.mul(ONE.sub(fromReserveBalance.div(fromReserveBalance.add(amount)).pow(fromReserveRatio.div(toReserveRatio))));
}

export function calculateFundCost(supply, reserveBalance, totalRatio, amount) {
    [supply, reserveBalance, totalRatio, amount] = Array.from(arguments).map(x => new Decimal(x));

    // special case for 0 amount
    if (amount.equals(ZERO))
        return ZERO;

    // special case if the total ratio = 100%
    if (totalRatio.equals(MAX_RATIO))
        return (amount.mul(reserveBalance).sub(ONE)).div(supply.add(ONE));

    // return reserveBalance * (((supply + amount) / supply) ^ (MAX_RATIO / totalRatio) - 1)
    return reserveBalance.mul(supply.add(amount).div(supply).pow(MAX_RATIO.div(totalRatio)).sub(ONE));
}

export function calculateLiquidateReturn(supply, reserveBalance, totalRatio, amount) {
    [supply, reserveBalance, totalRatio, amount] = Array.from(arguments).map(x => new Decimal(x));

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

export function getFinalAmount(amount, conversionFee, magnitude) {
    [amount, conversionFee, magnitude] = Array.from(arguments).map(x => new Decimal(x));
    return amount.mul(MAX_FEE.sub(conversionFee).pow(magnitude)).div(MAX_FEE.pow(magnitude));
}
