/**
 *
 * BBGHReceiving
 *
 */
import React from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import { FormattedMessage } from 'react-intl';
import { Typography } from '@material-ui/core';
import { DELIVERY_ORDER_BUSSINES } from 'containers/App/constants';
import messages from './messages';
import {
  makeSelectInitialSchema,
  makeSelectLeadTime,
  makeSelectMasterCode,
  makeSelectVehicleRoute,
  makeSelectBackToPreviousPage,
} from './selectors';
import reducer from './reducer';
import saga from './saga';
import {
  initReceivingDeliveryOrder,
  restoreRegulatedLeadtime,
  submitForm,
  getReceivingPerson,
  saveCreateImport,
} from './actions';
import FarmProcesor from './FarmProcessor';
import Bussines from './Bussines';
import { alertInvalidWhenSubmit } from '../App/actions';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    padding: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
  },
  container: {
    justifyContent: 'space-around',
    padding: `0px ${theme.spacing.unit * 2}px`,
  },
  dateEnd: {
    top: theme.spacing.unit * 2,
  },
  btnContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '5px 10px',
    '& > *': {
      padding: `${theme.spacing.unit * 1}px ${theme.spacing.unit * 4}px`,
    },
  },
  space: {
    width: '10%',
  },
  resetBtn: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.primary.main,
    marginRight: theme.spacing.unit * 2,
  },
  chooseFileBtn: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.primary.main,
    marginRight: theme.spacing.unit * 2,
  },
  deleteImage: {
    height: 24,
    minHeight: 24,
    width: 24,
    position: 'absolute',
    top: -100,
    right: -12,
  },
  image: {
    width: 200,
    height: 200,
  },
  imageWrapper: {
    position: 'relative',
    margin: 12,
  },
  section: {
    marginTop: theme.spacing.unit * 2,
  },
  title: {
    marginTop: theme.spacing.unit * 2,
  },
});
export class ReceivingDeliveryOrder extends React.Component {
  state = {
    shipperId: null,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.backToPreviousPage > this.props.backToPreviousPage) {
      if (
        this.props.match.path ===
        '/danh-sach-bien-ban-giao-hang/tiep-nhan-bien-ban-giao-hang/:id'
      ) {
        this.props.history.push('/danh-sach-bien-ban-giao-hang');
      } else {
        this.props.history.push('/');
      }
    }
  }

  componentWillMount() {
    const { match, location, onInit } = this.props;
    const shipperId = new URLSearchParams(location.search).get('shipperId');
    this.setState({
      shipperId,
    });
    if (match.params.id) {
      onInit(match.params.id, shipperId);
    }
  }

  onSubmitForm = (values, path) => {
    const { match, onSubmitForm, history } = this.props;
    if (values.fieldName === 'PNK') {
      const { id } = this.props.match.params;
      this.props.handleSaveCreateImport(
        {
          ...values,
          id,
        },
        data => {
          this.props.history.push(
            `/danh-sach-phieu-can-nhap-kho/can-san-pham-nhap-kho?plantCode=${
              values.receiverCode
            }&documentId=${data}`,
          );
        },
      );
      return false;
    }
    if (values.fieldName === 'PNKS') {
      const { id } = this.props.match.params;
      this.props.handleSaveCreateImport(
        {
          ...values,
          id,
        },
        data => {
          this.props.history.push(
            `/danh-sach-bien-ban-giao-hang/chinh-sua-phieu-nhap-kho-khay-sot?form=2&id=${data}`,
          );
        },
      );
      return false;
    }
    onSubmitForm(match.params.id, values, () => history.goBack(), path);
    return true;
  };

  getReceivingPerson = (inputText, orgId, callback) => {
    const { onGetReceivingPerson } = this.props;
    onGetReceivingPerson(callback, orgId, inputText);
  };

  render() {
    const {
      classes,
      initialSchema,
      masterCode,
      onAlertInvalidWhenSubmit,
      leadTime,
      vehicleRoute,
      history,
      match,
    } = this.props;
    return (
      <React.Fragment>
        <Typography
          className={classes.title}
          variant="h5"
          color="textPrimary"
          gutterBottom
        >
          <FormattedMessage {...messages.header} />
        </Typography>
        {initialSchema.doType !== DELIVERY_ORDER_BUSSINES && (
          <FarmProcesor
            classes={classes}
            masterCode={masterCode}
            initialSchema={initialSchema}
            onAlertInvalidWhenSubmit={onAlertInvalidWhenSubmit}
            leadTime={leadTime}
            vehicleRoute={vehicleRoute}
            onSubmitForm={values =>
              this.onSubmitForm(values, 'farm-processors')
            }
            history={history}
            match={match}
            onGetReceivingPersonAutoCompele={this.getReceivingPerson}
          />
        )}
        {initialSchema.doType === DELIVERY_ORDER_BUSSINES && (
          <Bussines
            history={history}
            classes={classes}
            masterCode={masterCode}
            leadTime={leadTime}
            initialSchema={initialSchema}
            vehicleRoute={vehicleRoute}
            shipperId={this.state.shipperId}
            onAlertInvalidWhenSubmit={onAlertInvalidWhenSubmit}
            onSubmitForm={values =>
              this.onSubmitForm(values, 'business-management')
            }
            onGetReceivingPersonAutoCompele={this.getReceivingPerson}
          />
        )}
      </React.Fragment>
    );
  }
}

ReceivingDeliveryOrder.propTypes = {
  classes: PropTypes.object.isRequired,
  initialSchema: PropTypes.object,
  masterCode: PropTypes.object,
  onInit: PropTypes.func,
  onSubmitForm: PropTypes.func,
  onAlertInvalidWhenSubmit: PropTypes.func,
  match: PropTypes.object,
  leadTime: PropTypes.array,
  vehicleRoute: PropTypes.array,
  history: PropTypes.object,
  onGetReceivingPerson: PropTypes.func,
  handleSaveCreateImport: PropTypes.func,
};
const mapStateToProps = createStructuredSelector({
  initialSchema: makeSelectInitialSchema(),
  masterCode: makeSelectMasterCode(),
  leadTime: makeSelectLeadTime(),
  vehicleRoute: makeSelectVehicleRoute(),
  backToPreviousPage: makeSelectBackToPreviousPage(),
});

export const mapDispatchToProps = dispatch => ({
  onInit: (id, shipperId) =>
    dispatch(initReceivingDeliveryOrder(id, shipperId)),
  onSubmitForm: (id, form, callback, path) =>
    dispatch(submitForm(id, form, callback, path)),
  onAlertInvalidWhenSubmit: message =>
    dispatch(alertInvalidWhenSubmit(message)),
  onRestoreRegulatedLeadtime: () => dispatch(restoreRegulatedLeadtime()),
  onGetReceivingPerson: (callback, orgId, inputText) =>
    dispatch(getReceivingPerson(callback, orgId, inputText)),
  handleSaveCreateImport: (values, callback) =>
    dispatch(saveCreateImport(values, callback)),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const withReducer = injectReducer({ key: 'receivingDeliveryOrder', reducer });
const withSaga = injectSaga({ key: 'receivingDeliveryOrder', saga });
export default compose(
  withConnect,
  withReducer,
  withSaga,
)(withStyles(styles)(withImmutablePropsToJS(ReceivingDeliveryOrder)));
