import React from 'react';
import { Form, Field, Formik } from 'formik';
import PropTypes from 'prop-types';
import {
  Grid,
  withStyles,
  Button,
  createMuiTheme,
  MuiThemeProvider,
  TablePagination,
} from '@material-ui/core';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import DatePickerControl from 'components/PickersControl';
import SelectAutocomplete from 'components/SelectAutocomplete';
import InputControl from 'components/InputControl';
import Expansion from 'components/Expansion';
import MaterialTable from 'material-table';
import Schema from '../section4Schema';
import { makeTableColumns } from './tableColumns';
import { initSubmitValues } from './Schema';
import appTheme from '../../../App/theme';
const styles = theme => ({
  btnContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  reImportBtn: {
    marginLeft: theme.spacing.unit * 2,
  },
  browserBtn: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.primary.main,
  },
  cancelBtn: {
    backgroundColor: '#fff',
    color: theme.palette.primary.main,
    marginLeft: theme.spacing.unit * 2,
  },
  expansionContainer: {
    marginBottom: theme.spacing.unit * 3,
  },
  paper: {
    padding: `${theme.spacing.unit * 5}px ${theme.spacing.unit * 2}px ${theme
      .spacing.unit * 2}px`,
    marginBottom: theme.spacing.unit * 2,
  },
  resetBtn: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.primary.main,
    marginRight: theme.spacing.unit * 2,
  },
  gridDate: {
    display: 'flex',
    justifyContent: 'space-betwwen',
    '& > div': {
      marginTop: '0 !important',
    },
  },
  gridDateDivider: {
    alignSelf: 'flex-start',
    padding: '.5rem .75rem',
  },
  dateLabel: {
    display: 'block',
    fontSize: '0.75rem',
    marginBottom: '0.25rem',
  },
});

const muiThemeOptions = {
  border: false,
};

const muiTheme = (theme = appTheme, options = muiThemeOptions) =>
  createMuiTheme({
    ...theme,
    overrides: {
      MuiCheckbox: {
        colorSecondary: {
          '&$checked': {
            color: theme.palette.primary.main,
          },
          '&:hover': {
            cursor: 'default',
          },
        },
      },
      MuiTableRow: {
        head: {
          height: theme.spacing.unit * 6,
          '&:first-child': {
            borderTop: !options.border
              ? '1px solid rgba(224, 224, 224, 1)'
              : undefined,
          },
        },
        root: {
          minHeight: 40,
        },
      },
      MuiTableBody: {
        root: {
          borderBottom: '1px solid rgba(224, 224, 224, 1)',
        },
      },
      MuiTableCell: {
        root: {
          borderBottom: 'none!import',
          padding: `0 ${theme.spacing.unit * 1}px`,
          '&:first-child': {
            paddingLeft: theme.spacing.unit * 3,
          },
          '&:last-child': {
            paddingRight: theme.spacing.unit * 1.5,
          },
        },
      },
      MuiTableHead: {
        root: {
          background: theme.palette.background.head,
        },
      },
      MuiPaper: {
        elevation2: {
          boxShadow: 'none',
        },
      },
      MuiToolbar: {
        root: {
          minHeight: '0 !important',
        },
      },
      MuiTypography: {
        h6: {
          display: 'none',
        },
      },
    },
  });

class SuggestSearchDialog extends React.Component {
  listProductAddInPages = [];

  toDoCode = '';

  toDoFromCode = '';

  formik = null;

  state = {
    onLoadTable: true,
  };

  listSelect = [];

  importSubmit = (e, formik) => {
    this.openConfirm = true;
    formik.setFieldValue('isImport', true);
    formik.handleSubmit();
  };

  closeDl = () => {
    const { onClose } = this.props;
    onClose();
  };

  addOrDeleteItemCheck = () => {
    const { tableSuggestData } = this.props;
    const listKeyAdd = this.listSelect.map(item => item.key);
    const listDelete = [];
    tableSuggestData.forEach(item => {
      if (!listKeyAdd.includes(item.key)) listDelete.push(item.key);
    });
    // remove item
    const newListItem = [];
    const newListKey = [];
    this.listProductAddInPages.forEach(item => {
      if (!listDelete.includes(item.key)) {
        newListItem.push(item);
        newListKey.push(item.key);
      }
    });
    this.listProductAddInPages = newListItem;
    // add item
    this.listSelect.forEach(item => {
      if (!newListKey.includes(item.key)) this.listProductAddInPages.push(item);
    });
  };

  setShowTable = data => {
    this.setState({ onLoadTable: false });
    this.setState({ onLoadTable: true });
    return data;
  };

  onChangeRowsPerPage = event => {
    const pageSize = event.target.value;
    const { onGetSuggestSearch, submitValuesSuggest } = this.props;
    if (
      submitValuesSuggest.totalItem <
      pageSize * submitValuesSuggest.pageIndex
    ) {
      submitValuesSuggest.pageIndex =
        Math.ceil(submitValuesSuggest.totalItem / pageSize) - 1;
    }
    submitValuesSuggest.pageSize = pageSize;
    this.addOrDeleteItemCheck();
    onGetSuggestSearch(submitValuesSuggest, this.setShowTable);
  };

  getPageSize = () => {
    const { tableSuggestData } = this.props;
    return Object.keys(tableSuggestData).length;
  };

  onChangePage = (_event, pageIndex) => {
    if (pageIndex !== this.props.submitValuesSuggest.pageIndex) {
      const { onGetSuggestSearch, submitValuesSuggest } = this.props;
      submitValuesSuggest.pageIndex = pageIndex;
      this.addOrDeleteItemCheck();
      onGetSuggestSearch(submitValuesSuggest, this.setShowTable);
    }
  };

  onOrderChange = (orderBy, orderDirection) => {
    const { onGetSuggestSearch, submitValuesSuggest } = this.props;
    const tableColumns = makeTableColumns();
    const column = tableColumns[orderBy];
    if (column && column.field) {
      const sortOrder = (orderDirection === 'asc' ? '' : '-') + column.field;
      submitValuesSuggest.sort = [sortOrder];
      this.addOrDeleteItemCheck();
      onGetSuggestSearch(submitValuesSuggest, this.setShowTable);
    }
  };

  makeFormAttr = pr => {
    const { onGetProdOrderBySuggestAuto, onGetfetchPlanSaga } = this.props;
    let autoCompleteTimer;
    let autoCompleteTimer1;
    return {
      deliveryDateTime: {
        name: 'deliveryDateTime',
        label: 'Ngày đi hàng *',
        value: pr.values.deliveryDateTime,
        component: DatePickerControl,
        placeholder: 'Ngày giao',
        disabled: true,
      },
      Farm: {
        name: 'deliveryName',
        label: 'Đơn vị *',
        component: InputControl,
        value: pr.values.deliveryName,
        onChange: pr.handleChange,
        disabled: true,
      },
      PlanName: {
        name: 'planName',
        label: 'Tên kế hoạch',
        value: pr.values.PlanName,
        onChange: pr.handleChange,
        component: InputControl,
        placeholder: 'Tên kế hoạch',
      },
      PlanCode: {
        name: 'planCode',
        label: 'Mã/Tên kế hoạch',
        value: pr.values.PlanCode,
        onChange: pr.handleChange,
        component: SelectAutocomplete,
        placeholder: 'Tìm và chọn Mã/Tên kế hoạch',
        isAsync: true,
        loadOptions: (inputValue, callback) => {
          clearTimeout(autoCompleteTimer); // clear previous timeout
          autoCompleteTimer = setTimeout(() => {
            onGetfetchPlanSaga(inputValue, callback);
          }, 200);
        },
      },
      ProdOrderCode: {
        name: 'prodOrderCode',
        label: 'Lệnh sản xuất',
        value: pr.values.ProdOrderCode,
        onChange: pr.handleChange,
        component: SelectAutocomplete,
        placeholder: 'Tìm và chọn Lệnh sản xuất',
        isAsync: true,
        loadOptions: (inputValue, callback) => {
          clearTimeout(autoCompleteTimer1); // clear previous timeout
          autoCompleteTimer1 = setTimeout(() => {
            const { receiverCode, deliverCode } = this.props;
            const params = {
              unitCode: deliverCode,
              unitCodeReceived: receiverCode,
            };
            onGetProdOrderBySuggestAuto(params, inputValue, callback);
          }, 200);
        },
      },
    };
  };

  renderGridField = data => (
    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
      <Field {...data} />
    </Grid>
  );

  onSubmitDataSuggestSearch = submitData => {
    const { onGetSuggestSearch } = this.props;
    this.addOrDeleteItemCheck();
    onGetSuggestSearch(submitData, this.setShowTable);
  };

  onOpenGetDataSuggestSearch = () => {
    this.listIds = [];
    const { openDl } = this.props;
    if (openDl) {
      const {
        onGetSuggestSearch,
        deliveryDateTime,
        deliverCode,
        receiverCode,
      } = this.props;
      const submitData = {
        ...initSubmitValues,
        deliveryDateTime,
        deliverCode,
        receiverCode,
      };
      onGetSuggestSearch(submitData, this.setShowTable);
    }
  };

  addSelectToGrid = () => {
    const { addRowsBySuggest } = this.props;
    this.addOrDeleteItemCheck();
    const dataAdd = this.listProductAddInPages.map(item => ({
      productionOrder: item.productionOrderCode,
      grade: item.slotCode,
      materialTypeCode: item.materialTypeCode,
      doConnectingId: item.productCode,
      planningCode: item.planningCode,
      materialDescription: item.productName,
      productCode: item.productCode,
      productTypeName: item.productTypeName,
      productType: item.productType,
      processingType: item.processingType,
      processingTypeName: item.processingTypeName,
      plannedTotalQuatity: item.rawOutput,
      farmQcRecoveryRate: '',
      totalReceivingWeight: '',
      pvCode: item.pvCode,
      isTranscoding: false,
      key: item.key,
      ispending: true,
      baseUoM: item.baseUoM,
    }));
    addRowsBySuggest(dataAdd);
  };

  render() {
    const {
      ui,
      classes,
      openDl,
      tableSuggestData,
      submitValuesSuggest,
      deliveryDateTime,
      receiverCode,
      deliverCode,
      deliveryName,
    } = this.props;

    const onThis = this;
    if (this.toDoCode !== deliverCode || this.toDoFromCode !== receiverCode) {
      this.listProductAddInPages = [];
    }
    this.toDoCode = deliverCode;
    this.toDoFromCode = receiverCode;
    const commonOnSubmitDataSuggestSearch = this.onSubmitDataSuggestSearch;
    const check = (this.state.onLoadTable && openDl) || false;
    const listProductOrderCode =
      (this.listProductAddInPages !== undefined &&
        (this.listProductAddInPages.length > 0 &&
          this.listProductAddInPages.map(item => item.key))) ||
      [];
    const listCheckOld = [];
    const converDoCheck =
      tableSuggestData &&
      tableSuggestData.map(item => {
        const toItem = item;
        toItem.tableData = {
          checked: listProductOrderCode.includes(toItem.key),
        };
        if (toItem.tableData.checked === true) listCheckOld.push(toItem);
        return toItem;
      });
    this.listSelect = listCheckOld;
    const tableColumns = makeTableColumns();
    return (
      <React.Fragment>
        <ui.Dialog
          {...ui.props}
          maxWidth="xl"
          fullWidth
          title="Gợi ý từ kế hoạch thu hoạch"
          content={
            <Grid container tabIndex="-1" style={{ outline: 0 }}>
              <Grid
                style={{
                  marginBottom: 20,
                }}
                item
                xs={12}
                className={classes.section}
              >
                <Formik
                  enableReinitialize
                  initialValues={submitValuesSuggest}
                  onSubmit={(values, formikActions) => {
                    formikActions.setSubmitting(false);
                    submitValuesSuggest.isSubmit = true;
                    const submitData = {
                      ...submitValuesSuggest,
                      ...values,
                    };
                    commonOnSubmitDataSuggestSearch(submitData);
                  }}
                  onReset={(values, formikActions) => {
                    const dataReset = {
                      ...initSubmitValues,
                      deliveryDateTime,
                      deliverCode,
                      receiverCode,
                      deliveryName,
                      isUpdate: submitValuesSuggest.isUpdate,
                    };
                    formikActions.setValues(dataReset);
                    commonOnSubmitDataSuggestSearch(dataReset);
                  }}
                  render={pr => {
                    this.formik = pr;
                    const formAttr = this.makeFormAttr(this.formik);
                    return (
                      <Expansion
                        title="I. Thông Tin Chung"
                        content={
                          <Form>
                            <Grid container justify="space-around">
                              <Grid item lg={3}>
                                {this.renderGridField(
                                  formAttr.deliveryDateTime,
                                )}
                                {this.renderGridField(formAttr.Farm)}
                              </Grid>
                              <Grid item lg={4}>
                                {this.renderGridField(formAttr.PlanCode)}
                                {this.renderGridField(formAttr.PlanName)}
                              </Grid>
                              <Grid item lg={4}>
                                {this.renderGridField(formAttr.ProdOrderCode)}
                              </Grid>
                            </Grid>
                            <Grid container justify="space-around">
                              <Grid
                                item
                                xl={12}
                                lg={12}
                                md={12}
                                sm={12}
                                xs={12}
                              >
                                <Grid container justify="space-around">
                                  <Grid item lg={6}>
                                    <Button
                                      type="button"
                                      variant="contained"
                                      color="primary"
                                      className={classes.submit}
                                      onClick={this.addSelectToGrid}
                                    >
                                      Chọn sản phẩm
                                    </Button>
                                  </Grid>
                                  <Grid item lg={6}>
                                    <div className={classes.btnContainer}>
                                      <Button
                                        type="button"
                                        variant="contained"
                                        className={classes.resetBtn}
                                        onClick={pr.handleReset}
                                      >
                                        Bỏ lọc
                                      </Button>
                                      <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        className={classes.submit}
                                      >
                                        Tìm kiếm
                                      </Button>
                                      <Button
                                        type="button"
                                        variant="contained"
                                        className={classes.cancelBtn}
                                        onClick={this.closeDl}
                                      >
                                        Đóng
                                      </Button>
                                    </div>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Form>
                        }
                      />
                    );
                  }}
                />
              </Grid>
              <Grid item xs={12} className={classes.section}>
                <Expansion
                  title="II. Gợi ý từ kế hoạch thu hoạch"
                  content={
                    <MuiThemeProvider theme={muiTheme}>
                      {check && (
                        <MaterialTable
                          onOrderChange={this.onOrderChange}
                          onSelectionChange={rows => {
                            const { pageIndex } = submitValuesSuggest;
                            const SchemaR = new Schema();
                            const dataRows = rows.map(item => ({
                              ...SchemaR,
                              ...item,
                              ispending: true,
                              page: pageIndex,
                            }));
                            onThis.listSelect = dataRows;
                          }}
                          data={converDoCheck}
                          columns={tableColumns}
                          options={{
                            search: false,
                            pageSize: submitValuesSuggest.pageSizeTrue,
                            headerStyle: {
                              background: appTheme.palette.background.head,
                              paddingTop: appTheme.spacing.unit,
                              paddingBottom: appTheme.spacing.unit,
                            },
                            rowStyle: rowData => ({
                              paddingTop: appTheme.spacing.unit / 2,
                              paddingBottom: appTheme.spacing.unit / 2,
                              borderBottom:
                                rowData.isAfter !== false ||
                                converDoCheck.length < 1
                                  ? '2px solid rgba(224, 224, 224, 1)'
                                  : '0px solid #fff',
                            }),
                            cellStyle: {
                              boderBottom: 'none',
                            },
                            showTitle: false,
                            columnsButton: false,
                            exportButton: false,
                            addRowPosition: 'last',
                            selection: true,
                            showSelectAllCheckbox: true,
                            emptyRowsWhenPaging: false,
                          }}
                          totalCount={submitValuesSuggest.pageSizeTrue}
                          initialPage={submitValuesSuggest.pageIndex}
                          localization={{
                            toolbar: {
                              nRowsSelected: '{0} dòng được chọn',
                            },
                            pagination: {
                              labelRowsSelect: 'dòng',
                              labelDisplayedRows: '{from}-{to} trên {count}',
                            },
                            body: {
                              emptyDataSourceMessage:
                                'Không tìm thấy kết quả nào để hiển thị',
                            },
                          }}
                          components={{
                            Pagination: props => (
                              <TablePagination
                                {...props}
                                page={submitValuesSuggest.pageIndex}
                                count={submitValuesSuggest.totalItem}
                                rowsPerPage={submitValuesSuggest.pageSize}
                                labelRowsPerPage={submitValuesSuggest.pageSize}
                                onChangePage={this.onChangePage}
                                onChangeRowsPerPage={this.onChangeRowsPerPage}
                              />
                            ),
                          }}
                        />
                      )}
                    </MuiThemeProvider>
                  }
                />
              </Grid>
            </Grid>
          }
          openDl={openDl}
          isDialog={false}
          customActionDialog
        />
      </React.Fragment>
    );
  }
}
SuggestSearchDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  openDl: PropTypes.bool,
  onOpenDiaLog: PropTypes.func,
  onLoadingError: PropTypes.func,
  onSubmitSuccess: PropTypes.func,
  onGetProdOrderAuto: PropTypes.any,
  tableSuggestData: PropTypes.any,
  addRowsBySuggest: PropTypes.any,
  onGetSuggestSearch: PropTypes.any,
  submitValuesSuggest: PropTypes.any,
  deliveryName: PropTypes.string,
};

export default withImmutablePropsToJS(withStyles(styles)(SuggestSearchDialog));
