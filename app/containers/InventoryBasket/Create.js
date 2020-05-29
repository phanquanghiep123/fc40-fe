import React from 'react';
import { Form, Field } from 'formik';
import Grid from '@material-ui/core/Grid';
import MuiButton from 'components/MuiButton';
import CompleteButton from 'components/Button/ButtonComplete';
import PropTypes from 'prop-types';
import InputControl from 'components/InputControl';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import SelectAutocomplete from 'components/SelectAutocomplete';
import Section1 from './Section1';
import Section2 from './Section2';
import Section3 from './Section3';
import Section4 from './Section4';
import Section5 from './Section5';
import Section6 from './Section6';
import Section7 from './Section7';
import { BTN_SUBMIT, TYPE_FORM } from './constants';

// eslint-disable-next-line react/prop-types
const SpacingTop = ({ className }) => <div className={className} />;
const StyledSpacingTop = styled(SpacingTop)`
  ${({ theme }) => `margin-top: ${theme.spacing.unit * 2}px`};
`;

export default class Create extends React.PureComponent {
  isCreate = () => true;

  isEdit = () => false;

  isView = () => false;

  isCancel = () => false;

  render() {
    const {
      classes,
      history,
      formOption,
      onChangePlant,
      onGetLocator,
      onGetSection5,
      form,
      showConfirm,
      onGetSection4,
      formData,
      onSubmit,
      formik,
      onChangeForm,
    } = this.props;
    const enableHeading = () => {
      let title = 'Hủy';
      if (form === TYPE_FORM.CREATE) {
        title = 'Tạo Mới';
      }
      if (form === TYPE_FORM.EDIT) {
        title = 'Chỉnh Sửa';
      }
      if (form === TYPE_FORM.VIEW) {
        title = 'Xem';
      }
      return `${title} Biên Bản Kiểm Kê Khay Sọt`;
    };
    return (
      <Form>
        <Grid container justify="space-between">
          <Grid item xl={8} lg={8} className={classes.titleHeading}>
            <Typography variant="h5" gutterBottom>
              {enableHeading()}
            </Typography>
          </Grid>
          {form === TYPE_FORM.CREATE ? (
            <Grid item xl={4} lg={4}>
              <Grid container justify="space-between">
                <Grid
                  item
                  xl={6}
                  lg={6}
                  md={6}
                  xs={6}
                  className={classes.unitLeft}
                >
                  <Field
                    name="doWorkingUnitCode"
                    label="Đơn Vị"
                    component={SelectAutocomplete}
                    onChangeSelectAutoComplete={data => {
                      showConfirm({
                        title: 'Xác nhận thay đổi Đơn Vị',
                        message:
                          'Nếu bạn thay đổi Đơn Vị thì thông tin vừa nhập sẽ không được lưu! Bạn vẫn muốn thay đổi?',
                        actions: [
                          {
                            text: 'Hủy',
                            color: 'primary',
                          },
                          {
                            text: 'Đồng ý',
                            color: 'primary',
                            onClick: () => {
                              const region = formOption.plants.filter(
                                item => item.value === data.value,
                              );
                              const mainData = {
                                value: data.value,
                                label: data.label,
                                regionName: region[0].regionName,
                              };
                              onChangePlant(mainData);
                              onGetLocator({ plantCode: data.value });
                              onGetSection4({ plantCode: data.value });
                              onGetSection5(data.value);
                              onChangeForm({
                                field: 'reason',
                                value: formik.values.reason,
                              });
                              onChangeForm({
                                field: 'note',
                                value: formik.values.note,
                              });
                            },
                          },
                        ],
                      });
                    }}
                    required
                    isClearable={false}
                    options={formOption.plants}
                  />
                </Grid>
                <Grid
                  item
                  xl={6}
                  lg={6}
                  md={6}
                  xs={6}
                  className={classes.unitRight}
                >
                  <Field
                    name="regionName"
                    label="Vùng Miền"
                    component={InputControl}
                    disabled
                  />
                </Grid>
              </Grid>
            </Grid>
          ) : (
            ''
          )}
        </Grid>
        <StyledSpacingTop />

        <Section1 {...this.props} />
        <Section2 {...this.props} />
        <Section3 {...this.props} />
        <Section4 {...this.props} />
        <Section5 {...this.props} />
        <Section6 {...this.props} />
        <Section7 {...this.props} />

        <Grid
          className={classes.spacing}
          container
          spacing={24}
          justify="flex-end"
        >
          <Grid item>
            <MuiButton outline onClick={() => history.goBack()}>
              Quay Lại
            </MuiButton>
          </Grid>
          {this.isCancel() && (
            <Grid item>
              <MuiButton
                className={classes.btnCancel}
                type="submit"
                onClick={() => {
                  onSubmit(BTN_SUBMIT.CANCEL);
                }}
              >
                Hủy Kết Quả
              </MuiButton>
            </Grid>
          )}
          {this.isCreate() || (this.isEdit() && formData.status !== 2) ? (
            <Grid item>
              <MuiButton
                type="submit"
                onClick={() => {
                  onSubmit(BTN_SUBMIT.SAVE);
                }}
              >
                Lưu
              </MuiButton>
            </Grid>
          ) : (
            ''
          )}
          {this.isCreate() || this.isEdit() ? (
            <Grid item>
              <CompleteButton
                type="submit"
                text="Hoàn Thành"
                onClick={() => {
                  onSubmit(BTN_SUBMIT.COMPLETE);
                }}
              />
            </Grid>
          ) : (
            ''
          )}
        </Grid>
      </Form>
    );
  }
}

Create.propTypes = {
  history: PropTypes.object,
  formik: PropTypes.object,
  formData: PropTypes.object,
  onSubmit: PropTypes.func,
  confirmRemoveRecord: PropTypes.func,
  onGetLocator: PropTypes.func,
  onGetSection4: PropTypes.func,
  onGetSection5: PropTypes.func,
  showConfirm: PropTypes.func,
  id: PropTypes.string,
};
