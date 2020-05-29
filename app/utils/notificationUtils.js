/**
 * @description
 * make a requestId
 * @output: Random id with pattern
 */
export const buildRequestId = () =>
  `${(Math.random() * 1000000000).toFixed(0)}`;
