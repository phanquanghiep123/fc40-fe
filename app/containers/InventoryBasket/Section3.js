import React from 'react';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import Expansion from 'components/Expansion';
import MuiButton from 'components/MuiButton';
import FormData from 'components/FormikUI/FormData';
import PropTypes from 'prop-types';
import PinnedRowRenderer from 'components/FormikUI/PinnedRowRenderer';
import { getRowStyle, orderNumberRenderer } from 'utils/index';
import DatePickerControl from 'components/DatePickerControl';
import { Field } from 'formik';
import MuiSelectInputEditor from 'components/MuiSelect/InputEditor';
import MuiInputEditor from 'components/MuiInput/Editor';
import CellRenderer from 'components/FormikUI/CellRenderer';
import ActionRenderSection3 from './ActionRenderSection3';
import { TYPE_FORM } from './constants';
import appTheme from '../App/theme';

// eslint-disable-next-line react/prop-types
const SpacingTop = ({ className }) => <div className={className} />;
const StyledSpacingTop = styled(SpacingTop)`
  ${({ theme }) => `margin-top: ${theme.spacing.unit * 2}px`};
`;

export const defaultColDef = {
  valueSetter: params => {
    if (params.colDef.field === 'userName') {
      return false;
    }
    params.context.props.onChangeForm({
      field: 'reason',
      value: params.context.props.formik.values.reason,
    });
    params.context.props.onChangeForm({
      field: 'note',
      value: params.context.props.formik.values.note,
    });
    const updaterData = {
      ...params.data,
      [params.colDef.field]: params.newValue,
    };
    params.context.props.onUpdateDetailsCommand(
      {
        field: 'infoImplementStocktaking',
        index: params.node.rowIndex,
        data: updaterData,
      },
      'infoImplementStocktaking',
    );

    return true;
  },
  suppressMovable: true,
};

class Section3 extends React.PureComponent {
  onGridReady = params => {
    this.gridApi = params.api;
  };

  onNewColumnsLoaded = () => {
    if (this.gridApi) {
      this.gridApi.sizeColumnsToFit();
    }
  };

  checEditable = params => {
    if (
      params.context.props.form === TYPE_FORM.VIEW ||
      params.context.props.form === TYPE_FORM.CANCEL
    ) {
      return false;
    }
    if (params.data.userName) {
      return true;
    }
    return false;
  };

  getColumnDefs = [
    {
      headerName: 'STT',
      field: 'index',
      width: 40,
      cellRendererFramework: orderNumberRenderer,
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
    },
    {
      headerName: 'Người Kiểm Kê',
      headerClass: 'ag-header-required',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      field: 'userName',
      tooltipField: 'userName',
      cellEditorFramework: MuiSelectInputEditor,
      editable: params => {
        if (
          params.context.props.form === TYPE_FORM.VIEW ||
          params.context.props.form === TYPE_FORM.CANCEL
        ) {
          return false;
        }
        return true;
      },
      cellRendererFramework: CellRenderer,
      cellEditorParams: ({ context, rowIndex }) => ({
        options: context.props.formOption.users,
        valueKey: 'value',
        labelKey: 'label',
        sublabelKey: null,
        isSearchable: true,
        onChange: option => {
          let data = {};
          if (option) {
            const arrDuplicate = [];
            context.props.section3.forEach(item => {
              if (item.userId === option.value) {
                arrDuplicate.push(item);
              }
            });
            this.props.onChangeForm({
              field: 'reason',
              value: this.props.formik.values.reason,
            });
            this.props.onChangeForm({
              field: 'note',
              value: this.props.formik.values.note,
            });
            if (arrDuplicate.length > 0) {
              this.props.onShowWarning('Người Kiểm Kê không được phép trùng');
              return false;
            }
            data = {
              userName: option.label,
              userId: option.value,
              phoneNumber: option.phoneNumber,
              position: context.props.section3[rowIndex].position,
            };
            context.props.onChangeField({ rowIndex, data }, 'userName');
          }
          context.props.onChangeField({ rowIndex, data }, 'userName');
          return true;
        },
      }),
      cellStyle: params => {
        if (
          params.context.props.form === TYPE_FORM.VIEW ||
          params.context.props.form === TYPE_FORM.CANCEL
        ) {
          return { background: 'inherit' };
        }
        return { background: appTheme.palette.background.default };
      },
    },
    {
      headerName: 'Số Điện Thoại',
      field: 'phoneNumber',
      tooltipField: 'phoneNumber',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
    },
    {
      headerName: 'Chức Danh',
      field: 'position',
      tooltipField: 'position',
      cellEditorFramework: MuiInputEditor,
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      editable: params => this.checEditable(params),
      cellStyle: params => {
        if (
          params.context.props.form === TYPE_FORM.VIEW ||
          params.context.props.form === TYPE_FORM.CANCEL
        ) {
          return { background: 'inherit' };
        }
        return { background: appTheme.palette.background.default };
      },
    },
    {
      headerName: '',
      field: 'actions',
      width: 50,
      cellClass: 'cell-action-butons',
      cellRendererFramework: ActionRenderSection3,
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
    },
  ];

  render() {
    const {
      classes,
      formik,
      section3,
      addUser,
      form,
      onChangeForm,
    } = this.props;
    const enable = () => {
      if (form === TYPE_FORM.VIEW || form === TYPE_FORM.CANCEL) {
        return true;
      }
      return false;
    };
    if (enable()) {
      this.getColumnDefs.pop();
    }
    return (
      <div>
        <Grid item xs={12}>
          <Expansion
            title="III. Thông Tin Bên Thực Hiện Kiểm Kê"
            rightActions={
              !enable() ? (
                <Grid
                  container
                  justify="flex-end"
                  alignItems="center"
                  spacing={24}
                >
                  <Grid item>
                    <div className={classes.topToolbarPart}>
                      <MuiButton
                        icon="note_add"
                        outline
                        onClick={() => {
                          onChangeForm({
                            field: 'note',
                            value: formik.values.note,
                          });
                          onChangeForm({
                            field: 'reason',
                            value: formik.values.reason,
                          });
                          addUser();
                        }}
                      />
                    </div>
                  </Grid>
                </Grid>
              ) : (
                ''
              )
            }
            content={
              <React.Fragment>
                <Grid container spacing={24}>
                  <Grid item md={3} xs={6}>
                    <Field
                      name="date"
                      label="Thời Gian Thực Hiện"
                      component={DatePickerControl}
                      isdatetimepicker="true"
                      format="dd/MM/yyyy HH:mm:ss"
                      required
                      disabled
                    />
                  </Grid>
                </Grid>
                <StyledSpacingTop />
                <FormData
                  name="infoImplementStocktaking"
                  idGrid="section3"
                  rowData={section3}
                  gridStyle={{ height: 'auto' }}
                  columnDefs={this.getColumnDefs}
                  defaultColDef={defaultColDef}
                  setFieldValue={formik.setFieldValue}
                  setFieldTouched={formik.setFieldTouched}
                  errors={formik.errors}
                  touched={formik.touched}
                  autoLayout
                  ignoreSuppressColumns={['userName']}
                  gridProps={{
                    context: this,
                    suppressScrollOnNewData: true,
                    suppressHorizontalScroll: true,
                    frameworkComponents: {
                      customPinnedRowRenderer: PinnedRowRenderer,
                    },
                    domLayout: 'autoHeight',
                    onNewColumnsLoaded: this.onNewColumnsLoaded,
                    getRowStyle,
                  }}
                  {...formik}
                  onGridReady={this.onGridReady}
                />
              </React.Fragment>
            }
          />
        </Grid>
        <StyledSpacingTop />
      </div>
    );
  }
}

Section3.propTypes = {
  classes: PropTypes.object,
  formik: PropTypes.object,
  section3: PropTypes.array,
  addUser: PropTypes.func,
  onChangeForm: PropTypes.func,
  formOption: PropTypes.object,
  form: PropTypes.string,
};
export default Section3;
