import { constructorListTable } from './Schema';
export const makeTableColumns = () => {
  const { dto } = constructorListTable;
  const defaultCol = Object.keys(dto).map(key => {
    const item = dto[key];
    return {
      title: item.label,
      field: item.key,
      headerStyle: item.headerStyle,
      cellStyle: item.cellStyle,
      sorting: false,
      hidden: item.hidden,
      render: RowData => item.render(RowData),
    };
  });
  return defaultCol;
};
