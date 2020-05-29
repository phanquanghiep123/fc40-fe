import PropTypes from 'prop-types';

import { compose } from 'redux';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import { withRouter } from 'react-router-dom';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';

import { withStyles } from '@material-ui/core/styles';

import { styles } from '../CreatePage';
import { BBGNHHEditPage, withConnect } from '../EditPage';

import saga from '../EditPage/saga';
import reducer from '../EditPage/reducer';

import sagaCreate from '../CreatePage/saga';
import reducerCreate from '../CreatePage/reducer';

import { TYPE_FORM } from '../CreatePage/constants';

export class BBGNHHViewPage extends BBGNHHEditPage {
  typeForm = TYPE_FORM.VIEW;
}

BBGNHHEditPage.propTypes = {
  history: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  initialSchema: PropTypes.object,
  onGetInitMaster: PropTypes.func,
};

BBGNHHViewPage.defaultProps = {
  initialSchema: {},
};

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
)(BBGNHHViewPage);
