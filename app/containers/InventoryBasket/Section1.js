import React from 'react';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import { Field } from 'formik';
import InputControl from 'components/InputControl';
import Expansion from 'components/Expansion';
import DatePickerControl from 'components/DatePickerControl';
import SelectAutocomplete from 'components/SelectAutocomplete';
import PropTypes from 'prop-types';
import { MenuItem } from '@material-ui/core';
import MuiButton from 'components/MuiButton';
import SelectControl from '../../components/SelectControl';
import { TYPE_FORM } from './constants';

// eslint-disable-next-line react/prop-types
const SpacingTop = ({ className }) => <div className={className} />;
const StyledSpacingTop = styled(SpacingTop)`
  ${({ theme }) => `margin-top: ${theme.spacing.unit * 2}px`};
`;
// eslint-disable-next-line react/prefer-stateless-function
class Section1 extends React.PureComponent {
  render() {
    const { formOption, onChangeForm, form, formik, onPrint } = this.props;
    const enable = () => {
      if (form === TYPE_FORM.VIEW || form === TYPE_FORM.CANCEL) {
        return true;
      }
      return false;
    };
    return (
      <div>
        <Expansion
          title="I. Thông Tin Biên Bản"
          rightActions={
            form === TYPE_FORM.VIEW ? (
              <Grid
                container
                justify="flex-end"
                alignItems="center"
                spacing={24}
              >
                <Grid item>
                  <MuiButton
                    type="submit"
                    onClick={() => {
                      onPrint();
                    }}
                  >
                    in BBKK
                  </MuiButton>
                </Grid>
              </Grid>
            ) : (
              ''
            )
          }
          content={
            <Grid container spacing={24}>
              <Grid item md={3} xs={6}>
                {form !== TYPE_FORM.CREATE && (
                  <React.Fragment>
                    <Field
                      name="basketStocktakingCode"
                      label="Mã BBKK"
                      component={InputControl}
                      disabled
                    />
                    <Field
                      name="statusName"
                      label="Trạng Thái"
                      component={InputControl}
                      disabled
                    />
                  </React.Fragment>
                )}

                <Field
                  label="Loại KK"
                  name="stocktakingType"
                  component={SelectControl}
                  disabled={enable()}
                  onChange={(e, selected) => {
                    const mainData = {
                      value: selected.props.value,
                      label: selected.props.children,
                    };
                    onChangeForm({
                      field: 'stocktakingType',
                      value: mainData,
                    });
                    onChangeForm({
                      field: 'reason',
                      value: formik.values.reason,
                    });
                    onChangeForm({
                      field: 'note',
                      value: formik.values.note,
                    });
                  }}
                >
                  {formOption.stocktakingType.map((item, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <MenuItem key={i} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Field>
              </Grid>
              <Grid item md={3} xs={6}>
                <Field
                  name="stocktakingRound"
                  label="Đợt KK"
                  component={InputControl}
                  disabled
                />
                <Field
                  name="createDate"
                  label="Thời Gian Tạo BB"
                  component={DatePickerControl}
                  isdatetimepicker="true"
                  format="dd/MM/yyyy HH:mm:ss"
                  required
                  disabled
                />
              </Grid>
              <Grid item md={3} xs={6}>
                <Field
                  name="userId"
                  label="Người Tạo BB"
                  component={SelectAutocomplete}
                  placeholder="Lựa Chọn Người Tạo BB"
                  required
                  disabled
                  options={formOption.users}
                  onChangeSelectAutoComplete={selected => {
                    onChangeForm({
                      field: 'userId',
                      value: selected,
                    });
                  }}
                />
                {formik.values.stocktakingType === 4 && (
                  <Field
                    name="reason"
                    label="Lí Do"
                    disabled={enable()}
                    component={InputControl}
                    multiline
                    onChange={reason => {
                      formik.handleChange(reason);
                    }}
                  />
                )}
                {formik.values.stocktakingType !== 4 && (
                  <Field
                    name="reason"
                    label="Lí Do"
                    disabled={enable()}
                    component={InputControl}
                    multiline
                    onChange={reason => {
                      formik.handleChange(reason);
                    }}
                  />
                )}
              </Grid>
              <Grid item md={3} xs={6}>
                <Field
                  name="plantUnitCode"
                  disabled
                  label="Đơn Vị Tạo BB"
                  component={SelectAutocomplete}
                  placeholder="Lựa Chọn Đơn Vị Tạo BB"
                  required
                  options={formOption.plants}
                  onChangeSelectAutoComplete={selected => {
                    onChangeForm({
                      field: 'plantUnitCode',
                      value: selected,
                    });
                  }}
                />
                <Field
                  name="note"
                  disabled={form === TYPE_FORM.VIEW}
                  label="Ghi Chú"
                  component={InputControl}
                  multiline
                  onChange={note => {
                    formik.handleChange(note);
                  }}
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

Section1.propTypes = {
  formOption: PropTypes.object,
  formik: PropTypes.object,
  form: PropTypes.string,
  onChangeForm: PropTypes.func,
  onPrint: PropTypes.func,
};
export default Section1;
