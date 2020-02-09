/* eslint-disable max-len */
import * as math from './math';

export function shortConvert(toTokenAmount, toTokenReserveBalance, toTokenReserve) {
    return math.decimalMultiply(toTokenReserveBalance, math.decimalDivide(toTokenAmount, math.decimalAdd(toTokenAmount, toTokenReserve)));
}

export function buySmartToken(tokenReserveBalance, tokenReserveRatio, amount, smartTokenSupply) {
    return math.decimalMultiply(smartTokenSupply, math.decimalSub(math.decimalPower(math.decimalAdd(1, math.decimalDivide(amount, tokenReserveBalance)), math.decimalDivide(tokenReserveRatio, '1000000')), 1));
}

export function sellSmartToken(tokenReserveBalance, tokenReserveRatio, amount, smartTokenSupply) {
    return math.decimalMultiply(tokenReserveBalance, math.decimalSub(1, math.decimalPower(math.decimalSub(1, math.decimalDivide(amount, smartTokenSupply)), math.decimalDivide(1, math.decimalDivide(tokenReserveRatio, '1000000')))));
}

export function returnWithFee(amountBeforeFee, conversionFee, magnitude, feeResolution = '1000000') {
    return math.decimalMultiply(amountBeforeFee, math.decimalDivide(math.decimalPower(math.decimalSub(feeResolution, conversionFee), magnitude), math.decimalPower(feeResolution, magnitude)));
}
