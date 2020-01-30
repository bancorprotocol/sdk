import Decimal from 'decimal.js';

Decimal.set({precision: 100, rounding: Decimal.ROUND_DOWN});

export default Decimal;
