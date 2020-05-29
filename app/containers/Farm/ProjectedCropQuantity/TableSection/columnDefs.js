/**
 * Generate table columns' definitions
 * @param dateColumns - dynamic date columns returned from server
 * @returns {*[]}
 */
export const makeTableColumns = (dateColumns = []) => {
  const defaultColumns = [
    {
      title: 'LSX',
      field: 'productionOrder',
      headerStyle: {
        minWidth: 100,
      },
    },
    {
      title: 'Mã Farm',
      field: 'plantCode',
      headerStyle: {
        minWidth: 80,
      },
    },
    {
      title: 'Tên Farm',
      field: 'plantName',
      headerStyle: {
        minWidth: 120,
      },
      sorting: false,
    },
    {
      title: 'Mã sản phẩm',
      field: 'productCode',
      headerStyle: {
        minWidth: 100,
      },
    },
    {
      title: 'Tên sản phẩm',
      field: 'productName',
      headerStyle: {
        minWidth: 150,
      },
      sorting: false,
    },
  ];

  return [...defaultColumns, ...dateColumns];
};
