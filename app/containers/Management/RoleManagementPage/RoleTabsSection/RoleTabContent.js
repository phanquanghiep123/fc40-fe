import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import CardContent from '@material-ui/core/CardContent';

import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

import MuiTable, { MuiTableEditRow } from 'components/MuiTable';

import { TYPE_EDITING } from '../constants';

export const styles = theme => ({
  paper: {
    '& > div, & > div > div > div': {
      overflow: 'visible !important',
    },
    boxShadow: theme.shade.light,
    borderRadius: 0,
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
});

export class RoleTabContent extends React.Component {
  columns = [
    {
      title: 'Hành Động',
      width: 120,
      sorting: false,
      headerStyle: {
        minWidth: 120,
        textAlign: 'center',
      },
      disableClick: true,
      render: rowData => this.renderActionButtons(rowData),
    },
  ];

  tableRef = null;

  tableEditRef = null;

  isChanging = false;

  typeEditing = TYPE_EDITING.NONE;

  componentDidMount() {
    this.setRef(this);
  }

  componentWillUnmount() {
    this.setRef(null);
  }

  setRef(ref) {
    if (this.props.tableRef) {
      this.props.tableRef(ref);
    }
  }

  setEditRef = ref => {
    this.tableEditRef = ref;
    if (this.props.tableEditRef) {
      this.props.tableEditRef(ref);
    }
  };

  confirmRowDelete = rowData => {
    if (this.typeEditing === TYPE_EDITING.NONE) {
      this.props.showConfirm({
        message: 'Bạn chắc chắn muốn xóa?',
        actions: [
          { text: 'Hủy', color: 'primary' },
          {
            text: 'Đồng ý',
            onClick: () => this.handleDeleteClick(rowData),
          },
        ],
      });
    }
  };

  confirmAllowEditing(callback) {
    if (this.isChanging) {
      const newData = this.tableEditRef.state.data;
      const oldData = this.tableEditRef.props.data;

      if (this.typeEditing === TYPE_EDITING.ADD) {
        if (this.props.onRowAdd) {
          this.props.onRowAdd(newData);
        }
      }
      if (this.typeEditing === TYPE_EDITING.UPDATE) {
        if (this.props.onRowUpdate) {
          this.props.onRowUpdate(newData, oldData);
        }
      }
    }
    callback();
  }

  setIsChanging = isChanging => {
    this.isChanging = isChanging;
  };

  handleAddClick = () => {
    this.confirmAllowEditing(() => {
      this.tableRef.showAddRow(true);
    });
  };

  handleEditClick = rowData => {
    if (!this.isChanging) {
      this.confirmAllowEditing(() => {
        this.tableRef.showUpdateRow(rowData);
      });
    }
  };

  handleDeleteClick = rowData => {
    if (this.props.onRowDelete) {
      this.props.onRowDelete(rowData);
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

  handleEditingApproved = (mode, newData, oldData) => {
    if (mode === 'add') {
      if (this.props.onRowAdd) {
        this.props.onRowAdd(newData);
      }
      this.tableRef.hideAddRow();
    } else if (mode === 'update') {
      if (this.props.onRowUpdate) {
        this.props.onRowUpdate(newData, oldData);
      }
      this.tableRef.hideEditingRow(oldData);
    }
  };

  renderActionButtons(rowData) {
    if (rowData && rowData.tableData && !rowData.tableData.editing) {
      return (
        <Grid container wrap="nowrap" justify="center">
          <Tooltip title="Sửa">
            <IconButton onClick={() => this.handleEditClick(rowData)}>
              <Icon fontSize="small">edit</Icon>
            </IconButton>
          </Tooltip>
          <Tooltip title="Xóa">
            <IconButton onClick={() => this.confirmRowDelete(rowData)}>
              <Icon fontSize="small">delete</Icon>
            </IconButton>
          </Tooltip>
        </Grid>
      );
    }
    return undefined;
  }

  render() {
    const { classes, ...tableProps } = this.props;

    return (
      <React.Fragment>
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
        <MuiTable
          {...tableProps}
          ref={ref => {
            this.tableRef = ref;
          }}
          data={this.props.data}
          columns={[...this.props.columns, ...this.columns]}
          icons={{
            Check: props => <Icon {...props}>save</Icon>,
          }}
          options={{
            toolbar: false,
            sorting: false,
            cellLastStyle: {
              padding: 0,
              paddingRight: 0,
            },
            addRowPosition: 'first',
            actionsColumnIndex: this.props.columns.length,
          }}
          components={{
            Container: props => <Paper {...props} className={classes.paper} />,
            EditRow: props => (
              <MuiTableEditRow
                {...props}
                ref={this.setEditRef}
                onEditingApproved={this.handleEditingApproved}
              />
            ),
          }}
          onRowEditing={this.handleRowEditing}
        />
      </React.Fragment>
    );
  }
}

RoleTabContent.propTypes = {
  classes: PropTypes.object.isRequired,
  tableRef: PropTypes.any,
  tableEditRef: PropTypes.any,
  data: PropTypes.array,
  columns: PropTypes.array,
  onRowAdd: PropTypes.func,
  onRowUpdate: PropTypes.func,
  onRowDelete: PropTypes.func,
  showConfirm: PropTypes.func,
};

export default withStyles(styles)(RoleTabContent);
