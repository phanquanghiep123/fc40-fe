import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Field } from 'formik';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import { createStructuredSelector } from 'reselect';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import InputControl from 'components/InputControl';
import Paper from '@material-ui/core/Paper';
import MaterialTable from 'material-table';
import { Button } from '@material-ui/core';
// import { debounce } from 'lodash';
import appTheme from '../../../../App/theme';

const styles = theme => ({
  wrap: {
    padding: theme.spacing.unit * 1,
  },
  group: {
    marginTop: theme.spacing.unit * 1,
    marginBottom: theme.spacing.unit * 2,
  },
  btnContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '5px 0px',
    '& > *': {
      padding: `${theme.spacing.unit * 1}px ${theme.spacing.unit * 4}px`,
    },
  },
  resetBtn: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.primary.main,
    marginRight: theme.spacing.unit * 2,
  },
  container: {
    justifyContent: 'space-around',
    padding: `0px ${theme.spacing.unit * 2}px`,
  },
});

// eslint-disable-next-line react/prefer-stateless-function
class DialogWrapper extends React.Component {
  columnDefs = [
    {
      title: 'Mã Khay Sọt',
      field: 'basketsCode',
    },
    {
      title: 'Tên Khay Sọt',
      field: 'basketsName',
    },
    {
      title: 'Đơn vị tính ',
      field: 'uoM',
    },
    {
      title: 'SL Mượn',
      field: 'slm',
    },
  ];

  render() {
    const { ui, classes, open, onClose } = this.props;
    return (
      <ui.Dialog
        {...ui.props}
        title="Danh sách khay sọt đang mượn"
        content={
          <Grid container spacing={40}>
            <Grid item xs={12}>
              <Paper className={classes.wrap}>
                <Grid container spacing={40} className={classes.group}>
                  <Grid item xs={6}>
                    <Field
                      name="DVCM"
                      label="Đơn vị cho mượn"
                      component={InputControl}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      name="DVM"
                      label="Đơn vị mượn"
                      component={InputControl}
                      disabled
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <MaterialTable
                data={[
                  {
                    basketsCode: 'K04037',
                    basketsName: 'Khay Sọt 1',
                    uoM: 'KG',
                  },
                  {
                    basketsCode: 'K04038',
                    basketsName: 'Khay Sọt 2',
                    uoM: 'KG',
                  },
                ]}
                columns={this.columnDefs}
                options={{
                  search: false,
                  toolbar: false,
                  headerStyle: {
                    background: appTheme.palette.background.head,
                    paddingTop: appTheme.spacing.unit,
                    paddingBottom: appTheme.spacing.unit,
                  },
                  rowStyle: {
                    paddingTop: appTheme.spacing.unit / 2,
                    paddingBottom: appTheme.spacing.unit / 2,
                  },
                  showTitle: false,
                  columnsButton: false,
                  exportButton: false,
                  selection: true,
                  addRowPosition: 'last',
                  showSelectAllCheckbox: false,
                  emptyRowsWhenPaging: false,
                }}
              />
            </Grid>
            <Grid
              item
              xs={12}
              lg={12}
              xl={12}
              md={12}
              className={classes.group}
            >
              <div className={classes.btnContainer}>
                <Button
                  type="reset"
                  variant="contained"
                  className={classes.resetBtn}
                  // onClick={() => this.closeDialog(formik)}
                >
                  Chọn
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={onClose}
                >
                  Đóng
                </Button>
              </div>
            </Grid>
          </Grid>
        }
        openDl={open}
        fullWidth
        maxWidth="lg"
        isDialog={false}
        customActionDialog
        onClose={onClose}
      />
    );
  }
}

DialogWrapper.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const mapStateToProps = createStructuredSelector({});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withStyles(styles),
)(withImmutablePropsToJS(DialogWrapper));
