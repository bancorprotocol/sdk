import Decimal from 'decimal.js/decimal.js';

Decimal.set({ precision: 400 });

export function fromWei(number, decimalDigits = 18) {
    if (!number) return number;
    return new Decimal(number).times(1 / 10 ** decimalDigits).toFixed();
}

export function toWei(number, decimalDigits = 18) {
    if (!number) return number;

    return new Decimal(number).times(10 ** decimalDigits).toFixed();
}
