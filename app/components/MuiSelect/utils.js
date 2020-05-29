export function flatten(arr) {
  return arr.reduce(
    (acc, val) =>
      Array.isArray(val.options)
        ? acc.concat(flatten(val.options))
        : acc.concat(val),
    [],
  );
}

export function getFlattenValue(opts, val, getOptVal = 'value') {
  if (val === undefined) return undefined;

  const getOptionValue =
    typeof getOptVal === 'string' ? opt => opt[getOptVal] : getOptVal;

  const options = flatten(opts);
  const value = options.find(o => getOptionValue(o) === val);

  return value;
}
