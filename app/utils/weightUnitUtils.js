/**
 * @map define units
 */
export const UNIT_WEIGHT = new Map([
  ['kg', 1000],
  ['g', 1],
  ['kilogram', 1],
  ['lb', 453.592], // pound
  ['lbs', 453.592], // pound
]);

/**
 * @description
 * utils function for convert unit
 * @e.g: convert from g to kg
 * input 100
 * output: 0.1
 */

/**
 * @param {unitString} unit (string) gotten
 * @eg : getUnitFromString('kg') => 1000
 */
export const getUnitFromString = unitString => {
  const localizeUnit = unitString.toLowerCase().trim();
  return UNIT_WEIGHT.get(localizeUnit);
};

/**
 * @param {weight: number}
 * @param {from: string} convert from unit
 * @param {to: UNIT} to unit
 *
 * @eg : weighTo(100, 'g', UNIT.kg) => 0.1
 */
export function weighTo(weight, from, to) {
  // return Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(
  //   weight * (from / to),
  // );
  return weight * (from / to);
}
