import React from 'react';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import { Field } from 'formik';
import InputControl from 'components/InputControl';
import Expansion from 'components/Expansion';
import SelectAutocomplete from 'components/SelectAutocomplete';
import PropTypes from 'prop-types';
import { TYPE_FORM } from './constants';

// eslint-disable-next-line react/prop-types
const SpacingTop = ({ className }) => <div className={className} />;
const StyledSpacingTop = styled(SpacingTop)`
  ${({ theme }) => `margin-top: ${theme.spacing.unit * 2}px`};
`;

// eslint-disable-next-line react/prefer-stateless-function
class Section2 extends React.PureComponent {
  render() {
    const { formOption, onChangeForm, form, formik } = this.props;

    return (
      <div>
        <Expansion
          title="II. Thông Tin Đơn Vị Kiểm Kê"
          content={
            <Grid container spacing={24}>
              <Grid item md={3} xs={6}>
                <Field
                  name="plantName"
                  label="Farm/NSC"
                  component={InputControl}
                  required
                  disabled
                />
              </Grid>
              <Grid item md={3} xs={6}>
                <Field
                  name="plantCode"
                  label="Mã Farm/NSC"
                  component={InputControl}
                  required
                  disabled
                />
              </Grid>
              <Grid item md={3} xs={6}>
                <Field
                  name="delegateId"
                  label="Đại Diện KK"
                  disabled={
                    form === TYPE_FORM.CANCEL || form === TYPE_FORM.VIEW
                  }
                  component={SelectAutocomplete}
                  placeholder="Lựa Chọn Đại Diện KK"
                  required
                  options={formOption.users}
                  onChangeSelectAutoComplete={selected => {
                    onChangeForm({
                      field: 'reason',
                      value: formik.values.reason,
                    });
                    onChangeForm({
                      field: 'note',
                      value: formik.values.note,
                    });
                    onChangeForm({
                      field: 'delegateId',
                      value: selected,
                    });
                  }}
                />
              </Grid>
              <Grid item md={3} xs={6}>
                <Field
                  name="phoneNumber"
                  label="Điện Thoại"
                  component={InputControl}
                  disabled
                />
              </Grid>
            </Grid>
          }
        />
        <StyledSpacingTop />
      </div>
    );
  }
}

Section2.propTypes = {
  formOption: PropTypes.object,
  formik: PropTypes.object,
  onChangeForm: PropTypes.func,
  form: PropTypes.string,
};
export default Section2;
