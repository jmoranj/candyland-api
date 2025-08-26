import { Decimal } from 'decimal.js';

export function toDecimal(value: string | number | Decimal): Decimal {
  return new Decimal(value);
}

export function format(value: Decimal | string | number, places = 4): string {
  return toDecimal(value).toFixed(places, Decimal.ROUND_HALF_UP);
}

export function sum(values: Array<Decimal | string | number>): Decimal {
  return values.reduce<Decimal>(
    (acc, val) => acc.plus(toDecimal(val)),
    new Decimal(0),
  );
}
