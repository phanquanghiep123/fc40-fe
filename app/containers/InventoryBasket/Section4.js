import React from 'react';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import Expansion from 'components/Expansion';
import FormData from 'components/FormikUI/FormData';
import PropTypes from 'prop-types';
import PinnedRowRenderer from 'components/FormikUI/PinnedRowRenderer';
import { getRowStyle, orderNumberRenderer } from 'utils/index';
import { Field } from 'formik';
import SelectAutocomplete from 'components/SelectAutocomplete';
import MuiButton from 'components/MuiButton';
import MuiSelectInputEditor from 'components/MuiSelect/InputEditor';
import MuiInputEditor from 'components/MuiInput/Editor';
import CellRenderer from 'components/FormikUI/CellRenderer';
import { validInteger } from 'components/NumberFormatter/utils';
import NumberFormatter from 'components/NumberFormatter';
import { formatToNumber, formatToCurrency } from 'utils/numberUtils';
import ActionRenderSection4 from './ActionRenderSection4';
import Action2RenderSection4 from './Action2RenderSection4';
import { TYPE_FORM } from './constants';
import appTheme from '../App/theme';

export const numericParser = params => {
  if (params.newValue === '0' || params.newValue === 0) {
    return 0;
  }
  return formatToNumber(params.newValue) || undefined;
};
export const numberCurrency = params =>
  params.value ? formatToCurrency(params.value) : params.value;

// eslint-disable-next-line react/prop-types
const SpacingTop = ({ className }) => <div className={className} />;
const StyledSpacingTop = styled(SpacingTop)`
  ${({ theme }) => `margin-top: ${theme.spacing.unit * 2}px`};
`;

export const defaultColDef = {
  valueSetter: params => {
    const updaterData = {
      ...params.data,
      [params.colDef.field]: params.newValue,
    };
    params.context.props.onChangeForm({
      field: 'reason',
      value: params.context.props.formik.values.reason,
    });
    params.context.props.onChangeForm({
      field: 'note',
      value: params.context.props.formik.values.note,
    });
    params.context.props.onUpdateDetailsCommand(
      {
        field: 'infoBasketStocktaking',
        index: params.node.rowIndex,
        data: updaterData,
      },
      'infoBasketStocktaking',
    );
    return true;
  },
  suppressMovable: true,
};

const duplicateClasses = [
  'dupplicate-row-1',
  'dupplicate-row-2',
  'dupplicate-row-3',
  'dupplicate-row-4',
  'dupplicate-row-5',
];
let distinctDuplication = 0;

class Section4 extends React.PureComponent {
  onGridReady = params => {
    this.gridApi = params.api;
  };

  onNewColumnsLoaded = () => {
    if (this.gridApi) {
      this.gridApi.sizeColumnsToFit();
    }
  };

  checkEditable = params => {
    if (
      (params.data.status === 2 && this.props.form === TYPE_FORM.CREATE) ||
      this.props.form === TYPE_FORM.CANCEL
    ) {
      return false;
    }

    // afterStatus =1 sử lý sau kiểm kê là chờ điều chỉnh
    // status =2 BBKK có trạng thái kiểm kê xong
    if (
      params.context.props.formData.afterStatus === 1 &&
      this.props.form === TYPE_FORM.EDIT &&
      !params.data.totalCol &&
      params.context.props.formData.status === 2
    ) {
      return true;
    }

    if (
      this.props.form === TYPE_FORM.EDIT &&
      !params.data.totalCol &&
      params.data.status === 2 &&
      params.context.props.formData.status === 1
    ) {
      return false;
    }

    if (
      (params.colDef.field === 'stocktakingQuantity' ||
        params.colDef.field === 'note') &&
      params.data.disable
    ) {
      return true;
    }
    if (
      params.data.totalCol ||
      params.data.disable ||
      params.data.status === 2
    ) {
      return false;
    }

    if (params.data.basketCode) {
      return true;
    }

    return false;
  };

  getColumnDefs = [
    {
      headerName: 'STT',
      width: 70,
      cellRendererFramework: orderNumberRenderer,
      field: 'index',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
    },
    {
      headerName: 'Mã Khay Sọt',
      width: 100,
      headerClass: 'ag-header-required',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      field: 'basketCode',
      tooltipField: 'basketCode',
      cellStyle: context => ({
        background: !context.data.disable
          ? appTheme.palette.background.default
          : 'inherit',
      }),
      editable: params => {
        if (
          params.data.totalCol ||
          this.props.form === TYPE_FORM.CANCEL ||
          params.data.disable
        ) {
          return false;
        }
        return true;
      },
      cellEditorFramework: MuiSelectInputEditor,
      suppressSizeToFit: true,
      cellEditorParams: ({ context, rowIndex }) => ({
        options: context.props.formOption.baskets,
        valueKey: 'basketCode',
        labelKey: 'basketCode',
        sublabelKey: 'basketName',
        isSearchable: true,
        onChange: option => {
          let data = {};
          if (option) {
            data = {
              ...context.props.section4[rowIndex],
              ...option,
              id: 0,
              documentQuantity: 0,
              status: 1,
              statusName: 'Đang kiểm kê',
              basketStocktakingCode:
                this.props.formData.basketStocktakingCode &&
                this.props.formData.basketStocktakingCode,
            };
            let payload = {
              plantCode: context.props.formData.plantCode,
              basketCode: option.basketCode,
            };
            if (
              context.props.formData.locatorCode &&
              context.props.formData.locatorCode.length > 0
            ) {
              payload = {
                ...payload,
                basketLocatorIds:
                  context.props.formData.locatorCode &&
                  context.props.formData.locatorCode
                    .map(item => item.value)
                    .toString(),
              };
            } else {
              payload = {
                ...payload,
                basketLocatorIds:
                  context.props.formOption.locators &&
                  context.props.formOption.locators
                    .map(item => item.value)
                    .toString(),
              };
            }
            this.props.onGetLocatorByBasket(payload, res => {
              if (res.length > 0) {
                data = {
                  ...data,
                  basketLocator: `${res[0].basketLocatorCode} ${
                    res[0].basketLocatorName
                  }`,
                  basketLocatorId: res[0].basketLocatorId,
                  basketLocatorName: res[0].basketLocatorName,
                  basketLocatorCode: res[0].basketLocatorCode,
                  locatorCode: res[0].basketLocatorCode,
                };
              }
              context.props.onChangeField({ rowIndex, data }, 'basketCode');
            });
          } else {
            context.props.onChangeField({ rowIndex, data }, 'basketCode');
          }
        },
      }),
    },
    {
      headerName: 'Tên Khay Sọt',
      field: 'basketName',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      tooltipField: 'basketName',
    },
    {
      headerName: 'Đơn Vị Tính',
      width: 100,
      field: 'uoM',
      tooltipField: 'uoM',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
    },
    {
      headerName: 'Kho',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      field: 'basketLocator',
      tooltipField: 'basketLocator',
      headerClass: 'ag-header-required',
      cellStyle: context => ({
        background: !context.data.disable
          ? appTheme.palette.background.default
          : 'inherit',
      }),
      cellEditorFramework: MuiSelectInputEditor,
      editable: params => this.checkEditable(params),
      cellEditorParams: ({ context, rowIndex }) => ({
        options: context.props.formOption.locatorByBasket,
        valueKey: 'label',
        labelKey: 'label',
        sublabelKey: 'value',
        isClearable: false,
        isSearchable: true,
        onChange: option => {
          context.props.onGetQuantity(
            {
              deliverCode: context.props.formData.plantCode,
              basketLocatorId: option.value,
              date: new Date().toISOString(),
              filter: context.props.section4[rowIndex].basketCode,
            },
            res => {
              if (res.length === 0) {
                const data = {
                  ...context.props.section4[rowIndex],
                  locatorCode: option.basketLocatorCode,
                  locatorName: option.label,
                  basketLocatorId: option.value,
                  basketLocator: option.label,
                  documentQuantity: 0,
                };
                context.props.onChangeField(
                  { rowIndex, data },
                  'basketLocator',
                );
              }
            },
          );
        },
      }),
    },
    {
      headerName: 'SL Tồn Trên Sổ Sách (1)',
      field: 'documentQuantity',
      headerClass: 'ag-numeric-header',
      tooltipField: 'documentQuantity',
      cellStyle: {
        textAlign: 'right',
      },
      valueFormatter: numberCurrency,
      pinnedRowCellRendererParams: {
        valueFormatter: numberCurrency,
      },
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
    },

    {
      headerName: 'SL Kiểm Kê (2)',
      field: 'stocktakingQuantity',
      tooltipField: 'stocktakingQuantity',
      headerClass: 'ag-numeric-header',
      cellStyle: () => ({
        background:
          this.props.form !== TYPE_FORM.CANCEL ||
          this.props.form !== TYPE_FORM.VIEW
            ? appTheme.palette.background.default
            : 'inherit',
        textAlign: 'right',
      }),
      pinnedRowCellRendererParams: {
        valueFormatter: numberCurrency,
      },
      cellClass: 'ag-numeric-cell',
      valueParser: numericParser,
      valueFormatter: numberCurrency,
      editable: params => this.checkEditable(params),
      cellRendererFramework: CellRenderer,
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      cellEditorFramework: MuiInputEditor,
      cellEditorParams: () => ({
        InputProps: {
          inputComponent: NumberFormatter,
          inputProps: {
            isAllowed: validInteger,
          },
        },
      }),
    },

    {
      headerName: 'SL Cần Điều Chỉnh (3) = (2) - (1)',
      field: 'quantityNeedAdjust',
      headerClass: 'ag-numeric-header',
      tooltipField: 'quantityNeedAdjust',
      valueFormatter: numberCurrency,
      pinnedRowCellRendererParams: {
        valueFormatter: numberCurrency,
      },
      valueParser: numericParser,
      cellEditorParams: () => ({
        InputProps: {
          inputComponent: NumberFormatter,
          inputProps: {
            isAllowed: validInteger,
          },
        },
      }),
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      valueGetter: params =>
        (params.data.stocktakingQuantity || 0) -
        (params.data.documentQuantity || 0),
      cellStyle: params => {
        const differentQuantity =
          (params.data.stocktakingQuantity || 0) -
          (params.data.documentQuantity || 0);
        if (differentQuantity < 0) {
          return { color: 'red', fontWeight: 'bold', textAlign: 'right' };
        }
        if (differentQuantity > 0) {
          return { color: 'blue', fontWeight: 'bold', textAlign: 'right' };
        }
        return { textAlign: 'right' };
      },
    },
    {
      headerName: 'Trạng Thái',
      field: 'statusName',
      tooltipField: 'statusName',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
    },
    {
      headerName: 'Giải Thích',
      field: 'note',
      cellEditorFramework: MuiInputEditor,
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      tooltipField: 'note',
      editable: params => this.checkEditable(params),
      cellStyle: () => ({
        background:
          this.props.form !== TYPE_FORM.CANCEL ||
          this.props.form !== TYPE_FORM.VIEW
            ? appTheme.palette.background.default
            : 'inherit',
      }),
    },
    {
      headerName: '',
      field: 'actions',
      width: 50,
      cellClass: 'cell-action-butons',
      cellRendererFramework: ActionRenderSection4,
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
    },
    {
      headerName: '',
      field: 'actions2',
      width: 50,
      cellClass: 'cell-action-butons',
      cellRendererFramework: Action2RenderSection4,
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
    },
  ];

  getColumnDefsView = [
    {
      headerName: 'STT',
      width: 70,
      cellRendererFramework: orderNumberRenderer,
      field: 'index',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
    },
    {
      headerName: 'Mã Khay Sọt',
      width: 100,
      headerClass: 'ag-header-required',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      field: 'basketCode',
      tooltipField: 'basketCode',
      cellEditorFramework: MuiSelectInputEditor,
      suppressSizeToFit: true,
      cellEditorParams: ({ context }) => ({
        options: context.props.formOption.baskets,
        valueKey: 'basketCode',
        labelKey: 'basketCode',
        sublabelKey: 'basketName',
        isClearable: false,
        isSearchable: true,
        onChange: () => {},
      }),
    },
    {
      headerName: 'Tên Khay Sọt',
      field: 'basketName',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      tooltipField: 'basketName',
    },
    {
      headerName: 'Đơn Vị Tính',
      width: 100,
      field: 'uoM',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      tooltipField: 'uoM',
    },
    {
      headerName: 'Kho',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      field: 'basketLocator',
      tooltipField: 'basketLocator',
      headerClass: 'ag-header-required',
      cellEditorFramework: MuiSelectInputEditor,
      cellEditorParams: ({ context }) => ({
        options: context.props.formOption.locatorByBasket,
        valueKey: 'label',
        labelKey: 'label',
        sublabelKey: 'value',
        isClearable: false,
        isSearchable: true,
        onChange: () => {},
      }),
    },
    {
      headerName: 'SL Tồn Trên Sổ Sách (1)',
      field: 'documentQuantity',
      headerClass: 'ag-numeric-header',
      tooltipField: 'documentQuantity',
      cellStyle: {
        textAlign: 'right',
      },
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      valueFormatter: numberCurrency,
      pinnedRowCellRendererParams: {
        valueFormatter: numberCurrency,
      },
    },

    {
      headerName: 'SL Kiểm Kê (2)',
      field: 'stocktakingQuantity',
      tooltipField: 'stocktakingQuantity',
      headerClass: 'ag-numeric-header',
      pinnedRowCellRendererParams: {
        valueFormatter: numberCurrency,
      },
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      cellClass: 'ag-numeric-cell',
      valueParser: numericParser,
      valueFormatter: numberCurrency,
      cellRendererFramework: CellRenderer,
      cellEditorFramework: MuiInputEditor,
      cellEditorParams: () => ({
        InputProps: {
          inputComponent: NumberFormatter,
          inputProps: {
            isAllowed: validInteger,
          },
        },
      }),
    },

    {
      headerName: 'Chênh Lệch Trước Điều Chỉnh (3) = (2) - (1)',
      field: 'differenceBeforeStocktalking',
      headerClass: 'ag-numeric-header',
      valueFormatter: numberCurrency,
      pinnedRowCellRendererParams: {
        valueFormatter: numberCurrency,
      },
      tooltipField: 'differenceBeforeStocktalking',
      cellStyle: params => {
        if (params.data.differenceBeforeStocktalking < 0) {
          return { color: 'red', fontWeight: 'bold', textAlign: 'right' };
        }
        if (params.data.differenceBeforeStocktalking > 0) {
          return { color: 'blue', fontWeight: 'bold', textAlign: 'right' };
        }
        return { textAlign: 'right' };
      },
    },
    {
      headerName: 'SL Đã Điều Chỉnh (4)',
      field: 'quantityAdjusted',
      headerClass: 'ag-numeric-header',
      cellStyle: {
        textAlign: 'right',
      },
      valueFormatter: numberCurrency,
      pinnedRowCellRendererParams: {
        valueFormatter: numberCurrency,
      },
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      tooltipField: 'quantityAdjusted',
      valueGetter: params => params.data.quantityAdjusted || 0,
    },
    {
      headerName: 'SL Cần Điều Chỉnh (5) = (3) - (4)',
      field: 'quantityNeedAdjust',
      headerClass: 'ag-numeric-header',
      tooltipField: 'quantityNeedAdjust',
      valueFormatter: numberCurrency,
      pinnedRowCellRendererParams: {
        valueFormatter: numberCurrency,
      },
      cellStyle: params => {
        if (params.data.quantityNeedAdjust < 0) {
          return { color: 'red', fontWeight: 'bold', textAlign: 'right' };
        }
        if (params.data.quantityNeedAdjust > 0) {
          return { color: 'blue', fontWeight: 'bold', textAlign: 'right' };
        }
        return { textAlign: 'right' };
      },
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
    },
    {
      headerName: 'Trạng Thái',
      field: 'statusName',
      tooltipField: 'statusName',
    },
    {
      headerName: 'Giải Thích',
      field: 'note',
      cellEditorFramework: MuiInputEditor,
      tooltipField: 'note',
    },
  ];

  rowKeys = new Map();

  /* eslint-disable no-plusplus */
  getRowClass = params => {
    const {
      data,
      context: { rowKeys },
    } = params;
    if (params.rowIndex === 0) {
      const tempKeys = {};
      this.props.section4.forEach(row => {
        if (isRowValid(row)) {
          const key = getRowKey(row);
          if (tempKeys[key]) {
            tempKeys[key]++;

            if (!rowKeys.has(key)) {
              rowKeys.set(key, duplicateClasses[distinctDuplication]);
              distinctDuplication++;

              if (distinctDuplication >= duplicateClasses.length) {
                distinctDuplication = 0;
              }
            }
            this.props.setErrorSection4(1);
            this.props.onShowWarning(
              'Không được nhiều hơn một Mã Khay Sọt có cùng một Kho Đích',
            );
          } else {
            tempKeys[key] = 1;
            this.props.setErrorSection4(0);
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

  render() {
    const {
      formik,
      section4,
      classes,
      addBaskets,
      formOption,
      onGetSection4,
      form,
      formData,
      onChangeForm,
      filterSection4,
      showConfirm,
      id,
    } = this.props;
    const enable = () => {
      if (form === TYPE_FORM.VIEW || form === TYPE_FORM.CANCEL) {
        return true;
      }
      if (
        (form === TYPE_FORM.VIEW ||
          form === TYPE_FORM.CANCEL ||
          form === TYPE_FORM.EDIT) &&
        formData.locatorsDisable
      ) {
        return true;
      }
      return false;
    };

    const totalBottom = () => {
      if (section4) {
        let documentQuantity = 0;
        let stocktakingQuantity = 0;
        let differenceBeforeStocktalking = 0;
        let quantityAdjusted = 0;
        let quantityNeedAdjust = 0;
        section4.forEach(item => {
          documentQuantity += item.documentQuantity || 0;
          stocktakingQuantity += item.stocktakingQuantity || 0;
          differenceBeforeStocktalking +=
            item.differenceBeforeStocktalking || 0;
          quantityAdjusted += item.quantityAdjusted || 0;
          quantityNeedAdjust += item.quantityNeedAdjust || 0;
        });
        return [
          {
            totalCol: true,
            basketLocator: 'Tổng',
            documentQuantity,
            stocktakingQuantity,
            differenceBeforeStocktalking,
            quantityAdjusted,
            quantityNeedAdjust,
          },
        ];
      }
      return [];
    };

    return (
      <div>
        <Grid item xs={12}>
          <Expansion
            title="IV. Thông Tin Khay Sọt Tồn"
            rightActions={
              form === TYPE_FORM.CREATE || form === TYPE_FORM.EDIT ? (
                <Grid
                  container
                  justify="flex-end"
                  alignItems="center"
                  spacing={24}
                >
                  <Grid item>
                    <div className={classes.topToolbarPart}>
                      <MuiButton
                        icon="note_add"
                        outline
                        onClick={() => {
                          onChangeForm({
                            field: 'note',
                            value: formik.values.note,
                          });
                          onChangeForm({
                            field: 'reason',
                            value: formik.values.reason,
                          });
                          addBaskets();
                        }}
                      />
                    </div>
                  </Grid>
                </Grid>
              ) : (
                ''
              )
            }
            content={
              <React.Fragment>
                <Grid container spacing={24}>
                  <Grid item md={6} xs={6}>
                    <Field
                      name="locatorCode"
                      label="Đối Tượng Kho KK"
                      place
                      placeholder="Tất Cả"
                      component={SelectAutocomplete}
                      isMulti
                      isMultiline
                      disabled={enable()}
                      options={formOption.locators}
                      onChangeSelectAutoComplete={selected => {
                        const handleLocators = () => {
                          showConfirm({
                            title: 'Xác nhận thay đổi Đối Tượng Kho KK',
                            message:
                              'Nếu bạn thay đổi Đối Tượng Kho KK thì thông tin vừa nhập sẽ không được lưu! Bạn vẫn muốn thay đổi?',
                            actions: [
                              {
                                text: 'Hủy',
                                color: 'primary',
                              },
                              {
                                text: 'Đồng ý',
                                color: 'primary',
                                onClick: () => {
                                  onChangeForm({
                                    field: 'reason',
                                    value: formik.values.reason,
                                  });
                                  onChangeForm({
                                    field: 'note',
                                    value: formik.values.note,
                                  });
                                  onChangeForm({
                                    field: 'locatorCode',
                                    value: selected,
                                  });
                                  const data = {
                                    plantCode: formData.plantCode,
                                    stocktakingId: id && id,
                                  };

                                  if (selected.length === 0) {
                                    onGetSection4({
                                      ...data,
                                      value: formData.locatorCode
                                        .map(item => item.value)
                                        .toString()
                                        .split(','),
                                      infoBasketStocktaking:
                                        formData.infoBasketStocktaking,
                                    });
                                    return false;
                                  }
                                  if (selected.length === 1) {
                                    filterSection4(selected);
                                    return false;
                                  }
                                  if (
                                    selected &&
                                    formData.locatorCode &&
                                    selected.length <
                                      formData.locatorCode.length
                                  ) {
                                    filterSection4(selected);
                                  } else {
                                    onGetSection4({
                                      ...data,
                                      locatorId: selected.pop().value,
                                    });
                                  }
                                  return true;
                                },
                              },
                            ],
                          });
                        };
                        if (form === TYPE_FORM.EDIT) {
                          const items = [];
                          selected.forEach(item => {
                            if (item.disable) {
                              items.push(item);
                            }
                          });
                          if (items.length < formData.locatorCode2.length) {
                            this.props.onShowWarning(
                              'Kho đã được lưu trong hệ thống. Không được phép thay đổi',
                            );
                            return false;
                          }
                        }
                        handleLocators();
                        return true;
                      }}
                    />
                  </Grid>
                </Grid>

                <FormData
                  name="infoBasketStocktaking"
                  idGrid="section4"
                  gridStyle={{ height: 'auto' }}
                  rowData={section4}
                  columnDefs={
                    form === TYPE_FORM.VIEW
                      ? this.getColumnDefsView
                      : this.getColumnDefs
                  }
                  defaultColDef={defaultColDef}
                  setFieldValue={formik.setFieldValue}
                  setFieldTouched={formik.setFieldTouched}
                  errors={formik.errors}
                  touched={formik.touched}
                  ignoreSuppressColumns={['basketCode', 'basketLocator']}
                  autoLayout
                  gridProps={{
                    getRowClass: this.getRowClass,
                    context: this,
                    suppressMovable: true,
                    suppressScrollOnNewData: true,
                    suppressHorizontalScroll: true,
                    pinnedBottomRowData: totalBottom(),
                    frameworkComponents: {
                      customPinnedRowRenderer: PinnedRowRenderer,
                    },
                    domLayout: 'autoHeight',
                    onNewColumnsLoaded: this.onNewColumnsLoaded,
                    getRowStyle,
                  }}
                  onGridReady={this.onGridReady}
                  {...formik}
                />
              </React.Fragment>
            }
          />
        </Grid>
        <StyledSpacingTop />
      </div>
    );
  }
}

Section4.propTypes = {
  classes: PropTypes.object,
  formik: PropTypes.object,
  formOption: PropTypes.object,
  formData: PropTypes.object,
  section4: PropTypes.array,
  addBaskets: PropTypes.func,
  onGetSection4: PropTypes.func,
  onChangeForm: PropTypes.func,
  filterSection4: PropTypes.func,
  id: PropTypes.string,
  showConfirm: PropTypes.func,
};
export default Section4;

function isRowValid(row) {
  return row.basketCode && row.basketLocator;
}

function getRowKey(row) {
  return `${row.basketCode}${row.basketLocator}`;
}
