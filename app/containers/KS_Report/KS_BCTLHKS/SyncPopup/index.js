/* eslint-disable react/no-array-index-key */
import MuiButton from 'components/MuiButton';
import { compose } from 'redux';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { withStyles, DialogActions } from '@material-ui/core';
import React from 'react';
import { Form, Field, Formik } from 'formik';
import PropTypes from 'prop-types';
import PaperPanel from 'components/PaperPanel';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import { calcDateGap } from '../../../App/utils';
import PeriodPicker from '../../../../components/PeriodPicker';
import * as selectors from '../selectors';

const style = () => ({
  btnContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '1rem',
    '& > *': {
      minWidth: 120,
      '&:not(:last-child)': {
        marginRight: '1rem',
      },
    },
  },
  causeFieldContainer: {
    display: 'flex',
    width: 300,
    marginRight: '1rem',
    '& > div': {
      marginBottom: '0 !important',
    },
  },
  fontBold: {
    fontWeight: 'bold',
  },
  centerAlign: {
    display: 'flex',
    justifyContent: 'center',
  },
});

class SyncPopup extends React.Component {
  componentDidMount() {}

  render() {
    const { classes, onClose, onSyncReportData, initValues } = this.props;

    return (
      <Formik
        enableReinitialize
        initialValues={initValues}
        validate={values => {
          const { dateFrom, dateTo } = values;
          const errors = {};
          if (!dateFrom || !dateTo) {
            errors.datePeriod = 'Trường bắt buộc';
          } else {
            const dateGap = calcDateGap(dateFrom, dateTo);

            if (dateGap < 0) {
              errors.datePeriod =
                'Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc';
            }
          }

          return errors;
        }}
        onSubmit={(values, formikActions) => {
          formikActions.setSubmitting(true);
          onSyncReportData(values);
          formikActions.setSubmitting(false);
        }}
        render={pr => (
          <div>
            <DialogTitle>Đồng bộ dữ liệu cưỡng chế</DialogTitle>
            <DialogContent>
              <Form>
                <PaperPanel>
                  <Field
                    name="datePeriod"
                    label="Thời gian đồng bộ (từ - đến):"
                    component={PeriodPicker}
                    from={{
                      name: 'dateFrom',
                      value: pr.values.dateFrom,
                    }}
                    to={{
                      name: 'dateTo',
                      value: pr.values.dateTo,
                    }}
                  />
                </PaperPanel>
              </Form>
            </DialogContent>
            <DialogActions>
              <div className={classes.btnContainer} style={{ marginBottom: 0 }}>
                <MuiButton onClick={pr.handleSubmit} disabled={pr.isSubmitting}>
                  Đồng bộ
                </MuiButton>
                <MuiButton outline onClick={onClose}>
                  Đóng
                </MuiButton>
              </div>
            </DialogActions>
          </div>
        )}
      />
    );
  }
}
SyncPopup.propTypes = {
  onClose: PropTypes.func,
  classes: PropTypes.object,
  onSyncReportData: PropTypes.func,
  initValues: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  initValues: selectors.popupInit(),
});

const withConnect = connect(
  mapStateToProps,
  null,
);

export default compose(
  withConnect,
  withImmutablePropsToJS,
  withStyles(style()),
)(SyncPopup);
