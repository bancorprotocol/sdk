import Decimal from 'decimal.js/decimal.js';

Decimal.set({ precision: 400 });

export function decimalDivide(a, b) {
    if (a === 0 && b === 0) return 0;
    return new Decimal(a).div(b).toNumber();
}

export function decimalMultiply(a, b) {
    return new Decimal(a).mul(b).toNumber();
}

export function decimalPower(a, b) {
    return new Decimal(a).pow(b).toNumber();
}

export function decimalAdd(amount = 0, addAmount = 0) {
    return Decimal.add(amount || 0, addAmount || 0).toFixed();
}

export function decimalSub(amount: string | number = 0, addAmount: string | number = 0) {
    return Decimal.sub(amount || 0, addAmount || 0).toFixed();
}
