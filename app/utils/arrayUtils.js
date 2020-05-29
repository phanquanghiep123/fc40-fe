export const addRowIndexToArray = data => {
  const result =
    (!!data &&
      data.length > 0 &&
      data.map((obj, index) => ({
        rowIndex: index + 1,
        ...obj,
      }))) ||
    data;
  return result;
};
