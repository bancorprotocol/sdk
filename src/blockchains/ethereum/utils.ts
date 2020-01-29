import Decimal from 'decimal.js/decimal.js';

Decimal.set({precision: 100, rounding: Decimal.ROUND_DOWN});

export function fromWei(number, decimalDigits = 18) {
    return new Decimal(`${number}e-${decimalDigits}`).toFixed();
}

export function toWei(number, decimalDigits = 18) {
    return new Decimal(`${number}e+${decimalDigits}`).toFixed();
}
