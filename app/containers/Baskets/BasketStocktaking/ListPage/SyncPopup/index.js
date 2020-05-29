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
import DatePickerControl from 'components/DatePickerControl';
import SelectAutocomplete from '../../../../../components/SelectAutocomplete';

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
    const {
      classes,
      orgListStocktaking,
      onClose,
      onSyncReportData,
    } = this.props;
    return (
      <Formik
        enableReinitialize
        initialValues={{
          dateFrom: new Date(),
          plantCode: '',
        }}
        validate={values => {
          const { dateFrom } = values;
          const date = new Date();
          const errors = {};
          if (!dateFrom) {
            errors.dateFrom = 'Trường bắt buộc';
          } else if (dateFrom > date) {
            errors.dateFrom = 'Chọn ngày nhỏ hơn hoặc bằng ngày hiện tại';
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
            <DialogTitle>Đồng bộ dữ liệu</DialogTitle>
            <DialogContent>
              <Form>
                <PaperPanel>
                  <Field
                    name="plantCode"
                    label="Đơn vị"
                    component={SelectAutocomplete}
                    placeholder="Tất Cả"
                    value={pr.values.plantCode}
                    options={orgListStocktaking}
                    maxMenuHeight={150}
                    isMulti
                    isMultiline
                  />
                  <Field
                    name="dateFrom"
                    label="Ngày Xử Lý"
                    required
                    component={DatePickerControl}
                    value={pr.values.dateFrom}
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
  classes: PropTypes.any,
  onSyncReportData: PropTypes.func,
  orgListStocktaking: PropTypes.any,
};

export default compose(withStyles(style()))(SyncPopup);
