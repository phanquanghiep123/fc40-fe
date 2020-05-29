import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect as connectFormik } from 'formik';
import {
  createMuiTheme,
  MuiThemeProvider,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Slide,
} from '@material-ui/core';
import FormSection from './FormSection';
import TableSection from './TableSection';
import appTheme from '../../../App/theme';
import * as actions from '../actions';
import MuiButton from '../../../../components/MuiButton';
import * as selector from '../selectors';
import { getProductCodes } from '../utils';

const muiTheme = (theme = appTheme) =>
  createMuiTheme({
    ...theme,
    overrides: {
      MuiDialog: {
        paper: {
          background: theme.palette.background.default,
        },
      },
    },
  });

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class SuggestionDeli extends React.Component {
  componentDidMount() {
    this.props.onGetDeliFormData();
  }

  onEnteredDialog = () => {
    const {
      date,
      deliverCode,
      receiverCode,
      detailsCommands,
    } = this.props.formik.values;
    const params = {
      pickingDate: date,
      exportingOrg: deliverCode,
      importingOrg: receiverCode,
      exceptProductCodes: getProductCodes(detailsCommands),
    };
    this.props.onGetDeliTableData(params);
  };

  handleSubmitClick = () => {
    const { deliSelectedRows } = this.props;
    const { deliverCode } = this.props.formik.values;

    this.props.onGetDeliSelectProducts(
      deliverCode,
      deliSelectedRows,
      products => {
        this.props.onClose();
        this.props.onHandleSubmitClick(products);
      },
    );
  };

  render() {
    const { open, onClose } = this.props;

    return (
      <MuiThemeProvider theme={muiTheme}>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={onClose}
          maxWidth="xl"
          fullWidth
          onEntered={this.onEnteredDialog}
        >
          <DialogTitle>Gợi Ý Từ Chia Chọn Thực Tế</DialogTitle>
          <DialogContent>
            <div>
              <FormSection />
              <TableSection />
            </div>
            <DialogActions>
              <MuiButton outline onClick={onClose}>
                Hủy Bỏ
              </MuiButton>
              <MuiButton onClick={this.handleSubmitClick}>
                Chọn Sản Phẩm
              </MuiButton>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </MuiThemeProvider>
    );
  }
}

SuggestionDeli.propTypes = {
  open: PropTypes.bool,
  formik: PropTypes.object,
  onClose: PropTypes.func,
  onGetDeliFormData: PropTypes.func,
  onGetDeliTableData: PropTypes.func,
  onHandleSubmitClick: PropTypes.func,
  onGetDeliSelectProducts: PropTypes.func,
  deliSelectedRows: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

export function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetDeliFormData: () => dispatch(actions.getDeliFormData()),
    onGetDeliTableData: params => dispatch(actions.getDeliTableData(params)),
    onGetDeliSelectProducts: (deliverCode, selectedRows, callback) =>
      dispatch(
        actions.getDeliSelectProducts(deliverCode, selectedRows, callback),
      ),
  };
}

const mapStateToProps = createStructuredSelector({
  deliSelectedRows: selector.deliSelectedRows(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  connectFormik,
)(SuggestionDeli);
