import { SanPhamSchema, BatchSchema } from './Popup/Schema';

/**
 * Get nhãn hiển thị
 *
 * @param {number|string} value
 * @param {string} label
 * @param {string} separator
 */
export const getLabelDisplay = (value, label, separator = '-') => {
  const parts = [];

  if (value) parts.push(value);
  if (label) parts.push(label);

  return parts.join(` ${separator} `);
};

/**
 * Format dữ liệu Danh sách chi tiết đièu chỉnh
 */
export const transformDetails = datas => {
  const results = [];

  if (datas && datas.length > 0) {
    for (let i = 0, len = datas.length; i < len; i += 1) {
      const parentData = datas[i];

      if (parentData) {
        const childDatas = parentData.details;

        if (childDatas && childDatas.length > 0) {
          for (let j = 0, clen = childDatas.length; j < clen; j += 1) {
            const childData = childDatas[j];

            if (childData) {
              // Đánh dấu Row là Row đâu tiên
              const isMainRow = j === 0;

              // Đánh dấu Row là Row cuối cùng
              const isLastRow = j === clen - 1;

              let rowData = {
                rowIndex: i + 1,
                ...childData,
                baseUoM: parentData.uom,
              };
              if (isMainRow) {
                rowData = {
                  ...rowData,
                  ...parentData,
                  isMainRow: true,
                };
              }
              if (isLastRow) {
                rowData = {
                  ...rowData,
                  isLastRow: true,
                };
              }

              results.push(rowData);
            }
          }
        }
      }
    }
  }

  return results;
};

/**
 * Format ngược dữ liệu Danh sách chi tiết đièu chỉnh
 */
export const transformReverseDetails = datas => {
  const results = [];

  if (datas && datas.length > 0) {
    for (let i = 0, len = datas.length; i < len; i += 1) {
      const rowData = datas[i];

      if (rowData) {
        // Lấy thông tin chilData
        const childData = BatchSchema.cast(rowData, {
          stripUnknown: true,
        });

        if (rowData.isMainRow) {
          // Lấy thông tin parentData
          const parentData = SanPhamSchema.cast(rowData, {
            stripUnknown: true,
          });

          // Thêm childData vào parentData, và parentData vào kết quả trả về
          results[rowData.rowIndex - 1] = {
            ...parentData,
            details: [childData],
          };
        } else {
          // Lấy thông tin parentData từ kết quả trước
          const parentData = results[rowData.rowIndex - 1];

          // Thêm childData vào parentData, và parentData vào kết quả trả về
          results[rowData.rowIndex - 1] = {
            ...parentData,
            details: [...parentData.details, childData],
          };
        }
      }
    }
  }

  return results;
};
