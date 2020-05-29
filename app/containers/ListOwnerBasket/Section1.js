import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import { withStyles } from '@material-ui/core/styles';
import MuiButton from 'components/MuiButton';
import MuiTable from 'components/MuiTable';
import DialogActions from '@material-ui/core/DialogActions';
import { Paper, Typography } from '@material-ui/core';
import HistoryDialog from './HistoryDialog';
import * as actions from './actions';
import { makeSelectData } from './selectors';

export const styles = theme => ({
  space: {
    marginTop: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 4,
  },
  topToolbar: {
    paddingTop: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
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
});
const tableColumns = [
  // {
  //   title: '',
  //   field: 'Checkbox',
  //   width: 50,
  //   render: rowData => <Checkbox rowData={rowData} />,
  // },
  {
    title: 'Đơn vị sở hữu',
    field: 'plantName',
  },
  {
    title: 'Mã tài sản',
    field: 'status',
  },
  {
    title: 'Mã khay sọt',
    field: 'palletBasketCode',
  },
  {
    title: 'Tên khay sọt',
    field: 'palletBasketName',
  },
  {
    title: 'Số lượng',
    field: 'quantity',
  },
  {
    title: 'Ngày mua',
    field: 'boughtDate',
  },
  {
    title: 'Giá mua',
    field: 'price',
  },
  {
    title: 'Giá trị còn lại',
    field: 'valueRemain',
  },
  {
    title: 'Ngày Nhập Kho',
    field: 'importedDateTo',
  },
  {
    title: 'Trạng thái',
    field: 'statusName',
  },
];

export class Section1 extends React.Component {
  title = '';

  statusName = '';

  selectedRows = '';

  showHistoryBasket = (event, rowData) => {
    if (rowData.statusName === 'Đã Hủy') {
      this.title = 'Lịch sử hủy khay sọt';
      this.statusName = 'Đã Hủy';
    } else {
      this.title = 'Lịch sử chuyển sở hữu khay sọt';
      this.statusName = 'Sở hữu';
    }
    this.props.ui.props.onOpenDialog();
    // const params = {};
    this.props.onGetHistory(rowData);
  };

  exportExcelHandler = () => {
    this.props.onExportExcel();
  };

  redirectTransOwnership = () => {
    this.props.history.push();
  };

  riedirectCreateImpStock = () => {
    this.props.history.push();
  };

  render() {
    const { classes, ui, initValue } = this.props;
    return (
      <Paper className={classes.space}>
        <div className={classes.topToolbar}>
          <div className={classes.topToolbarPart}>
            <Typography variant="h6">II. Danh Sách Khay Sọt Sở Hữu</Typography>
          </div>
          <div className={classes.topToolbarPart}>
            <MuiButton onClick={this.exportExcelHandler}>Xuất excel</MuiButton>
            <MuiButton onClick={this.redirectTransOwnership}>
              Chuyển sở hữu
            </MuiButton>
            <MuiButton onClick={this.riedirectCreateImpStock}>
              Tạo mới
            </MuiButton>
          </div>
        </div>
        <React.Fragment>
          <MuiTable
            columns={tableColumns}
            data={initValue.listPalletBasket}
            options={{
              showTitle: false,
              search: false,
              addRowPosition: 'last',
              showSelectAllCheckbox: true,
              emptyRowsWhenPaging: false,
              toolbar: false,
              selection: true,
            }}
            onRowDoubleClick={this.showHistoryBasket}
            onSelectionChange={data => {
              this.selectedRows = data;
            }}
          />
          <ui.Dialog
            {...ui.props}
            title={this.title}
            content={<HistoryDialog ui={ui} statusName={this.statusName} />}
            maxWidth="lg"
            fullWidth
            isDialog={false}
            keepMounted={false}
            suppressClose
            customActionDialog={
              <DialogActions className={classes.actionButtons}>
                <MuiButton
                  onClick={ui.props.onCloseDialog}
                  outline
                  className={classes.button}
                >
                  Đóng
                </MuiButton>
              </DialogActions>
            }
          />
        </React.Fragment>
      </Paper>
    );
  }
}

Section1.propTypes = {
  ui: PropTypes.object,
  classes: PropTypes.object.isRequired,
  onExportExcel: PropTypes.func,
  history: PropTypes.object,
  onGetHistory: PropTypes.func,
  formik: PropTypes.object,
};
const mapStateToProps = createStructuredSelector({
  initValue: makeSelectData(),
});
function mapDispatchToProps(dispatch) {
  return {
    onExportExcel: () => dispatch(actions.exportExcel()),
    onGetHistory: params => dispatch(actions.getHistory(params)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default withConnect(
  withStyles(styles)(withImmutablePropsToJS(Section1)),
);
