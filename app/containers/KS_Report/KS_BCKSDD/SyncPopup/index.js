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
import { calcDateGap } from '../../../App/utils';
import PeriodPicker from '../../../../components/PeriodPicker';
import SelectAutocomplete from '../../../../components/SelectAutocomplete';

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
    const { classes, plants, onClose, onSyncReportData } = this.props;
    return (
      <Formik
        enableReinitialize
        initialValues={{
          dateFrom: new Date(),
          dateTo: new Date(),
          plantCode: '',
        }}
        validate={values => {
          const { dateFrom, dateTo } = values;
          const errors = {};

          // if (!plantCode) {
          //   errors.plantCode = 'Trường bắt buộc';
          // }

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
                    name="plantCode"
                    label="Đơn vị"
                    component={SelectAutocomplete}
                    placeholder="Tất Cả"
                    value={pr.values.plantCode}
                    options={plants}
                    maxMenuHeight={150}
                    isMulti
                    isMultiline
                  />
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
              <DialogActions>
                <div
                  className={classes.btnContainer}
                  style={{ marginBottom: 0 }}
                >
                  <MuiButton
                    onClick={pr.handleSubmit}
                    disabled={pr.isSubmitting}
                  >
                    Đồng bộ
                  </MuiButton>
                  <MuiButton outline onClick={onClose}>
                    Đóng
                  </MuiButton>
                </div>
              </DialogActions>
            </DialogContent>
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
  plants: PropTypes.array,
};

export default compose(withStyles(style()))(SyncPopup);
