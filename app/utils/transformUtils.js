/**
 * Merge 2 column, support function `cellEditorParams`
 *
 * @param {object} defColumn
 * @param {object} optionColumn
 * @returns {object} column merged
 */
export const mergeColumnDef = (defColumn, optionColumn) => {
  let mergedColumn = {
    ...defColumn,
    ...optionColumn,
  };

  if (
    typeof defColumn.cellEditorParams === 'function' &&
    typeof optionColumn.cellEditorParams === 'function'
  ) {
    mergedColumn = {
      ...mergedColumn,
      cellEditorParams: params => ({
        ...defColumn.cellEditorParams(params),
        ...optionColumn.cellEditorParams(params),
      }),
    };
  }

  return mergedColumn;
};

export const getColumnDefs = (defaultColumns, optionColumns = {}) => {
  const results = [];

  Object.keys(defaultColumns).forEach(colField => {
    const { group: groupDef, ...colDef } = defaultColumns[colField];

    if (colField in optionColumns) {
      if (optionColumns[colField]) {
        const { group: groupOption, ...colOption } = optionColumns[colField];

        if (groupDef) {
          results.push({
            ...colOption,
            ...colDef,
            children: getColumnDefs(groupDef, groupOption),
          });
        } else {
          results.push(mergeColumnDef(colDef, colOption));
        }
      }
    } else if (groupDef) {
      results.push({
        ...colDef,
        children: getColumnDefs(groupDef),
      });
    } else {
      results.push(colDef);
    }
  });

  return results;
};

export const transformAsyncOptions = (
  onGetAutocomplete,
  labelKey = 'label',
  sublabelKey = 'value',
) => (inputText, callback) =>
  onGetAutocomplete(inputText, options => {
    const results = transformOptions(options, labelKey, sublabelKey);
    callback(results);
  });

export const transformAsyncOptionsWithParams = (
  onGetAutocomplete,
  params = {},
  labelKey = 'label',
  sublabelKey = 'value',
) => (inputText, callback) =>
  onGetAutocomplete(params, inputText, options => {
    const results = transformOptions(options, labelKey, sublabelKey);
    // console.log(results);
    callback(results);
  });

export const transformOptions = (
  options = [],
  labelKey = 'label', // If is `null` will skip transform
  sublabelKey = 'value',
) => {
  const results = [];

  if (options && options.length > 0) {
    const maxLength = 100;
    const len = options.length > maxLength ? maxLength : options.length;

    for (let i = 0; i < len; i += 1) {
      const option = options[i];

      if (labelKey) {
        const nextOption = {
          label: option[labelKey],
          value: option,
        };

        if (sublabelKey && option[sublabelKey]) {
          nextOption.sublabel = option[sublabelKey];
        }
        results.push(nextOption);
      } else {
        results.push(option);
      }
    }
  }

  return results;
};
