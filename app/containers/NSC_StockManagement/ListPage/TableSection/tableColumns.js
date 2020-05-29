export const getStyle = (rowData, field) => {
  if (rowData[field] === 1) {
    return {
      backgroundColor: '#DCE6F1',
      color: '#2EA365',
    };
  }
  if (rowData[field] === 2) {
    return {
      backgroundColor: '#F2DCDB',
      color: '#EEA037',
    };
  }
  if (rowData[field] === 3) {
    return {
      backgroundColor: '#FF0000',
      color: '#FFFFFF',
    };
  }
  return {};
};

export const getStyle2 = rowData => {
  if (rowData.purposeStorage === 1) {
    return {
      backgroundColor: '#2EA365',
      color: '#FFFFFF',
    };
  }
  return {};
};
