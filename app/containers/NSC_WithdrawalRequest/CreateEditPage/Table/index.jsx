import React, { PureComponent, Fragment, createRef } from 'react';
import PropTypes from 'prop-types';
import { getIn } from 'formik';
import { debounce } from 'lodash';

import { Grid } from '@material-ui/core';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';

import { SEARCH_DEBOUNCE_DELAY } from 'utils/constants';
import { isValidProductList } from 'utils/validation';

import TableFormData from 'components/FormikUI/FormData';

import Expansion from 'components/Expansion';
import MuiButton from 'components/Button/Button';
import MuiInputEditor from 'components/MuiInput/Editor';
import MuiSelectEditor from 'components/MuiSelect/Editor';
import MuiSelectInputEditor from 'components/MuiSelect/InputEditor';
import CellRenderer from 'components/FormikUI/CellRenderer';

import NumberFormatter from 'components/NumberFormatter';
import { validDecimal } from 'components/NumberFormatter/utils';

import { build } from 'utils/querystring';
import { PATH_GATEWAY } from 'utils/request';

import {
  get,
  deleteRequest,
  parseNumberCellValue,
  formatCurrencyTableCell,
  formatCurrency,
  defaultToZero,
  makeConfirmationOption,
  makeArrayOfProductCast,
  post,
  toNumber,
} from '../utils';
import {
  GET_REGIONS_API,
  GET_PRODUCTS_API,
  WITHDRAWAL_ISSUE_CHANNEL,
  IMPORT_EXCEL_FILE,
} from '../constants';

import ButtonDeleteRow from './ButtonDeleteRow';
import ButtonDeleteApi from './ButtonDeleteApi';

import { DETAILS_COMMANDS_KEY } from '../reducer';
import {
  DELETE_CONFIRMATION,
  ADD_ROWS,
  IMPORT_CONFIRMATION,
  CONFIRMATION_GENERAL_TITLE,
} from '../messages';
import { acceptExcelFileTypes } from '../mimeTypes';

const colDeleteRow = {
  headerName: '',
  field: 'actions',
  cellClass: 'cell-action-butons',
  editable: false,
  cellRendererFramework: ButtonDeleteRow,
  suppressNavigable: true,
  suppressSizeToFit: true,
  width: 60,
};

const colDeleteApi = {
  headerName: '',
  field: 'actions',
  cellClass: 'cell-action-butons',
  editable: false,
  cellRendererFramework: ButtonDeleteApi,
  suppressNavigable: true,
  suppressSizeToFit: true,
  width: 60,
};

const duplicateClasses = [
  'dupplicate-row-1',
  'dupplicate-row-2',
  'dupplicate-row-3',
  'dupplicate-row-4',
  'dupplicate-row-5',
];
let distinctDuplication = 0;

export default class ProductTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // eslint-disable-next-line react/no-unused-state
      regions: [],
      total: 0,
    };

    this.getRegions();
    this.inputFileRef = createRef();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.formik.values.retailRequestCode !==
      this.props.formik.values.retailRequestCode
    ) {
      this.calculateTotal();
    }
  }

  rowKeys = new Map();

  // #region methods

  handleAddRecord = () => {
    this.addRecords();
  };

  addRecords = (quantity = 5) => {
    const { formik } = this.props;
    formik.setFieldValue(
      DETAILS_COMMANDS_KEY,
      formik.values.detailsCommands.concat(makeArrayOfProductCast(quantity)),
    );
  };

  removeRecord = (rowData, rowIndex) => {
    const { formik } = this.props;
    const newList = formik.values.detailsCommands.filter(
      (item, index) => index !== rowIndex,
    );

    formik.setFieldValue(DETAILS_COMMANDS_KEY, newList);
    setImmediate(this.calculateTotal);
  };

  showConfirmationRemovingRecord = (rowData, rowIndex) => {
    this.props.showConfirmation(
      makeConfirmationOption(DELETE_CONFIRMATION, () =>
        this.removeRecord(rowData, rowIndex),
      ),
    );
  };

  showConfirmationDeletingRecord = (id, rowIndex) => {
    this.props.showConfirmation(
      makeConfirmationOption(DELETE_CONFIRMATION, () =>
        this.deleteProduct(id, rowIndex),
      ),
    );
  };

  /* eslint-disable no-plusplus */
  getRowClass = params => {
    const {
      data,
      context: { rowKeys },
    } = params;

    if (params.rowIndex === 0) {
      const tempKeys = {};

      // add first time appeared key to `tempKeys`,
      // if that key appears again, add it to `this.rowKeys`
      params.context.props.formik.values.detailsCommands.forEach(row => {
        if (isRowValid(row)) {
          const key = getRowKey(row);
          if (tempKeys[key]) {
            tempKeys[key]++;

            if (!rowKeys.has(key)) {
              rowKeys.set(key, duplicateClasses[distinctDuplication]); // get these values from a pre-defined list
              distinctDuplication++;

              // loop back to start
              if (distinctDuplication >= duplicateClasses.length) {
                distinctDuplication = 0;
              }
            }
          } else {
            tempKeys[key] = 1;
          }
        }
      });

      // delete keys that only appear 1 time
      // eslint-disable-next-line no-restricted-syntax
      for (const prop in tempKeys) {
        if (tempKeys[prop] === 1) {
          rowKeys.delete(prop);
        }
      }
    }

    // return the duplicate class
    if (isRowValid(data)) {
      const key = getRowKey(data);
      if (rowKeys.has(key)) {
        return rowKeys.get(key);
      }
    }

    return '';
  };
  /* eslint-enable no-plusplus */

  calculateTotal = () => {
    const { formik } = this.props;

    let sum = 0;

    formik.values.detailsCommands.forEach(item => {
      if (item) {
        sum +=
          Number(defaultToZero(item.unitPrice)) *
          Number(defaultToZero(item.exportedQuantity));
      }
    });

    this.setState({
      total: sum,
    });
  };

  handleOpenFileBrowser = ev => {
    const {
      formik: {
        values: { detailsCommands },
      },
      showConfirmation,
    } = this.props;
    ev.preventDefault();

    if (isValidProductList(detailsCommands)) {
      showConfirmation(
        makeConfirmationOption(
          IMPORT_CONFIRMATION,
          this.openFileBrowser,
          CONFIRMATION_GENERAL_TITLE,
        ),
      );
    } else {
      this.openFileBrowser();
    }
  };

  openFileBrowser = () => {
    this.inputFileRef.current.click();
  };

  // #endregion

  // #region api request

  getRegions = async () => {
    get(`${GET_REGIONS_API}`, response => {
      this.setState({
        // eslint-disable-next-line react/no-unused-state
        regions: response.data
          .filter(region => region.isActive)
          .map(region => ({
            id: region.regionId,
            value: region.value,
            label: region.name,
          })),
      });
    });
  };

  deleteProduct = (id, rowIndex) => {
    deleteRequest(
      `${
        PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
      }/exported-retail-request/${id}/delete-retail-request-stock`,
      response => {
        this.removeRecord(undefined, rowIndex);
        this.props.notifySuccess(response.message);
      },
    );
  };

  handleImportFile = async ev => {
    const { formik } = this.props;

    if (ev.target.files.length > 0) {
      const data = new FormData();
      data.append('UploadingFile', ev.target.files[0]);

      await post(IMPORT_EXCEL_FILE, data, response => {
        this.props.notifySuccess(response.message);

        if (response.data.ok) {
          const products = response.data.dataResult;

          products.forEach(row => {
            const selectedRegion = this.state.regions.filter(
              region => region.value === row.regionCode,
            );
            /* eslint-disable no-param-reassign */
            row.exportedQuantity = toNumber(row.exportedQuantity);
            row.unitPrice = toNumber(row.unitPrice);
            row.slotCode = row.batch;
            row.regionName =
              selectedRegion.length > 0 && selectedRegion[0].label;
            /* eslint-enable no-param-reassign */
          });

          this.props.formik.setFieldValue(DETAILS_COMMANDS_KEY, products, true);
          this.calculateTotal();

          setImmediate(() => {
            formik
              .validateForm({
                [DETAILS_COMMANDS_KEY]: products,
              })
              .then(result => {
                formik.setTouched(result);
              });
          });
        }
      });

      this.inputFileRef.current.value = '';
    }
  };

  // #endregion

  // #region column defs

  onGridReady = params => {
    const { isCreatePage, isEditPage, isViewPage } = this.props;
    this.gridApi = params.api;
    // this.gridColumnApi = params.columnApi;

    if (isCreatePage || isEditPage) {
      this.columns.push(colDeleteRow);
    } else if (isViewPage) {
      this.columns.push(colDeleteApi);
    }

    this.gridApi.setColumnDefs(this.columns);
  };

  isCellEditable = params =>
    this.props.isEditableStatus && params.data.productCode;

  columns = [
    {
      headerName: 'STT',
      field: 'stt',
      width: 40,
      editable: false,
      suppressSizeToFit: true,
      // cellClass: CELL_NUMBER_CLASS,
    },
    {
      headerName: 'Vùng sản xuất',
      field: 'regionName',
      tooltipField: 'regionName',
      editable: this.props.isEditableStatus,
      cellEditorFramework: MuiSelectInputEditor,
      cellRendererFramework: CellRenderer,
      cellEditorParams: ({ context, rowIndex }) => ({
        options: context.state.regions,
        valueKey: 'label',
        labelKey: 'label',
        isClearable: true,
        isMultiline: false,
        defaultOptions: false,
        onChange: option => {
          context.props.formik.updateFieldArrayValue(
            DETAILS_COMMANDS_KEY,
            rowIndex,
            {
              regionCode: option.value,
              regionName: option.label,
            },
          );
        },
      }),
    },
    {
      headerName: 'Mã sản phẩm',
      headerClass: 'ag-header-required',
      field: 'productCode',
      tooltipField: 'productCode',
      editable: this.props.isEditableStatus,
      cellEditorFramework: MuiSelectEditor,
      // cellRendererFramework: CellRenderer,
      cellEditorParams: ({ context, rowIndex }) => ({
        valueKey: 'value',
        labelKey: 'value',
        sublabelKey: 'label',
        isClearable: true,
        // isMultiline: false,
        // defaultOptions: false,
        promiseOptions: debounce((inputValue, setOptions) => {
          const query = {
            plantCode: context.props.formik.values.deliverCode,
            channel: WITHDRAWAL_ISSUE_CHANNEL,
            filter: inputValue,
          };
          get(`${GET_PRODUCTS_API}?${build(query)}`, response => {
            const data = response.data.map(item => ({
              id: item.id,
              value: item.productCode,
              label: item.productDescription,
              uom: item.baseUoM,
            }));
            setOptions(data);
          });
        }, SEARCH_DEBOUNCE_DELAY),
        onChange: option => {
          context.props.formik.updateFieldArrayValue(
            DETAILS_COMMANDS_KEY,
            rowIndex,
            {
              productCode: option.value,
              productName: option.label,
              uom: option.uom,
            },
          );
        },
      }),
    },
    {
      headerName: 'Tên sản phẩm',
      field: 'productName',
      tooltipField: 'productName',
      editable: false,
    },
    {
      headerName: 'Batch',
      field: 'slotCode', // batch
      tooltipField: 'slotCode',
      editable: this.isCellEditable,
      cellEditorFramework: MuiInputEditor,
    },
    {
      headerName: 'Đơn vị',
      field: 'uom',
      tooltipField: 'uom',
      editable: false,
      minWidth: 80,
    },
    {
      headerName: 'Số lượng',
      headerClass: 'ag-header-required',
      // headerClass: CELL_HEADER_CLASS,
      // cellClass: CELL_NUMBER_CLASS,
      minWidth: 80,
      field: 'exportedQuantity',
      valueFormatter: formatCurrencyTableCell,
      valueParser: parseNumberCellValue,
      tooltipValueGetter: formatCurrencyTableCell,
      editable: this.isCellEditable,
      cellEditorFramework: MuiInputEditor,
      cellEditorParams: {
        InputProps: {
          inputComponent: NumberFormatter,
          inputProps: {
            isAllowed: validDecimal,
          },
        },
      },
    },
    {
      headerName: 'Giá bán',
      headerClass: 'ag-header-required',
      // headerClass: CELL_HEADER_CLASS,
      // cellClass: CELL_NUMBER_CLASS,
      field: 'unitPrice',
      valueFormatter: formatCurrencyTableCell,
      valueParser: parseNumberCellValue,
      tooltipValueGetter: formatCurrencyTableCell,
      editable: this.isCellEditable,
      cellEditorFramework: MuiInputEditor,
      cellEditorParams: {
        InputProps: {
          inputComponent: NumberFormatter,
          inputProps: {
            isAllowed: validDecimal,
          },
        },
      },
    },
    {
      headerName: 'Tổng tiền',
      // headerClass: CELL_HEADER_CLASS,
      // cellClass: CELL_NUMBER_CLASS,
      tooltipValueGetter: formatCurrencyTableCell,
      valueFormatter: formatCurrencyTableCell,
      editable: false,
      valueGetter: params => {
        const { data } = params;
        return Number(data.unitPrice) * Number(data.exportedQuantity);
      },
    },
    {
      headerName: 'Ghi chú',
      field: 'note',
      tooltipField: 'note',
      editable: this.props.isEditableStatus,
      cellEditorFramework: MuiInputEditor,
    },
  ];

  defaultColDef = {
    editable: true,
    resizable: false,
    suppressMovable: true,
    cellEditorFramework: undefined,
  };
  // #endregion

  render() {
    const { total } = this.state;
    const { formik, isCreatePage, isEditPage, isReapprovePage } = this.props;

    const tableData = getIn(formik.values, DETAILS_COMMANDS_KEY, []);

    return (
      <Grid
        item
        md={12}
        style={{
          marginBottom: '1rem',
        }}
      >
        <Expansion
          title="II. Thông tin hàng yêu cầu bán xá"
          rightActions={
            <Fragment>
              {(isCreatePage || isEditPage || isReapprovePage) && (
                <Fragment>
                  <MuiButton
                    icon="note_add"
                    title={ADD_ROWS}
                    outline
                    className="ml2"
                    onClick={this.handleAddRecord}
                  />
                  <MuiButton
                    title="Import phiếu yêu cầu"
                    icon="cloud_upload"
                    outline
                    className="ml2"
                    onClick={this.handleOpenFileBrowser}
                  />
                  <input
                    ref={this.inputFileRef}
                    type="file"
                    className="display-none"
                    accept={acceptExcelFileTypes}
                    onChange={this.handleImportFile}
                  />
                </Fragment>
              )}
              <span style={{ margin: '0 16px', width: 250 }}>
                <b>Tổng tiền: {formatCurrency(total)} VND</b>
              </span>
            </Fragment>
          }
          content={
            <Fragment>
              <TableFormData
                name={DETAILS_COMMANDS_KEY}
                gridStyle={{ height: 390 }}
                idGrid="grid-withdrawal-request"
                /**
                 * Props Formik
                 */
                values={formik.values}
                errors={formik.errors}
                touched={formik.touched}
                setFieldValue={formik.setFieldValue}
                setFieldTouched={formik.setFieldTouched}
                updateFieldArrayValue={formik.updateFieldArrayValue}
                /**
                 * Props Ag-Grid
                 */
                columnDefs={this.columns}
                defaultColDef={this.defaultColDef}
                onGridReady={this.onGridReady}
                rowData={tableData}
                gridProps={{
                  getRowClass: this.getRowClass,
                  context: this,
                  suppressScrollOnNewData: true,
                  suppressHorizontalScroll: true,
                  onCellValueChanged: this.calculateTotal,
                }}
                ignoreSuppressColumns={['regionName', 'productCode']}
              />
            </Fragment>
          }
        />
      </Grid>
    );
  }
}

ProductTable.propTypes = {
  // classes: PropTypes.object,
  formik: PropTypes.object,
  showConfirmation: PropTypes.func,
  notifySuccess: PropTypes.func,

  isCreatePage: PropTypes.bool,
  isEditPage: PropTypes.bool,
  isViewPage: PropTypes.bool,
  isReapprovePage: PropTypes.bool,
  isEditableStatus: PropTypes.bool,
  // showError: PropTypes.func,
};

// ***************************************
// #region private utils

function isRowValid(row) {
  return row.regionCode && row.productCode && row.slotCode;
}

function getRowKey(row) {
  return `${row.regionCode}${row.productCode}${row.slotCode}`;
}

// #endregion
