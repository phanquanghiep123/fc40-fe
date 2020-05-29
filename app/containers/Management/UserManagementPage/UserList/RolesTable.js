import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';

import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

import MuiTable, { MuiTableEditRow } from 'components/MuiTable';

import { transformAsyncOptions } from 'utils/transformUtils';

import { CODE, SCREEN_CODE } from 'authorize/groupAuthorize';
import { Can } from 'authorize/ability-context';
import Select from './Select';

import Schema from '../roleSchema';

import { TYPE_EDITING } from '../constants';

export const styles = theme => ({
  root: {
    overflow: 'visible',
    boxShadow: theme.shade.light,
    marginBottom: theme.spacing.unit * 3,
  },
  paper: {
    '& > div, & > div > div > div': {
      overflow: 'visible !important',
    },
    boxShadow: theme.shade.light,
    borderRadius: 0,
  },
  header: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  content: {
    textAlign: 'right',
  },
  button: {
    color: theme.palette.primary.main,
    minWidth: 36,
    boxShadow: theme.shade.grey,
    backgroundColor: '#ffffff',
  },
  actions: {
    padding: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
    justifyContent: 'flex-end',
  },
  saveButton: {
    width: '10em',
    borderRadius: 2,
  },
});

export class RolesTable extends React.PureComponent {
  state = {
    datas: [],
  };

  columns = [
    {
      title: 'Mã',
      field: 'value',
      headerStyle: {
        minWidth: 180,
        maxWidth: 200,
      },
      editComponent: props => (
        <Select
          {...props}
          promiseOptions={transformAsyncOptions(
            this.props.onGetRoleAutocomplete,
            'value',
            'name',
          )}
          validBeforeChange={this.validBeforeChange}
          onAutocompleteChange={this.handleSelectChange}
        />
      ),
    },
    {
      title: 'Tên',
      width: '35vw',
      render: rowData => rowData.name,
    },
    {
      title: 'Diễn Giải',
      width: '35vw',
      render: rowData => rowData.description,
    },
    {
      title: 'Trạng Thái',
      width: 150,
      render: this.renderActiveStatus,
    },
    {
      title: 'Hành Động',
      width: 110,
      render: rowData => this.renderActionButtons(rowData),
      sorting: false,
      headerStyle: {
        textAlign: 'center',
      },
      disableClick: true,
    },
  ];

  tableRef = null;

  tableEditRef = null;

  typeEditing = TYPE_EDITING.NONE;

  isChanging = false;

  componentWillReceiveProps(nextProps) {
    if (nextProps.userId !== this.props.userId) {
      this.setState({ datas: this.getData(nextProps.datas) });
    }
  }

  getData(datas) {
    if (datas && datas.length > 0) {
      return datas.slice();
    }
    return [];
  }

  getRoleIds() {
    const results = [];

    for (let i = 0, len = this.state.datas.length; i < len; i += 1) {
      const data = this.state.datas[i];

      if (data && data.roleId) {
        results.push(data.roleId);
      }
    }

    return results;
  }

  confirmAllowEditing(callback) {
    if (this.isChanging) {
      const newData = this.tableEditRef.state.data;
      const oldData = this.tableEditRef.props.data;

      if (this.typeEditing === TYPE_EDITING.ADD) {
        this.handleRowAdd(newData);
      }
      if (this.typeEditing === TYPE_EDITING.UPDATE) {
        this.handleRowUpdate(newData, oldData);
      }
    }
    callback();
  }

  validBeforeChange = option => {
    const foundData = this.state.datas.find(
      data => data.roleId === option.roleId,
    );

    if (foundData) {
      this.props.showWarning('Đã tồn tại trong danh sách');
      return false;
    }
    return true;
  };

  handleSaveClick = () => {
    this.props.onSave(this.props.userId, this.getRoleIds());
  };

  handleAddClick = () => {
    this.confirmAllowEditing(() => {
      this.tableRef.showAddRow(true);
    });
  };

  handleEditClick = rowData => {
    this.confirmAllowEditing(() => {
      this.tableRef.showUpdateRow(rowData);
    });
  };

  handleDeleteClick = rowData => {
    if (this.typeEditing === TYPE_EDITING.NONE) {
      this.props.showConfirm({
        message: 'Bạn chắc chắn muốn xóa?',
        actions: [
          { text: 'Hủy' },
          {
            text: 'Đồng ý',
            color: 'primary',
            onClick: () => this.handleRowDelete(rowData),
          },
        ],
      });
    }
  };

  handleRowEditing = (mode, isEditing) => {
    this.isChanging = false;

    if (isEditing) {
      this.typeEditing = mode;
    } else {
      this.typeEditing = TYPE_EDITING.NONE;
    }
  };

  handleSelectChange = option => {
    if (this.tableEditRef) {
      this.isChanging = true;
      this.tableEditRef.setState(state => ({
        data: {
          ...state.data,
          ...new Schema(option),
        },
      }));
    }
  };

  handleEditingApproved = (mode, newData, oldData) => {
    if (mode === 'add') {
      this.tableRef.hideAddRow();
      this.handleRowAdd(newData);
    } else if (mode === 'update') {
      this.tableRef.hideEditingRow(oldData);
      this.handleRowUpdate(newData, oldData);
    }
  };

  handleRowAdd = rowData => {
    if (rowData && rowData.roleId > 0) {
      const { datas } = this.state;
      const nextDatas = datas.slice();

      nextDatas.unshift(new Schema(rowData));

      this.setState({ datas: nextDatas });
    }
  };

  handleRowUpdate = (rowData, oldData) => {
    if (rowData && oldData && rowData.roleId !== oldData.roleId) {
      const { datas } = this.state;
      const nextDatas = datas.slice();

      const foundIndex = nextDatas.findIndex(
        data => data && data.roleId === oldData.roleId,
      );

      if (foundIndex !== -1) {
        nextDatas.splice(foundIndex, 1, new Schema(rowData));
        this.setState({ datas: nextDatas });
      }
    }
  };

  handleRowDelete = rowData => {
    const { datas } = this.state;
    const nextDatas = datas.slice();

    const foundIndex = nextDatas.findIndex(
      data => data && data.roleId === rowData.roleId,
    );

    if (foundIndex !== -1) {
      nextDatas.splice(foundIndex, 1);
      this.setState({ datas: nextDatas });
    }
  };

  renderActiveStatus(rowData) {
    if (rowData.isActive === undefined) return '';
    if (rowData.isActive) return 'Hoạt động';
    return 'Không hoạt động';
  }

  renderActionButtons(rowData) {
    if (rowData && rowData.tableData && !rowData.tableData.editing) {
      return (
        <Can on={CODE.suaUser} do={SCREEN_CODE.QLND}>
          <Grid container wrap="nowrap" justify="center">
            <Tooltip title="Sửa">
              <IconButton onClick={() => this.handleEditClick(rowData)}>
                <Icon fontSize="small">edit</Icon>
              </IconButton>
            </Tooltip>
            <Tooltip title="Xóa">
              <IconButton onClick={() => this.handleDeleteClick(rowData)}>
                <Icon fontSize="small">delete</Icon>
              </IconButton>
            </Tooltip>
          </Grid>
        </Can>
      );
    }
    return undefined;
  }

  render() {
    const { datas } = this.state;
    const { classes, userId, userName, loading } = this.props;

    if (userId) {
      return (
        <Card className={classes.root}>
          <CardHeader
            title="Phân Quyền"
            subheader={userName || ''}
            titleTypographyProps={{
              variant: 'h6',
            }}
            subheaderTypographyProps={{
              variant: 'caption',
            }}
            className={classes.header}
          />
          <Can do={CODE.suaUser} on={SCREEN_CODE.QLND}>
            <CardContent className={classes.content}>
              <Tooltip title="Thêm mới">
                <Button
                  color="primary"
                  className={classes.button}
                  onClick={this.handleAddClick}
                >
                  Thêm mới
                </Button>
              </Tooltip>
            </CardContent>
          </Can>
          <MuiTable
            ref={ref => {
              this.tableRef = ref;
            }}
            data={datas}
            columns={this.columns}
            options={{
              toolbar: false,
              sorting: datas.length > 0,
              // headerStyle: {
              //   top: 0,
              //   position: 'sticky',
              // },
              cellLastStyle: {
                padding: 0,
                paddingRight: 0,
              },
              // maxBodyHeight: 400,
              addRowPosition: 'first',
              actionsColumnIndex: this.columns.length - 1,
            }}
            components={{
              Container: props => (
                <Paper {...props} className={classes.paper} />
              ),
              EditRow: props => (
                <MuiTableEditRow
                  ref={ref => {
                    this.tableEditRef = ref;
                  }}
                  {...props}
                  onEditingApproved={this.handleEditingApproved}
                />
              ),
            }}
            isLoading={loading}
            onRowEditing={this.handleRowEditing}
          />
          <CardActions className={classes.actions}>
            <Button
              color="primary"
              variant="contained"
              className={classes.saveButton}
              onClick={this.handleSaveClick}
            >
              Lưu
            </Button>
          </CardActions>
        </Card>
      );
    }
    return null;
  }
}

RolesTable.propTypes = {
  classes: PropTypes.object.isRequired,
  userId: PropTypes.any,
  userName: PropTypes.string,
  loading: PropTypes.bool,
  datas: PropTypes.array,
  showWarning: PropTypes.func,
  onSave: PropTypes.func,
  onGetRoleAutocomplete: PropTypes.func,
};

RolesTable.defaultProps = {
  loading: false,
  datas: [],
};

export default withStyles(styles)(RolesTable);
