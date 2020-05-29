/**
 * Convert columns to rows
 * @param {array} columns
 */
export const convert = columns => {
  const [tree, max] = build(columns);
  const results = flatten([], tree, max);
  return results;
};

/**
 * Convert to Tree type
 * @param {array} list
 * @param {string} parent
 * @param {number} level
 * @returns Returns `array`
 *
 * @example
 * const list = [
 *   { field: 'A' },
 *   { field: 'A1', parentField: 'A' },
 *   { field: 'A2', parentField: 'A' },
 *   { field: 'B' },
 * ];
 * const tree = build(list);
 *
 * [
 *   {
 *     field: 'A',
 *     children: [
 *       { field: 'A1', parentField: 'A' },
 *       { field: 'A2', parentField: 'A' },
 *     ],
 *   },
 *   { field: 'B' },
 * ]
 */
export const build = (list, parent, level = 0) => {
  const tree = [];
  let max = level;

  for (let i = 0, len = list.length; i < len; i += 1) {
    const node = { ...list[i], level };

    if (node.parentField === parent) {
      if (node.field) {
        let children;
        [children, max] = build(list, node.field, level + 1);

        if (children && children.length > 0) {
          node.children = children;
        }
      }

      if (!node.hidden || node.children) {
        tree.push(node);
      }
    }
  }

  return [tree, max];
};

/**
 * Convert Tree to list table rows with colspan && rowspan
 * @param {array} results
 * @param {array} tree
 * @param {number} max is max level of tree
 * @returns Returns `array`
 *
 * @example
 * const max = 1;
 * const tree = [
 *   {
 *     field: 'A',
 *     children: [
 *       { field: 'A1', parentField: 'A' },
 *       { field: 'A2', parentField: 'A' },
 *     ],
 *   },
 *   { field: 'B' },
 * ];
 * const results = flatten([], tree, max);
 *
 * [
 *   [ // Row 1
 *     { field: 'A', colSpan: 2 },
 *     { field: 'B', rowSpan: 2 },
 *   ],
 *   [ // Row 2
 *     { field: 'A1', parentField: 'A' },
 *     { field: 'A2', parentField: 'A' },
 *   ],
 * ]
 */
export const flatten = (results, tree, max) => {
  for (let i = 0, len = tree.length; i < len; i += 1) {
    const { children, level, ...node } = tree[i];

    let rowSpan = 0;
    let colSpan = 0;

    /* eslint-disable no-param-reassign */
    if (!results[level]) {
      results[level] = [];
    }

    if (max - level > 0) {
      rowSpan = max - level + 1;
    }

    if (children && children.length > 0) {
      rowSpan = 0;
      colSpan = children.length;

      results = flatten(results, children, max);
    }

    if (!node.cellProps) {
      node.cellProps = {};
    }
    if (rowSpan > 1) {
      node.cellProps.rowSpan = rowSpan;
    }
    if (colSpan > 1) {
      node.cellProps.colSpan = colSpan;
    }

    results[level].push(node);
  }

  return results;
};

/**
 * Comparison between two data, use with material-table
 *
 * @param {array} array is current data
 * @param {array} other is received data
 */
export const difference = (array, other) => {
  if (array && other) {
    if (array.length === other.length) {
      for (let i = 0; i < array.length; i += 1) {
        const { tableData, ...value } = array[i];
        if (JSON.stringify(value) !== JSON.stringify(other[i])) {
          return true;
        }
      }
      return false;
    }
  }
  return true;
};
