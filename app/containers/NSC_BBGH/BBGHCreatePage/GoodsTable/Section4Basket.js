import React from 'react';
import FormData from 'components/FormikUI/FormData';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import styled from 'styled-components';
import ConfirmationDialog from 'components/ConfirmationDialog';
import MuiInputEditor from 'components/MuiInput/Editor';
import MuiSelectInputEditor from 'components/MuiSelect/InputEditor';
import NumberFormatter from 'components/NumberFormatter';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { groupBy } from 'lodash';
import { getRowStyle } from 'utils/index';
import PinnedRowRenderer from 'components/FormikUI/PinnedRowRenderer';
import CellRenderer from 'components/FormikUI/CellRenderer';
import { formatToNumber, formatToCurrency, sumBy } from 'utils/numberUtils';
import { Link } from 'react-router-dom';
import { BasketSchema } from '../section4Schema';
import { NUM_PER_PAGE } from '../constants';

export const numericParser = params => {
  if (params.newValue === '0') {
    return 0;
  }
  return formatToNumber(params.newValue) || undefined;
};
export const numberCurrency = params =>
  params.value ? formatToCurrency(params.value) : params.value;

export const orderNumberRenderer = ({ data, rowIndex }) =>
  data.totalCol ? '' : rowIndex + 1;

const DeleteButtonStyled = styled(({ removeRow, ...props }) => (
  <IconButton {...props} onClick={removeRow} />
))`
  margin: 0px !important;
  padding: 5px !important;
  font-size: 12px !important;
`;
const listTitle = {
  marginTop: 30,
  marginBottom: 30,
};

const columnDefs = isEditing => {
  const result = [
    {
      headerName: 'STT',
      field: 'stt',
      width: 50,
      cellRendererFramework: orderNumberRenderer,
    },
    {
      headerName: 'Mã Khay Sọt',
      field: 'basketCode',
      width: 120,
      cellEditorFramework: MuiSelectInputEditor,
      cellEditorParams: ({ context, rowIndex }) => ({
        options: context.props.baskets,
        valueKey: 'basketCode',
        labelKey: 'basketCode',
        sublabelKey: 'basketName',
        isClearable: true,
        isSearchable: true,
        validBeforeChange: option => {
          const basketList = [...context.props.values.basketList].filter(
            row => row !== undefined,
          );
          basketList.push(option);
          const keys = basketList
            .map(row => ({
              basketCode: row.basketCode,
            }))
            .map(group => JSON.stringify(group));
          if (new Set(keys).size !== keys.length) {
            context.props.onAlertInvalidWhenSubmit(
              'Mã khay sọt đã đươc lựa chọn',
            );
            return false;
          }
          return true;
        },
        onChange: option => {
          const nextData = {
            basketCode: option.basketCode,
            basketName: option.basketName,
            basketUom: option.basketUoM,
            deliverQuantity: 0,
            receiverQuantity: 0,
          };
          context.props.updateFieldArrayValue('basketList', rowIndex, nextData);
        },
      }),
      editable: isEditing,
    },
    {
      headerName: 'Tên Khay Sọt',
      field: 'basketName',
      suppressSizeToFit: true,
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
    },
    {
      headerName: 'Đơn Vị Tính',
      field: 'basketUom',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      width: 80,
    },
    {
      headerName: 'Số Lượng Giao',
      field: 'deliverQuantity',
      headerClass: 'ag-numeric-header',
      cellStyle: {
        textAlign: 'right',
      },
      pinnedRowCellRendererParams: {
        valueFormatter: numberCurrency,
      },
      cellClass: 'ag-numeric-cell',
      valueParser: numericParser,
      valueFormatter: numberCurrency,
      editable: ({ data }) => data.basketCode && isEditing,
      cellRendererFramework: CellRenderer,
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      width: 100,
      cellEditorFramework: MuiInputEditor,
      cellEditorParams: () => ({
        InputProps: {
          inputComponent: NumberFormatter,
        },
      }),
    },
    {
      headerName: 'Số Lượng Nhận',
      field: 'receiverQuantity',
      headerClass: 'ag-numeric-header',
      cellStyle: {
        textAlign: 'right',
      },
      pinnedRowCellRendererParams: {
        valueFormatter: numberCurrency,
      },
      cellClass: 'ag-numeric-cell',
      valueParser: numericParser,
      valueFormatter: numberCurrency,
      editable: false,
      cellRendererFramework: CellRenderer,
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      width: 100,
      cellEditorFramework: MuiInputEditor,
      cellEditorParams: () => ({
        InputProps: {
          inputComponent: NumberFormatter,
        },
      }),
    },
    {
      headerName: 'Ghi Chú',
      field: 'notes',
      editable: ({ data }) => data.basketCode && isEditing,
      cellEditorFramework: MuiInputEditor,
    },
  ];

  if (isEditing) {
    result.push({
      headerName: '',
      field: 'actions',
      cellClass: 'cell-action-butons',
      width: 60,
      editable: false,
      // eslint-disable-next-line react/prop-types
      cellRendererFramework: ({ data, context, rowIndex }) =>
        data.basketCode && isEditing ? (
          <div>
            <Tooltip title="Xóa">
              <DeleteButtonStyled
                removeRow={() => context.confirmRemoveRecord(data, rowIndex)}
              >
                <DeleteIcon fontSize="small" />
              </DeleteButtonStyled>
            </Tooltip>
          </div>
        ) : (
          <div />
        ),
    });
  }
  return result;
};

export const defaultColDef = {
  resizable: false,
  valueSetter: params => {
    if (params.colDef.field === 'basketCode' && params.newValue === '')
      return false;
    let updaterData = {
      [params.colDef.field]: params.newValue,
    };

    if (params.data.basketCode === undefined) {
      updaterData = {
        ...{
          basketCode: '',
          basketName: '',
          basketUom: '',
          deliverQuantity: '',
          receiverQuantity: '',
          notes: '',
        },
        ...updaterData,
      };
    }

    params.context.props.updateFieldArrayValue(
      'basketList',
      params.node.rowIndex,
      updaterData,
    );
    return true;
  },
  suppressMovable: true,
  cellEditorFramework: undefined,
};

const columnDefDetails = [
  {
    headerName: 'STT',
    field: 'stt',
    width: 50,
    cellRendererFramework: orderNumberRenderer,
  },
  {
    headerName: 'Loại Phiếu',
    field: 'basketDocumentTypeName',
  },
  {
    headerName: 'Mã Phiếu',
    field: 'basketDocumentCode',
    width: 150,
    valueGetter: rowData => {
      if (rowData.data.status === 1 && rowData.data.type === 1) {
        const link = `/danh-sach-phieu-nhap-khay-sot/chinh-sua-phieu-nhap-kho-khay-sot?form=2&id=${
          rowData.data.id
        }`;
        return (
          <Link
            to={link}
            style={{
              textDecoration: 'none',
              // color: 'black',
            }}
          >
            {rowData.data.basketDocumentCode}
          </Link>
        );
      }
      if (rowData.data.status !== 1 && rowData.data.type === 1) {
        const link = `/danh-sach-phieu-nhap-khay-sot/xem-phieu-nhap-kho-khay-sot?form=3&id=${
          rowData.data.id
        }`;
        return (
          <Link
            to={link}
            style={{
              textDecoration: 'none',
              // color: 'black',
            }}
          >
            {rowData.data.basketDocumentCode}
          </Link>
        );
      }
      if (rowData.data.status === 1 && rowData.data.type === 2) {
        const link = `/danh-sach-phieu-xuat-kho-khay-sot/chinh-sua-phieu-xuat-kho-khay-sot?id=${
          rowData.data.id
        }&form=2&isCancelReceipt=false
            `;
        return (
          <Link
            to={link}
            style={{
              textDecoration: 'none',
              // color: 'black',
            }}
          >
            {rowData.data.basketDocumentCode}
          </Link>
        );
      }
      if (rowData.data.status !== 1 && rowData.data.type === 2) {
        const link = `/danh-sach-phieu-xuat-kho-khay-sot/xem-phieu-xuat-kho-khay-sot?id=${
          rowData.data.id
        }&form=3&isCancelReceipt=false
            `;
        return (
          <Link
            to={link}
            style={{
              textDecoration: 'none',
              // color: 'black',
            }}
          >
            {rowData.data.basketDocumentCode}
          </Link>
        );
      }
      return rowData.data.basketDocumentCode;
    },
  },
];

export default class Section4BasketTable extends React.Component {
  state = {
    datas: [],
  };

  constructor(props) {
    super(props);
    this.gridOptions = { alignedGrids: [] };
    this.totalOptions = { alignedGrids: [], suppressHorizontalScroll: true };
  }

  componentDidMount() {
    this.addRecord(NUM_PER_PAGE);
    this.gridOptions.alignedGrids.push(this.totalOptions);
    this.totalOptions.alignedGrids.push(this.gridOptions);
  }

  confirmRef = null;

  createInitRecords = (numRecords = NUM_PER_PAGE) => {
    const records = [];

    for (let i = 0; i < numRecords; i += 1) {
      const row = new BasketSchema();
      records.push(row);
    }
    return records;
  };

  addRecord(numRecords = 5) {
    const { datas } = this.state;
    const nextDatas = datas.slice();

    const nextRecords = this.createInitRecords(numRecords);

    nextDatas.push(...nextRecords);

    this.setState({ datas: nextDatas });
  }

  confirmRemoveRecord(rowData, rowIndex) {
    this.showConfirm({
      message: 'Bạn chắc chắn muốn xóa?',
      actions: [
        { text: 'Hủy' },
        {
          text: 'Đồng ý',
          color: 'primary',
          onClick: () => this.removeRecord(rowData, rowIndex),
        },
      ],
    });
  }

  removeRecord(rowData, rowIndex) {
    const { basketList } = this.props.values;
    basketList.splice(rowIndex, 1);
    this.props.updateFieldArrayValue('basketList', basketList);
  }

  showConfirm = options => {
    if (this.confirmRef) {
      this.confirmRef.showConfirm(options);
    }
  };

  mergeRowData = (datas, newDatas) => {
    const results = [];
    for (let i = 0, len = datas.length; i < len; i += 1) {
      if (newDatas[i]) {
        results[i] = newDatas[i];
      } else {
        results[i] = datas[i];
      }
    }
    return results;
  };

  onGridReady = params => {
    this.gridApi = params.api;
  };

  onNewColumnsLoaded = () => {
    if (this.gridApi) {
      this.gridApi.sizeColumnsToFit();
    }
  };

  getTotalBasketInfo = () => {
    const result = [];
    const basketList = this.props.formik.values.basketList.filter(
      row => row !== undefined,
    );
    const grouped = groupBy(basketList, 'basketUom');

    if (Object.keys(grouped).length === 1) {
      result.push({
        totalCol: true,
        basketUom: 'Tổng',
        deliverQuantity: sumBy(
          this.props.formik.values.basketList,
          'deliverQuantity',
        ),
        receiverQuantity: sumBy(
          this.props.formik.values.basketList,
          'receiverQuantity',
        ),
        // basketUom:
        //   this.props.formik.values.basketList[0] &&
        //   this.props.formik.values.basketList[0].basketUom,
      });
      return result;
    }
    if (Object.keys(grouped).length > 1) {
      result.push({
        totalCol: true,
        basketUom: 'Tổng',
        deliverQuantity: sumBy(
          this.props.formik.values.basketList,
          'deliverQuantity',
        ),
        receiverQuantity: sumBy(
          this.props.formik.values.basketList,
          'receiverQuantity',
        ),
      });
      Object.keys(grouped).forEach(item => {
        result.push({
          totalCol: true,
          deliverQuantity: sumBy(grouped[item], 'deliverQuantity'),
          receiverQuantity: sumBy(grouped[item], 'receiverQuantity'),
          // basketUom: item,
        });
      });
    }
    return result;
  };

  render() {
    const { values, isEditing, formik, isCreate } = this.props;
    const { basketList } = values;
    const defaultColDefDetail = {
      suppressMovable: true,
    };
    return (
      <>
        <FormData
          idGrid="grid-section5-basket"
          {...this.props}
          name="basketList"
          rowData={this.mergeRowData(this.state.datas, basketList)}
          columnDefs={columnDefs(isEditing)}
          gridStyle={{
            height: 450,
          }}
          defaultColDef={defaultColDef}
          gridProps={{
            context: this,
            gridOptions: this.gridOptions,
            onNewColumnsLoaded: this.onNewColumnsLoaded,
            pinnedBottomRowData: this.getTotalBasketInfo(),
            frameworkComponents: {
              customPinnedRowRenderer: PinnedRowRenderer,
            },
            getRowStyle,
          }}
          autoLayout
          onGridReady={this.onGridReady}
        />
        {!isCreate && (
          <div style={listTitle}>
            <div>
              <Typography variant="h6" gutterBottom>
                Danh sách phiếu nhập/xuất khay sọt
              </Typography>
            </div>

            <FormData
              name="basketDocumentList"
              columnDefs={columnDefDetails}
              defaultColDef={defaultColDefDetail}
              gridStyle={{
                height: 200,
              }}
              {...formik}
            />
          </div>
        )}
        <ConfirmationDialog
          ref={ref => {
            this.confirmRef = ref;
          }}
        />
      </>
    );
  }
}

Section4BasketTable.propTypes = {
  /**
   * @formik props pass from Formik
   */
  formik: PropTypes.object,
  isCreate: PropTypes.bool,
};
