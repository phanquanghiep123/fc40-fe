import PropTypes from 'prop-types';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import { withRouter } from 'react-router-dom';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';

import { withStyles } from '@material-ui/core/styles';

import { showWarning } from 'containers/App/actions';

import { BBGNHHCreatePage, styles } from '../CreatePage';

import saga from './saga';
import reducer from './reducer';

import sagaCreate from '../CreatePage/saga';
import reducerCreate from '../CreatePage/reducer';

import { bbgnhhRoutine } from './routines';
import { makeSelectProp } from './selectors';

import { TYPE_FORM } from '../CreatePage/constants';
import { masterRoutine } from '../CreatePage/routines';

export class BBGNHHEditPage extends BBGNHHCreatePage {
  id = null;

  typeForm = TYPE_FORM.EDIT;

  componentDidMount() {
    const {
      params: { id },
    } = this.props.match;
    const {
      location: { search },
    } = this.props.history;

    const searchParams = new URLSearchParams(search);
    const typeBBGNHH = searchParams.get('type') * 1;

    this.id = id;
    this.props.onGetInitMaster(id, typeBBGNHH);
  }

  submitForm = values => {
    this.props.onUpdateBBGNHH(this.id, values);
  };
}

BBGNHHEditPage.propTypes = {
  history: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  initialSchema: PropTypes.object,
  onUpdateBBGNHH: PropTypes.func,
  onGetInitMaster: PropTypes.func,
};

BBGNHHEditPage.defaultProps = {
  initialSchema: {},
};

const mapStateToProps = createStructuredSelector({
  initialSchema: makeSelectProp('initialSchema'),
});

export const mapDispatchToProps = dispatch => ({
  onShowWarning: message => dispatch(showWarning(message)),
  onGetInitMaster: (id, type) => {
    dispatch(masterRoutine.request());
    dispatch(bbgnhhRoutine.request({ id, type }));
  },
  onUpdateBBGNHH: (id, data) =>
    dispatch(bbgnhhRoutine.editingRequest({ id, data })),
});

export const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withSaga = injectSaga({ key: 'bbgnhhEdit', saga });
const withReducer = injectReducer({ key: 'bbgnhhEdit', reducer });

const withSagaCreate = injectSaga({ key: 'bbgnhhCreate', saga: sagaCreate });
const withReducerCreate = injectReducer({
  key: 'bbgnhhCreate',
  reducer: reducerCreate,
});

export default compose(
  withStyles(styles),
  withRouter,
  withSaga,
  withReducer,
  withConnect,
  withSagaCreate,
  withReducerCreate,
  withImmutablePropsToJS,
)(BBGNHHEditPage);
