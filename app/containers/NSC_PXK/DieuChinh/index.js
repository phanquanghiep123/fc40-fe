import React from 'react';
import PropTypes from 'prop-types';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';

import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { showWarning } from 'containers/App/actions';

import FormWrapper from 'components/FormikUI/FormWrapper';
import { formikPropsHelpers } from 'components/FormikUI/utils';

import saga from './saga';
import reducer from './reducer';

import { makeSelectFormSearch } from './selectors';
import { masterRoutine, locatorRoutine, receiptsRoutine } from './routines';

import Section1 from './Section1';
import Section2 from './Section2';

import Popup from './Popup';

import { FormSearchSchema } from './Schema';

import baseStyles from './styles';

export const styles = theme => ({
  ...baseStyles(theme),
  highlight: {
    backgroundColor: theme.palette.action.selected,
  },
  highlightText: {
    color: theme.palette.secondary.main,
    fontSize: 14,
  },
});

export class PXKDieuChinhPage extends React.Component {
  componentDidMount() {
    this.props.onGetInitMaster(({ formSearch }) => {
      this.onGetLocator(formSearch);
      this.onGetReceipts();
    });
  }

  onFormReset = () => {
    const {
      plantCode,
      plantName,
      locatorCode,
      locatorName,
    } = this.props.initialSchema;
    const nextValues = FormSearchSchema.cast({
      plantCode,
      plantName,
      locatorCode,
      locatorName,
    });
    this.onGetReceipts(nextValues);
  };

  onFormSubmit = values => {
    const nextValues = {
      ...values,
      pageIndex: 0,
    };
    this.onGetReceipts(nextValues);
  };

  onFormInvalid = () => {
    this.props.onShowWarning(
      'Thông tin tìm kiếm không hợp lệ, vui lòng kiểm tra lại',
    );
  };

  onUpdateSuccess = () => {
    this.onGetReceipts();
  };

  onGetLocator = params => {
    this.props.onGetLocator(params);
  };

  onGetReceipts = (values = this.props.initialSchema) => {
    this.props.onGetReceipts(values);
  };

  render() {
    const { classes, ui, initialSchema } = this.props;

    return (
      <FormWrapper
        FormikProps={{
          validate: values => {
            const errors = {};

            if (
              Number.isFinite(values.differentFrom) &&
              Number.isFinite(values.differentTo) &&
              values.differentFrom > values.differentTo
            ) {
              errors.differentRate = 'Tỷ lệ chênh lệch không hợp lệ';
            }

            return errors;
          },
          isInitialValid: true,
        }}
        initialValues={initialSchema}
        enableReinitialize
        onReset={this.onFormReset}
        onSubmit={this.onFormSubmit}
        onInvalidSubmission={this.onFormInvalid}
        render={formik => (
          <React.Fragment>
            <section className={classes.main}>
              <section className={classes.heading}>
                <Grid container spacing={16}>
                  <Grid item>
                    <Typography variant="h5" className={classes.titleText}>
                      Danh Sách Dữ Liệu Điều Chỉnh
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Chip
                      label="Chia chọn thực tế"
                      classes={{
                        root: classes.highlight,
                        label: classNames(
                          classes.titleText,
                          classes.highlightText,
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </section>
              <section className={classes.content}>
                <Grid container spacing={24}>
                  <Grid item xs={12}>
                    <Section1
                      formik={{
                        ...formik,
                        ...formikPropsHelpers(formik),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Section2
                      formik={{
                        ...formik,
                        ...formikPropsHelpers(formik),
                      }}
                    />
                  </Grid>
                </Grid>
              </section>
            </section>
            <Popup ui={ui} onUpdateSuccess={this.onUpdateSuccess} />
          </React.Fragment>
        )}
      />
    );
  }
}

PXKDieuChinhPage.propTypes = {
  classes: PropTypes.object.isRequired,
  ui: PropTypes.object,
  initialSchema: PropTypes.object,
  onShowWarning: PropTypes.func,
  onGetLocator: PropTypes.func,
  onGetReceipts: PropTypes.func,
  onGetInitMaster: PropTypes.func,
};

PXKDieuChinhPage.defaultProps = {
  initialSchema: {},
};

const withSaga = injectSaga({ key: 'pxkDieuChinh', saga });
const withReducer = injectReducer({ key: 'pxkDieuChinh', reducer });

export const mapStateToProps = createStructuredSelector({
  initialSchema: makeSelectFormSearch(),
});

export const mapDispatchToProps = dispatch => ({
  onShowWarning: message => dispatch(showWarning(message)),
  onGetLocator: params => dispatch(locatorRoutine.request({ params })),
  onGetReceipts: params => dispatch(receiptsRoutine.request({ params })),
  onGetInitMaster: callback => dispatch(masterRoutine.request({ callback })),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withStyles(styles),
  withSaga,
  withReducer,
  withConnect,
  withImmutablePropsToJS,
)(PXKDieuChinhPage);
