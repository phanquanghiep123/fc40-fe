import React from 'react';
import PropTypes from 'prop-types';

import dateFns from 'date-fns';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

import { showWarning } from 'containers/App/actions';

import MuiTable, { MuiTableBody } from 'components/MuiTable';
import { difference } from 'components/MuiTable/utils';

import MuiButton from 'components/MuiButton';

import { sendMail } from './actions';
import { makeSelectData } from './selectors';
import { suppliersRoutine } from './routines';

import { SEND_STATUS } from './constants';

import baseStyles from './styles';

export const styles = theme => ({
  ...baseStyles(theme),
  cardContent: {
    padding: 0,
    '&:last-child': {
      padding: 0,
    },
  },
});

export class Section2 extends React.Component {
  columns = [
    {
      title: 'Mã NCC',
      field: 'supplierCode',
    },
    {
      title: 'Tên NCC',
      field: 'supplierName',
    },
    {
      title: 'Vùng Tiêu Thụ',
      field: 'consumeRegionName',
    },
    {
      title: 'File Gửi Mail',
      field: 'fileName',
    },
    {
      title: 'Ngày Gửi Mail',
      field: 'date',
      render: this.renderDate,
    },
    {
      title: 'Trạng Thái',
      field: 'statusName',
    },
  ];

  selectedData = [];

  constructor(props) {
    super(props);
    this.state = { initialData: this.getData(props.initialData) };
  }

  componentWillReceiveProps(nextProps) {
    if (difference(this.props.initialData, nextProps.initialData)) {
      this.setState(
        { initialData: this.getData(nextProps.initialData) },
        () => {
          this.selectedData = [];
        },
      );
    }
  }

  getData(datas) {
    if (datas && datas.length > 0) {
      return datas.slice();
    }
    return [];
  }

  isRowSelectable = rowData => {
    if (rowData && rowData.status !== SEND_STATUS.SENT) {
      return true;
    }
    return false;
  };

  validateBeforeSend() {
    if (!this.selectedData || !this.selectedData.length) {
      this.props.onShowWarning('Chưa có NCC đã được chọn');
      return false;
    }
    return true;
  }

  onSendMail = () => {
    if (this.validateBeforeSend()) {
      this.props.onSendMail(this.selectedData, () => {
        this.onGetSuppliers();
      });
    }
  };

  onChangePage = pageIndex => {
    const nextValues = {
      ...this.props.formik.values,
      pageIndex,
    };
    this.onGetSuppliers(nextValues);
  };

  onSelectionChange = selectedData => {
    this.selectedData = selectedData;
  };

  onChangeRowsPerPage = pageSize => {
    const nextValues = {
      ...this.props.formik.values,
      pageIndex: 0,
      pageSize,
    };
    this.onGetSuppliers(nextValues);
  };

  onGetSuppliers = (values = this.props.formik.values) => {
    this.props.onGetSuppliers(values);
  };

  renderDate(rowData) {
    if (rowData && rowData[this.field]) {
      return dateFns.format(new Date(rowData[this.field]), 'dd/MM/yyyy');
    }
    return '';
  }

  render() {
    const { initialData } = this.state;
    const { classes, formik } = this.props;
    const { isSent, pageSize, pageIndex, totalCount } = formik.values;

    return (
      <Card className={classes.section}>
        <CardHeader
          title={
            <Grid container justify="space-between">
              <Grid item>Thông Tin Gửi Mail</Grid>
              <Grid item>
                <MuiButton outline disabled={isSent} onClick={this.onSendMail}>
                  Gửi Mail
                </MuiButton>
              </Grid>
            </Grid>
          }
          className={classes.cardHeader}
        />
        <CardContent className={classes.cardContent}>
          <MuiTable
            data={initialData}
            columns={this.columns}
            options={{
              search: false,
              toolbar: false,
              sorting: false,
              pageSize,
              selection: true,
              isRowSelectable: this.isRowSelectable,
            }}
            totalCount={totalCount}
            initialPage={pageIndex}
            components={{
              Body: props => (
                <MuiTableBody
                  {...props}
                  renderData={initialData}
                  currentPage={0}
                />
              ),
            }}
            onChangePage={this.onChangePage}
            onSelectionChange={this.onSelectionChange}
            onChangeRowsPerPage={this.onChangeRowsPerPage}
          />
        </CardContent>
      </Card>
    );
  }
}

Section2.propTypes = {
  classes: PropTypes.object.isRequired,
  formik: PropTypes.object,
  initialData: PropTypes.array,
  onSendMail: PropTypes.func,
  onShowWarning: PropTypes.func,
  onGetSuppliers: PropTypes.func,
};

Section2.defaultProps = {
  initialData: [],
};

export const mapStateToProps = createStructuredSelector({
  initialData: makeSelectData('suppliers'),
});

export const mapDispatchToProps = dispatch => ({
  onSendMail: (datas, callback) => dispatch(sendMail(datas, callback)),
  onShowWarning: message => dispatch(showWarning(message)),
  onGetSuppliers: params => dispatch(suppliersRoutine.request({ params })),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withStyles(styles),
  withConnect,
  withImmutablePropsToJS,
)(Section2);
