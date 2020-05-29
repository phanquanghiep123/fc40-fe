import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import MuiTable from 'components/MuiTable';
import { compose } from 'redux';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import { Button, withStyles, Paper } from '@material-ui/core';
import MuiButton from 'components/MuiButton';
import DialogActions from '@material-ui/core/DialogActions';
// import { Delete, Edit } from '@material-ui/icons';
import { connect } from 'react-redux';
import ConfirmationDialog from 'components/ConfirmationDialog';
import { Formik } from 'formik';
import { createStructuredSelector } from 'reselect';
// import moment from 'moment';
import Expansion from 'components/Expansion';
// import { Can } from 'authorize/ability-context';
import appTheme from '../../../App/theme';
import InfoMaster from './InfoMaster';
import * as actions from '../actions';
import * as selectors from '../selectors';
import { validSchema } from './Schema';
// import { CODE, SCREEN_CODE } from '../../../../authorize/groupAuthorize';
import { convertDateTimeString } from '../../../App/utils';
import MTableBodyRowCustomized from './MTableBodyRowCustomized';

const style = (theme = appTheme) => ({
  paper: {
    marginTop: theme.spacing.unit * 4,
    paddingBottom: 0,
  },
  topToolbar: {
    paddingTop: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topToolbarPart: {
    display: 'flex',
    '& > *:first-child': {
      marginLeft: theme.spacing.unit * 2,
    },
    '& > *:not(:last-child)': {
      marginRight: theme.spacing.unit * 2,
    },
  },
  btnAction: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.primary.main,
    marginRight: theme.spacing.unit * 2,
  },
  actionButtons: {
    marginRight: 20,
    marginTop: -8,
    marginBottom: theme.spacing.unit * 2,
  },
});

const tableColumns = (handleDelete, detailDialog, size) => [
  {
    title: 'STT',
    sorting: false,
    render: rowIndex => rowIndex.tableData.id + 1,
  },
  {
    title: 'Mã Khay Sọt',
    field: 'palletBasketCode',
    sorting: true,
  },
  {
    title: 'Tên Ngắn',
    field: 'shortName',
    sorting: true,
  },
  {
    title: 'Tên Dài',
    field: 'fullName',
    sorting: true,
  },
  {
    title: 'Kích Cỡ',
    field: 'sizeName',
    sorting: true,
    render: rowData => (
      <span>
        {size &&
          size.find(e => e.value === rowData.size) &&
          size.find(e => e.value === rowData.size).label}
      </span>
    ),
  },
  {
    title: 'Đơn Vị Tính',
    field: 'uoM',
    sorting: true,
  },
  {
    title: 'Trọng Lượng ',
    field: 'netWeight',
    sorting: true,
  },
  {
    title: 'Đơn Vị Tính (TL)',
    field: 'weightUnit',
    sorting: true,
  },
  {
    title: 'Ngày Đăng Ký',
    field: 'registerDate',
    sorting: true,
    render: rowData => (
      <span>{convertDateTimeString(rowData.registerDate)}</span>
    ),
  },
  // {
  //   title: 'Thao Tác',
  //   field: 'action',
  //   sorting: false,
  //   render: rowData => (
  //     <div style={{ display: 'flex', alignItems: 'center' }}>
  //       {rowData.registerPlace === 1 && (
  //         <span style={{ width: 40, height: 40 }}>
  //           <IconButton
  //             title="Chỉnh sửa"
  //             style={{ padding: '.5rem' }}
  //             onClick={event => {
  //               detailDialog(event, rowData);
  //             }}
  //           >
  //             <Edit />
  //           </IconButton>
  //         </span>
  //       )}
  //       {/* <Can do={CODE.xoaMasterKS} on={SCREEN_CODE.MASTERKS}> */}
  //       {rowData.registerPlace === 2 && !rowData.isUsed ? (
  //         <span style={{ width: 40, height: 40 }}>
  //           <IconButton
  //             title="Xóa"
  //             style={{ padding: '.5rem' }}
  //             onClick={() => {
  //               handleDelete(rowData.id, rowData.tableData.id);
  //             }}
  //           >
  //             <Delete />
  //           </IconButton>
  //         </span>
  //       ) : (
  //         ''
  //       )}
  //       {/* </Can> */}
  //     </div>
  //   ),
  // },
];
// eslint-disable-next-line react/prefer-stateless-function
class TableSection extends Component {
  formik = null;

  detailMode = false;

  createMode = false;

  showInfoMaster = (event, rowData) => {
    if (rowData) {
      // const uoM = this.props.uoms.find(e => e.value === rowData.uoM);
      // const weightUnit = this.props.uoms.find(
      //   e => e.value === rowData.weightUnit,
      // );
      const data = {
        id: rowData.id,
        palletBasketCode: rowData.palletBasketCode,
        fullName: rowData.fullName,
        shortName: rowData.shortName,
        netWeight: rowData.netWeight,
        weightUnit: rowData.weightUnit,
        uoM: rowData.uoM,
        size: rowData.size,
        length: rowData.length,
        width: rowData.width,
        height: rowData.height,
        registerPlace: 2,
        registerName: 'FC40',
        registerDate: rowData.registerDate,
        isUsed: rowData.isUsed,
        tableData: { id: rowData.tableData.id },
      };
      this.props.onFillFormDetail(data);
    } else {
      this.props.onFillFormDetail({
        palletBasketCode: '',
        shortName: '',
        fullName: '',
        uoM: this.props.uoms[0],
        netWeight: '',
        registerPlace: 2,
        registerName: 'FC40',
        weightUnit: this.props.uoms[0],
        size: 1,
        length: '',
        width: '',
        height: '',
      });
    }
    this.props.ui.props.onOpenDialog();
  };

  onConfirmShow = options => {
    if (this.confirmRef) {
      this.confirmRef.showConfirm(options);
    }
  };

  onDelete = (idRowData, idTable) => {
    this.onConfirmShow({
      title: 'Cảnh báo',
      message: 'Bạn có chắc chắn xóa?',
      actions: [
        { text: 'Hủy' },
        {
          text: 'Đồng ý',
          color: 'primary',
          onClick: () => {
            this.props.onDeleteBasket(idRowData, idTable);
          },
        },
      ],
    });
  };

  onFormSubmit = () => {
    this.props.save(this.formik.values, data => {
      this.props.ui.props.onCloseDialog();
      if (this.detailMode) {
        this.detailMode = false;
      }
      if (this.createMode) {
        this.createMode = false;
      }
      if (!data) {
        this.props.onSearch(this.props.paramSearch);
      }
    });
  };

  exportExcelHandler = () => {
    this.props.onExportExcel();
  };

  save = event => {
    this.formik.submitForm(event);
  };

  onOrderChange = (orderBy, orderDirection) => {
    const tableColumn = tableColumns();
    const column = tableColumn[orderBy];
    if (column && column.field) {
      if (column.field === 'sizeName') {
        const sortOrder = `${orderDirection === 'asc' ? '' : '-'}size`;
        this.props.onSearch({
          ...this.props.paramSearch,
          sort: sortOrder,
        });
      } else {
        const sortOrder = (orderDirection === 'asc' ? '' : '-') + column.field;
        this.props.onSearch({
          ...this.props.paramSearch,
          sort: sortOrder,
        });
      }
    }
  };

  render() {
    const getColumnDefs = tableColumns(
      (idRowData, idTable) => {
        this.onDelete(idRowData, idTable);
      },
      (event, rowData) => {
        this.showInfoMaster(event, rowData);
      },
      this.props.size,
    );
    const { classes, ui, formDetail, tableData } = this.props;
    return (
      <Paper className={classes.paper}>
        <Expansion
          title="II. Danh Sách Master Khay Sọt"
          noPadding
          rightActions={
            <div>
              {/* <Button */}
              {/*  type="button" */}
              {/*  variant="contained" */}
              {/*  onClick={() => { */}
              {/*    this.createMode = true; */}
              {/*    this.showInfoMaster(); */}
              {/*  }} */}
              {/*  className={classes.btnAction} */}
              {/* > */}
              {/*  Tạo mới */}
              {/* </Button> */}
              <Button
                type="button"
                variant="contained"
                onClick={this.exportExcelHandler}
                className={classes.btnAction}
                disabled={tableData.length === 0 && true}
              >
                Xuất excel
              </Button>
            </div>
          }
          content={
            <div>
              <MuiTable
                tableRef={ref => {
                  this.props.tableRef(ref);
                }}
                columns={getColumnDefs}
                data={tableData}
                components={{
                  Row: MTableBodyRowCustomized,
                }}
                options={{
                  headerStyle: {
                    position: 'sticky',
                  },
                  showTitle: false,
                  search: false,
                  addRowPosition: 'last',
                  showSelectAllCheckbox: true,
                  emptyRowsWhenPaging: false,
                  toolbar: false,
                  maxBodyHeight: 555,
                }}
                onRowClick={(event, rowData) => {
                  this.detailMode = true;
                  this.showInfoMaster(event, rowData);
                }}
                onOrderChange={(orderBy, orderDirection) =>
                  this.onOrderChange(orderBy, orderDirection)
                }
              />
              <ui.Dialog
                {...ui.props}
                content={
                  <Formik
                    enableReinitialize
                    initialValues={formDetail}
                    validationSchema={validSchema}
                    onSubmit={this.onFormSubmit}
                    render={formik => {
                      this.formik = formik;
                      return (
                        <React.Fragment>
                          <InfoMaster
                            formik={formik}
                            detailMode={this.detailMode}
                          />
                        </React.Fragment>
                      );
                    }}
                  />
                }
                maxWidth="lg"
                fullWidth
                isDialog={false}
                keepMounted={false}
                suppressClose
                customActionDialog={
                  <DialogActions className={classes.actionButtons}>
                    <MuiButton
                      onClick={() => {
                        this.formik.handleReset();
                        ui.props.onCloseDialog();
                        this.detailMode = false;
                        this.createMode = false;
                      }}
                      outline
                    >
                      Quay Lại
                    </MuiButton>
                    {/* {!this.detailMode && ( */}
                    {/*  <Button */}
                    {/*    className={classes.btn} */}
                    {/*    variant="contained" */}
                    {/*    type="submit" */}
                    {/*    color="primary" */}
                    {/*    onClick={this.save} */}
                    {/*  > */}
                    {/*    Lưu */}
                    {/*  </Button> */}
                    {/* )} */}
                  </DialogActions>
                }
              />

              <ConfirmationDialog
                ref={ref => {
                  this.confirmRef = ref;
                }}
              />
            </div>
          }
        />
      </Paper>
    );
  }
}

TableSection.propTypes = {
  classes: PropTypes.object,
  ui: PropTypes.object,
  onFillFormDetail: PropTypes.func,
  onDeleteBasket: PropTypes.func,
  onSearch: PropTypes.func,
  size: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
  formDetail: selectors.formDetailSelector(),
  tableData: selectors.tableSelector(),
  paramSearch: selectors.paramSearchSelector(),
  uoms: selectors.uomsSelector(),
  size: selectors.sizeSelector(),
});

function mapDispatchToProps(dispatch) {
  return {
    save: (data, callback) => dispatch(actions.save(data, callback)),
    onFillFormDetail: data => dispatch(actions.formDetail(data)),
    onExportExcel: () => dispatch(actions.exportExcel()),
    onDeleteBasket: (idRowData, idTable) =>
      dispatch(actions.deleteBasket(idRowData, idTable)),
    onSearch: data => dispatch(actions.searchMaster(data)),
  };
}
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withRouter,
  withStyles(style()),
  withImmutablePropsToJs,
)(TableSection);
