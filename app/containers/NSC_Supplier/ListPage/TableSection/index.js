import React from 'react';
import * as PropTypes from 'prop-types';

import { Button, withStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';

import MuiTable from 'components/MuiTable';
import Expansion from 'components/Expansion';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';

import CardContent from '@material-ui/core/CardContent';

import { createStructuredSelector } from 'reselect/lib/index';
import { connect } from 'react-redux';
import { compose } from 'redux';
import withImmutablePropsToJs from 'with-immutable-props-to-js';

import { SCREEN_CODE, CODE } from 'authorize/groupAuthorize';
import { Can } from 'authorize/ability-context';
import * as makeSelect from '../selectors';
import * as actions from '../actions';

import appTheme from '../../../App/theme';
import DeleteConfirm from './ConfirmDeletionDialog';
import MTableBodyRowCustomized from './MTableBodyRowCustomized';
import { LINK } from '../constants';

const style = (theme = appTheme) => ({
  paper: {
    marginBottom: theme.spacing.unit * 4,
  },
  topToolbar: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 3}px`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topToolbarPart: {
    display: 'flex',
    '& > *:not(:last-child)': {
      marginRight: theme.spacing.unit * 2,
    },
  },
  topButton: {
    color: theme.palette.primary.main,
    background: '#fff',
    boxShadow: `0 1px 3px #aaa`,
    paddingRight: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 2,
  },
});

/* eslint-disable react/prefer-stateless-function */
class TableSection extends React.Component {
  state = {
    openDialog: false,
    idForDeletion: null,
  };

  confirmRef = null;

  handleDialogOpen = doId => {
    this.setState({ openDialog: true, idForDeletion: doId });
  };

  handleDialogClose = () => {
    this.setState({ openDialog: false, idForDeletion: null });
  };

  matchingDataSchema = (rowData, formData) => {
    if (!formData) {
      return '';
    }

    const matches = formData.filter(item => item.value === rowData);

    if (matches.length > 0 && matches[0].label) {
      return matches[0].label;
    }
    return '';
  };

  createColumns = () => {
    const { formData } = this.props;

    const columns = [
      {
        title: 'STT',
        width: '15vw',
        render: rowData => rowData.rowIndex,
      },
      {
        title: 'THÔNG TIN NCC',
        hidden: true,
        field: 'supplierInfo',
        headerStyle: {
          textAlign: 'center',
          borderLeft: '1px solid rgba(224, 224, 224, 1)',
        },
      },
      {
        title: 'Vùng/Miền',
        width: '25vw',
        parentField: 'supplierInfo',
        field: 'regionCode',
        render: rowData =>
          this.matchingDataSchema(rowData.regionCode, formData.regionCode),
      },
      {
        title: 'Mã NCC',
        width: '20vw',
        parentField: 'supplierInfo',
        field: 'supplierCode',
      },
      {
        title: 'Loại NCC',
        width: '25vw',
        parentField: 'supplierInfo',
        field: 'supplierType',
        render: rowData =>
          this.matchingDataSchema(rowData.supplierType, formData.supplierType),
      },
      {
        title: 'Tên NCC',
        width: '70vw',
        parentField: 'supplierInfo',
        field: 'name1',
      },
      {
        title: 'Sđt',
        width: '30vw',
        parentField: 'supplierInfo',
        field: 'phone',
      },
      {
        title: 'Email',
        width: '30vw',
        parentField: 'supplierInfo',
        field: 'email',
      },
      {
        title: 'THÔNG TIN HĐ',
        hidden: true,
        field: 'contractInfo',
        headerStyle: {
          textAlign: 'center',
          borderLeft: '1px solid rgba(224, 224, 224, 1)',
        },
      },
      {
        title: 'Mã HĐ',
        width: '35vw',
        parentField: 'contractInfo',
        field: 'contractCode',
      },
      {
        title: 'Loại HĐ',
        width: '35vw',
        parentField: 'contractInfo',
        field: 'contractType',
      },
      {
        title: 'Người đại diện',
        width: '45vw',
        parentField: 'contractInfo',
        field: 'representativeName',
      },
      {
        title: 'TRẠNG THÁI ',
        hidden: true,
        field: 'status',
        headerStyle: {
          textAlign: 'center',
          borderLeft: '1px solid rgba(224, 224, 224, 1)',
          borderRight: '1px solid rgba(224, 224, 224, 1)',
        },
      },
      {
        title: 'Nguồn',
        width: '25vw',
        parentField: 'status',
        field: 'createFromSource',
        render: rowData => {
          const source =
            (rowData.createFromSource === 'FC' && rowData.createFromSource) ||
            'SAP';
          return this.matchingDataSchema(source, formData.source);
        },
      },
      {
        title: 'PostingBlock',
        width: '25vw',
        parentField: 'status',
        field: 'postingBlock',
        render: rowData => {
          const blocked = rowData.postingBlock === '' ? '1' : '2';
          return this.matchingDataSchema(blocked, formData.postingBlock);
        },
      },
      {
        title: 'PurchBlock',
        width: '25vw',
        parentField: 'status',
        field: 'purchBlock',
        render: rowData => {
          const blocked = rowData.purchBlock === '' ? '1' : '2';
          return this.matchingDataSchema(blocked, formData.purchBlock);
        },
      },
      {
        title: '',
        width: '15vw',
        render: rowData =>
          (rowData.createFromSource === 'FC' && (
            <Grid container wrap="nowrap" justify="center">
              <Can do={CODE.suaNCC} on={SCREEN_CODE.DSNCC}>
                <Tooltip title="Sửa">
                  <Link
                    to={`${LINK.UPDATE_SUPPLIER}/${rowData.id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <IconButton>
                      <Icon fontSize="small">edit</Icon>
                    </IconButton>
                  </Link>
                </Tooltip>
              </Can>
              <Can do={CODE.xoaNCC} on={SCREEN_CODE.DSNCC}>
                <Tooltip title="Xóa">
                  <IconButton onClick={() => this.handleDialogOpen(rowData.id)}>
                    <Icon fontSize="small">delete</Icon>
                  </IconButton>
                </Tooltip>
              </Can>
            </Grid>
          )) || <div />,
      },
    ];

    return columns;
  };

  render() {
    const { tableData, classes, onDeleteRecord } = this.props;
    const columns = this.createColumns();

    const deleteDialog = (
      <DeleteConfirm
        open={this.state.openDialog}
        onClose={this.handleDialogClose}
        onDeleteRecord={onDeleteRecord}
        idForDeletion={this.state.idForDeletion}
      />
    );

    return (
      <Expansion
        title="Thông Tin Nhà Cung Cấp"
        noPadding
        content={
          <React.Fragment>
            <CardContent>
              <Grid container spacing={8} justify="flex-end">
                <Grid item>
                  <Tooltip title="Tạo mới">
                    <Link
                      to={LINK.CREATE_SUPPLIER}
                      style={{ textDecoration: 'none' }}
                    >
                      <Button
                        color="primary"
                        className={classes.topButton}
                        component="div"
                        onClick={() => {}}
                      >
                        Tạo mới
                      </Button>
                    </Link>
                  </Tooltip>
                </Grid>
              </Grid>
            </CardContent>
            <MuiTable
              data={tableData}
              columns={columns}
              options={{
                toolbar: false,
              }}
              onRowClick={(event, rowData) => {
                this.props.history.push(
                  `${LINK.VIEW_DETAIL_SUPPLIER}/${rowData.id}`,
                );
              }}
              components={{
                Row: MTableBodyRowCustomized,
              }}
              localization={{
                body: {
                  emptyDataSourceMessage:
                    'Không tìm thấy kết quả nào để hiển thị',
                },
              }}
            />
            {deleteDialog}
          </React.Fragment>
        }
      />
    );
  }
}

TableSection.propTypes = {
  classes: PropTypes.object,
  formData: PropTypes.any,
  tableData: PropTypes.array,
  history: PropTypes.object,
  onDeleteRecord: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  formData: makeSelect.formData(),
  tableData: makeSelect.tableData(),
  selectedRecords: makeSelect.tableSelectedRecords(),
  submittedValues: makeSelect.formSubmittedValues(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onSelectionChange: data => dispatch(actions.changeSelection(data)),
    onDeleteRecord: recordId => dispatch(actions.deleteRecord(recordId)),
    onUpdateTableData: tableData =>
      dispatch(actions.updateTableData(tableData)),
    onPrintSelected: (selectedRecords, callback) =>
      dispatch(actions.printSelectedRecords(selectedRecords, callback)),
    onSubmitForm: formValues => dispatch(actions.submitForm(formValues)),
    onExportExcel: formSubmittedValues =>
      dispatch(actions.exportExcel(formSubmittedValues)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withStyles(style()),
  withImmutablePropsToJs,
)(TableSection);
