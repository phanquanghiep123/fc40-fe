/* eslint-disable indent */
import React from 'react';
import * as PropTypes from 'prop-types';

import { getIn } from 'formik';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import TimeInput from 'react-time-input';

import { withStyles } from '@material-ui/core/styles';

import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

import FormData from 'components/FormikUI/FormData';

import Expansion from 'components/Expansion';

import MuiInputEditor from 'components/MuiInput/Editor';
import MuiSelectEditor from 'components/MuiSelect/Editor';
import MuiSelectInputEditor from 'components/MuiSelect/InputEditor';

import NumberFormatter from 'components/NumberFormatter';
import { validDecimal } from 'components/NumberFormatter/utils';

import SelectRenderer from 'components/FormikUI/SelectRenderer';
import CheckboxRenderer from 'components/FormikUI/CheckboxRenderer';
// import CellRenderer from '../../../../components/FormikUI/CellRenderer';

// CR #9150
import { withRouter } from 'react-router-dom';
import CustomCellRenderer from './CustomCellRenderer';
import CustomSelectRenderer from './CustomSelectRenderer';

import { getShipperAuto } from '../actions';
import { makeSelectData } from '../selectors';

import {
  addHours,
  formatTime,
  greaterTime,
  numberParser,
  timeFormatter,
} from '../utils';

import { TYPE_FORM, TYPE_LEADTIME } from '../constants';

export const styles = theme => ({
  tabs: {
    padding: 16,
  },
  tab: {
    minWidth: 100,
    minHeight: 36,
    textTransform: 'capitalize',
  },
  tabLabel: {
    [theme.breakpoints.up('md')]: {
      padding: '6px 12px',
    },
  },
  indicator: {
    height: '100%',
    borderRadius: 999,
  },
  indicatorColor: {
    backgroundColor: 'rgba(71, 111, 144, 0.2)',
  },
});

const SECTION_6 = 'deliveryReceiptTransports';
class Section6 extends React.Component {
  state = {
    tabIndex: 0,
  };

  gridApi = null;

  formData = null;

  driverInput = '';

  columnDefsFor1 = [
    {
      headerName: 'STT',
      field: 'stt',
      width: 40,
      editable: false,
      suppressSizeToFit: true,
    },
    {
      headerName: 'Bên Vận Chuyển',
      field: 'transporterCode',
      cellEditorFramework: MuiSelectInputEditor,
      cellRendererFramework: SelectRenderer,
      cellEditorParams: ({ rowIndex, data }) => ({
        options: this.props.shippers,
        valueKey: 'transporterCode',
        labelKey: 'fullName',
        isClearable:
          !this.props.match ||
          !this.props.match.params.id ||
          !data.transporterCodeLoadedFromServer,
        SelectProps: {
          menuPosition: 'fixed',
        },
        onChange: option => this.onTransporterChange(rowIndex, option),
      }),
    },
    {
      headerName: 'Lái Xe',
      field: 'driver',
      editable: props => !!props.data.transporterCode,
      headerClass: 'ag-header-required',
      tooltipField: 'driver',
      cellEditorFramework: MuiSelectEditor,
      cellRendererFramework: CustomCellRenderer,
      cellEditorParams: ({ rowIndex }) => ({
        valueKey: 'label',
        labelKey: 'label',
        isClearable: true,
        isMultiline: false,
        defaultOptions: false,
        promiseOptions: this.props.onGetShipperAuto,
        onChange: option => this.onDriverChange(rowIndex, option),
        onInputChange: (inputValue, action) =>
          this.onDriverInputChange(rowIndex, inputValue, action),
      }),
    },
    {
      headerName: 'Điện Thoại',
      field: 'phone',
      editable: props => !!props.data.transporterCode,
      tooltipField: 'phone',
      cellEditorFramework: MuiInputEditor,
      cellRendererFramework: CustomCellRenderer,
    },
    {
      headerName: 'Biển Số Xe',
      field: 'drivingPlate',
      editable: props => !!props.data.transporterCode,
      headerClass: 'ag-header-required',
      tooltipField: 'drivingPlate',
      cellEditorFramework: MuiInputEditor,
      cellRendererFramework: CustomCellRenderer,
    },
    {
      headerName: 'Tải Trọng Xe (Tấn)',
      field: 'vehicleWeight',
      editable: props => !!props.data.transporterCode,
      headerClass: 'ag-header-required',
      cellEditorFramework: MuiInputEditor,
      cellRendererFramework: CustomCellRenderer,
      cellEditorParams: {
        InputProps: {
          inputComponent: NumberFormatter,
          inputProps: {
            isAllowed: validDecimal,
          },
        },
      },
    },
    {
      headerName: 'Leadtime Phát Sinh',
      field: 'unregulatedLeadtime',
      editable: false,
      headerClass: 'ag-header-required',
      cellRendererFramework: CheckboxRenderer,
      cellRendererParams: ({ rowIndex, data }) => ({
        disabled:
          !data.transporterCode || this.props.formik.status === TYPE_FORM.VIEW,
        onChange: isChecked => this.onLeadtimeChange(rowIndex, isChecked),
      }),
    },
    {
      headerName: 'Giờ Xuất Phát Quy Định',
      field: 'regulatedDepartureDate',
      editable: props => !!props.data.transporterCode,
      headerClass: 'ag-header-required',
      valueFormatter: timeFormatter,
      cellRendererFramework: CustomCellRenderer,
      cellEditorSelector: ({ data, value, colDef, rowIndex }) => {
        if (data.unregulatedLeadtime) {
          return {
            component: 'muiInputEditor',
            params: {
              InputProps: {
                inputComponent: TimeInput,
                inputProps: {
                  initTime: formatTime(value),
                  mountFocus: true,
                  placeholder: '--:--',
                  onTimeChange: inputTime =>
                    this.onDepartureDateChange(
                      rowIndex,
                      colDef.field,
                      inputTime,
                    ),
                },
              },
            },
          };
        }

        return {
          component: 'muiInputEditor',
          params: {
            select: true,
            options: this.props.leadtime,
            valueKey: 'regulatedDepartureHour',
            labelKey: 'regulatedDepartureHour',
            onChange: option =>
              this.onRegulatedDepartureChange(rowIndex, option),
          },
        };
      },
    },
    {
      headerName: 'Giờ Xuất Phát Thực Tế',
      field: 'actualDepartureDate',
      editable: props => !!props.data.transporterCode,
      headerClass: 'ag-header-required',
      valueFormatter: timeFormatter,
      cellEditorFramework: MuiInputEditor,
      cellRendererFramework: CustomCellRenderer,
      cellEditorParams: ({ value, colDef, rowIndex }) => ({
        InputProps: {
          inputComponent: TimeInput,
          inputProps: {
            initTime: formatTime(value),
            mountFocus: true,
            placeholder: '--:--',
            onTimeChange: inputTime =>
              this.onDepartureDateChange(rowIndex, colDef.field, inputTime),
          },
        },
      }),
    },
    {
      headerName: 'TG Di Chuyển (Giờ)',
      field: 'drivingDuration',
      editable: props => !!props.data.transporterCode,
      headerClass: 'ag-header-required',
      valueParser: numberParser,
      cellEditorFramework: MuiInputEditor,
      cellRendererFramework: CustomCellRenderer,
      cellEditorParams: {
        InputProps: {
          inputComponent: NumberFormatter,
          inputProps: {
            isAllowed: value => {
              if (validDecimal(value, 1)) {
                if (value.floatValue > 1000) {
                  return false;
                }
                return true;
              }
              return false;
            },
          },
        },
      },
    },
    {
      headerName: 'Giờ Đến Theo Quy Định',
      editable: false,
      cellRendererFramework: CustomCellRenderer,
      valueGetter: ({ data }) => {
        if (data && data.regulatedDepartureDate) {
          return formatTime(
            addHours(data.regulatedDepartureDate, data.drivingDuration),
          );
        }
        return '';
      },
    },
    {
      headerName: 'Giờ Dự Kiến Đến',
      editable: false,
      cellRendererFramework: CustomCellRenderer,
      valueGetter: ({ data }) => {
        if (data && data.actualDepartureDate) {
          return formatTime(
            addHours(data.actualDepartureDate, data.drivingDuration),
          );
        }
        return '';
      },
    },
    {
      headerName: 'Vận Chuyển Theo Leadtime Xuất Hàng',
      field: 'shippingLeadtimeExport',
      editable: false,
      headerClass: 'ag-header-required',
      cellEditorFramework: MuiInputEditor,
      cellRendererFramework: CustomSelectRenderer,
      cellEditorParams: () => ({
        select: true,
        options: this.props.shippingLeadtime,
        valueKey: 'id',
        labelKey: 'name',
      }),
    },
    {
      headerName: 'Nguyên Nhân',
      field: 'shippingLeadtimeExportReason',
      editable: props => !!props.data.transporterCode,
      cellEditorFramework: MuiInputEditor,
      cellRendererFramework: CustomSelectRenderer,
      cellEditorParams: () => ({
        select: true,
        options: this.props.shippingLeadtimeExportReasons,
        valueKey: 'id',
        labelKey: 'name',
      }),
    },
    {
      headerName: 'Loại Xe Tuyến',
      field: 'vehicleRouteType',
      editable: props => !!props.data.transporterCode,
      headerClass: 'ag-header-required',
      valueParser: numberParser,
      cellEditorFramework: MuiInputEditor,
      cellRendererFramework: CustomSelectRenderer,
      cellEditorParams: () => ({
        select: true,
        options: this.props.vehicleRoutes,
        valueKey: 'vehicleRouteCode',
        labelKey: 'vehicleType',
      }),
    },
    {
      headerName: 'Nhiệt Độ Lúc Load Hàng',
      field: 'loadTemperature',
      editable: props => !!props.data.transporterCode,
      headerClass: 'ag-header-required',
      valueParser: numberParser,
      cellEditorFramework: MuiInputEditor,
      cellRendererFramework: CustomCellRenderer,
      cellEditorParams: {
        InputProps: {
          inputComponent: NumberFormatter,
          inputProps: {
            isAllowed: validDecimal,
          },
        },
      },
    },
  ];

  columnDefsFor2 = [
    {
      headerName: 'TG Trả Hàng Xong',
      field: 'deliveryTime',
      editable: props => !!props.data.transporterCode,
      valueFormatter: timeFormatter,
      cellEditorFramework: MuiInputEditor,
      cellRendererFramework: CustomCellRenderer,
      cellEditorParams: ({ value, colDef, rowIndex }) => ({
        InputProps: {
          inputComponent: TimeInput,
          inputProps: {
            initTime: formatTime(value),
            mountFocus: true,
            placeholder: '--:--',
            onTimeChange: inputTime =>
              this.onValueChange(rowIndex, colDef.field, inputTime),
          },
        },
      }),
    },
    {
      headerName: 'TG Nổ Xe Lạnh Trả Hàng',
      field: 'coolingVehicleTime',
      editable: props => !!props.data.transporterCode,
      valueParser: numberParser,
      cellEditorFramework: MuiInputEditor,
      cellRendererFramework: CustomCellRenderer,
      cellEditorParams: {
        InputProps: {
          inputComponent: NumberFormatter,
          inputProps: {
            isAllowed: validDecimal,
          },
        },
      },
    },
    {
      headerName: 'Pallet Lót Sàn Xe',
      field: 'vehiclePallet',
      editable: props => !!props.data.transporterCode,
      cellEditorFramework: MuiInputEditor,
      cellRendererFramework: CustomSelectRenderer,
      cellEditorParams: () => ({
        select: true,
        options: this.props.vehiclePallets,
        valueKey: 'id',
        labelKey: 'name',
      }),
    },
    {
      headerName: 'Giờ Xe Đến Thực Tế',
      field: 'actualArrivalDate',
      editable: props => !!props.data.transporterCode,
      valueFormatter: timeFormatter,
      cellEditorFramework: MuiInputEditor,
      cellRendererFramework: CustomCellRenderer,
      cellEditorParams: ({ value, colDef, rowIndex }) => ({
        InputProps: {
          inputComponent: TimeInput,
          inputProps: {
            initTime: formatTime(value),
            mountFocus: true,
            placeholder: '--:--',
            onTimeChange: inputTime =>
              this.onValueChange(rowIndex, colDef.field, inputTime),
          },
        },
      }),
    },
    {
      headerName: 'Trạng Thái Nhiệt Độ',
      field: 'temperatureStatus',
      editable: props => !!props.data.transporterCode,
      cellEditorFramework: MuiInputEditor,
      cellRendererFramework: CustomSelectRenderer,
      cellEditorParams: () => ({
        select: true,
        options: this.props.temperatureStatus,
        valueKey: 'id',
        labelKey: 'name',
      }),
    },
    {
      headerName: 'Nhiệt Độ Chip 1',
      field: 'chipTemperature1',
      editable: props => !!props.data.transporterCode,
      valueParser: numberParser,
      cellEditorFramework: MuiInputEditor,
      cellRendererFramework: CustomCellRenderer,
      cellEditorParams: {
        InputProps: {
          inputComponent: NumberFormatter,
          inputProps: {
            isAllowed: validDecimal,
          },
        },
      },
    },
    {
      headerName: 'Nhiệt Độ Chip 2',
      field: 'chipTemperature2',
      editable: props => !!props.data.transporterCode,
      valueParser: numberParser,
      cellEditorFramework: MuiInputEditor,
      cellRendererFramework: CustomCellRenderer,
      cellEditorParams: {
        InputProps: {
          inputComponent: NumberFormatter,
          inputProps: {
            isAllowed: validDecimal,
          },
        },
      },
    },
    {
      headerName: 'Trạng Thái Nhiệt Độ Chip',
      field: 'chipTemperatureStatus',
      editable: props => !!props.data.transporterCode,
      cellEditorFramework: MuiInputEditor,
      cellRendererFramework: CustomSelectRenderer,
      cellEditorParams: () => ({
        select: true,
        options: this.props.chipTemperatureStatus,
        valueKey: 'id',
        labelKey: 'name',
      }),
    },
    {
      headerName: 'Vệ Sinh Xe',
      field: 'vehicleCleaning',
      editable: props => !!props.data.transporterCode,
      cellEditorFramework: MuiInputEditor,
      cellRendererFramework: CustomSelectRenderer,
      cellEditorParams: () => ({
        select: true,
        options: this.props.vehicleCleanings,
        valueKey: 'id',
        labelKey: 'name',
      }),
    },
    {
      headerName: 'Vận Chuyển Theo Leadtime',
      field: 'shippingLeadtime',
      editable: props => !!props.data.transporterCode,
      cellEditorFramework: MuiInputEditor,
      cellRendererFramework: CustomSelectRenderer,
      cellEditorParams: () => ({
        select: true,
        options: this.props.shippingLeadtime,
        valueKey: 'id',
        labelKey: 'name',
      }),
    },
    {
      headerName: 'Nguyên Nhân',
      field: 'reason',
      editable: props => !!props.data.transporterCode,
      cellEditorFramework: MuiInputEditor,
      cellRendererFramework: CustomSelectRenderer,
      cellEditorParams: () => ({
        select: true,
        options: this.props.shippingLeadtimeReasons,
        valueKey: 'id',
        labelKey: 'name',
      }),
    },
    {
      headerName: 'Ghi Chú',
      field: 'notes',
      editable: props => !!props.data.transporterCode,
      tooltipField: 'notes',
      cellEditorFramework: MuiInputEditor,
      cellRendererFramework: CustomCellRenderer,
    },
  ];

  defaultColDef = {
    editable: true,
    resizable: false,
    suppressMovable: true,
    cellEditorFramework: undefined,
  };

  getShippingLeadtime(rowIndex, updaterData) {
    const nodeData = getIn(this.props.formik.values, [SECTION_6, rowIndex]);

    if (nodeData) {
      const nextData = {
        ...nodeData,
        ...updaterData,
      };
      if (
        // TG xuất phát thực tế (actualDepartureDate)
        nextData.actualDepartureDate &&
        // TG xuất phát theo qui định (regulatedDepartureDate)
        nextData.regulatedDepartureDate &&
        // actualDepartureDate > regulatedDepartureDate: Không đạt
        greaterTime(
          nextData.actualDepartureDate,
          nextData.regulatedDepartureDate,
        )
      ) {
        return TYPE_LEADTIME.NG;
      }
    }

    return TYPE_LEADTIME.OK;
  }

  onGridReady = params => {
    this.gridApi = params.api;
  };

  onTabsChange = (event, tabIndex) => {
    this.setState({ tabIndex }, () => {
      if (this.gridApi) {
        this.gridApi.sizeColumnsToFit();
      }
      setTimeout(() => {
        if (this.formData) {
          this.formData.resizeHeaders();
        }
      });
    });
  };

  onDriverChange = (rowIndex, option) => {
    if (option) {
      if (option.value) {
        const updaterData = {
          phone: option.value.phone || '',
          driver: option.label,
          drivingPlate: option.value.drivingPlate || '',
          vehicleWeight: option.value.vehicleWeight || '',
        };
        this.props.formik.updateFieldArrayValue(
          SECTION_6,
          rowIndex,
          updaterData,
        );
      }
      this.driverInput = '';
    }
  };

  onValueChange = (rowIndex, fieldName, value) => {
    const updaterData = {
      [fieldName]: value,
    };
    this.props.formik.updateFieldArrayValue(SECTION_6, rowIndex, updaterData);
  };

  onLeadtimeChange = (rowIndex, isChecked) => {
    const updaterData = {
      unregulatedLeadtime: isChecked,
      regulatedDepartureDate: '',
      drivingDuration: '',
    };
    this.props.formik.updateFieldArrayValue(
      'deliveryReceiptTransports',
      rowIndex,
      updaterData,
    );
  };

  onTransporterChange = (rowIndex, option) => {
    const updaterData = {
      transporter: option ? option.fullName : '',
      transporterCode: option ? option.transporterCode : '',
    };
    this.props.formik.updateFieldArrayValue(
      'deliveryReceiptTransports',
      rowIndex,
      updaterData,
    );
  };

  onDriverInputChange = (rowIndex, inputValue, { action }) => {
    if (action === 'input-change') {
      this.driverInput = inputValue;
    }

    if (action === 'input-blur' && this.driverInput) {
      const updaterData = {
        driver: this.driverInput,
      };
      this.driverInput = '';
      this.props.formik.updateFieldArrayValue(SECTION_6, rowIndex, updaterData);
    }
  };

  onDepartureDateChange = (rowIndex, fieldName, inputTime) => {
    const nextData = {
      [fieldName]: inputTime,
    };
    const updaterData = {
      ...nextData,
      shippingLeadtimeExport: this.getShippingLeadtime(rowIndex, nextData),
    };

    this.props.formik.updateFieldArrayValue(SECTION_6, rowIndex, updaterData);
  };

  onRegulatedDepartureChange = (rowIndex, option) => {
    const nextData = {
      regulatedDepartureDate: option.regulatedDepartureHour,
      drivingDuration: option.drivingDuration,
    };
    const updaterData = {
      ...nextData,
      shippingLeadtimeExport: this.getShippingLeadtime(rowIndex, nextData),
    };

    this.props.formik.updateFieldArrayValue(SECTION_6, rowIndex, updaterData);
  };

  render() {
    const { tabIndex } = this.state;
    const { classes, formik } = this.props;

    const initialData = getIn(formik.values, SECTION_6, []);

    const gridStyle = {
      height: 'auto',
    };
    const gridProps = {
      domLayout: 'autoHeight',
      frameworkComponents: {
        muiInputEditor: MuiInputEditor,
      },
    };

    const columnDefs =
      tabIndex === 0 ? this.columnDefsFor1 : this.columnDefsFor2;
    const defaultColDef = {
      ...this.defaultColDef,
      editable: formik.status !== TYPE_FORM.VIEW,
    };

    return (
      <Expansion
        title="VI. Thông Tin Bên Vận Chuyển"
        rightActions={
          <Tabs
            value={tabIndex}
            classes={{
              root: classes.tabs,
            }}
            TabIndicatorProps={{
              classes: {
                root: classes.indicator,
                colorSecondary: classes.indicatorColor,
              },
            }}
            onChange={this.onTabsChange}
          >
            <Tab
              label="Bên Giao"
              disableRipple
              classes={{
                root: classes.tab,
                labelContainer: classes.tabLabel,
              }}
            />
            <Tab
              label="Bên Nhận"
              disableRipple
              classes={{
                root: classes.tab,
                labelContainer: classes.tabLabel,
              }}
            />
          </Tabs>
        }
        content={
          <FormData
            onRef={ref => {
              this.formData = ref;
            }}
            name="deliveryReceiptTransports"
            idGrid="bbgnhh-transports"
            /**
             * Props Formik
             */
            values={formik.values}
            errors={formik.errors}
            touched={formik.touched}
            setFieldValue={formik.setFieldValue}
            setFieldTouched={formik.setFieldTouched}
            /**
             * Props Ag-Grid
             */
            rowData={initialData}
            gridStyle={gridStyle}
            gridProps={gridProps}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onGridReady={this.onGridReady}
            ignoreSuppressColumns={['transporterCode', 'driver']}
          />
        }
        unmountOnExit={false}
      />
    );
  }
}

Section6.propTypes = {
  classes: PropTypes.object.isRequired,
  formik: PropTypes.object,
  shippers: PropTypes.array,
  leadtime: PropTypes.array,
  vehicleRoutes: PropTypes.array,
  vehiclePallets: PropTypes.array,
  vehicleCleanings: PropTypes.array,
  shippingLeadtime: PropTypes.array,
  temperatureStatus: PropTypes.array,
  chipTemperatureStatus: PropTypes.array,
  shippingLeadtimeReasons: PropTypes.array,
  shippingLeadtimeExportReasons: PropTypes.array,
  onGetShipperAuto: PropTypes.func,
  match: PropTypes.object,
};

Section6.defaultProps = {
  leadtime: [],
  shippers: [],
  vehicleRoutes: [],
  vehiclePallets: [],
  shippingLeadtime: [],
  vehicleCleanings: [],
  temperatureStatus: [],
  chipTemperatureStatus: [],
  shippingLeadtimeReasons: [],
  shippingLeadtimeExportReasons: [],
};

const mapStateToProps = createStructuredSelector({
  leadtime: makeSelectData('leadtime'),
  shippers: makeSelectData('master', 'shippers'),
  vehicleRoutes: makeSelectData('master', 'vehicleRoutes'),
  vehiclePallets: makeSelectData('master', 'vehiclePallets'),
  shippingLeadtime: makeSelectData('master', 'shippingLeadtime'),
  vehicleCleanings: makeSelectData('master', 'vehicleCleanings'),
  temperatureStatus: makeSelectData('master', 'temperatureStatus'),
  chipTemperatureStatus: makeSelectData('master', 'chipTemperatureStatus'),
  shippingLeadtimeReasons: makeSelectData('master', 'shippingLeadtimeReasons'),
  shippingLeadtimeExportReasons: makeSelectData(
    'master',
    'shippingLeadtimeExportReasons',
  ),
});

export const mapDispatchToProps = dispatch => ({
  onGetShipperAuto: (inputText, callback) =>
    dispatch(getShipperAuto(inputText, callback)),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withRouter,
  withImmutablePropsToJS,
  withStyles(styles),
)(Section6);
