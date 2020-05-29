/**
 *
 * ImportedBaskets
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { Form, Field } from 'formik';
import SelectAutocomplete from 'components/SelectAutocomplete';
import Expansion from 'components/Expansion';
import InputControl from 'components/InputControl';
import FormData from 'components/FormikUI/FormData';
import DatePickerControl from 'components/PickersControl';
import MuiButton from 'components/MuiButton';
import { FormControlLabel, Checkbox, Button } from '@material-ui/core';
import CompleteButton from 'components/Button/ButtonComplete';
import PinnedRowRenderer from 'components/FormikUI/PinnedRowRenderer';
import { getRowStyle } from 'utils/index';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import ConfirmationDialog from 'components/ConfirmationDialog';
import { Can } from 'authorize/ability-context';
import { CODE, SCREEN_CODE } from 'authorize/groupAuthorize';
import {
  defaultColDef,
  defaultColDefAsset,
  defaultColDefSection4,
} from './Config';
import * as constants from './constants';
import Section2 from './Section2';

// eslint-disable-next-line react/prop-types
const SpacingTop = ({ className }) => <div className={className} />;
const StyledSpacingTop = styled(SpacingTop)`
  ${({ theme }) => `margin-top: ${theme.spacing.unit * 2}px`};
`;

// eslint-disable-next-line react/prop-types
const Heading = ({ children, className }) => (
  <div className={className}>
    <Typography variant="h5">{children}</Typography>
  </div>
);

const HeadingStyled = styled(Heading)`
  ${({ theme }) => `margin: ${theme.spacing.unit}px 0px`};
`;

const duplicateClasses = [
  'dupplicate-row-1',
  'dupplicate-row-2',
  'dupplicate-row-3',
  'dupplicate-row-4',
  'dupplicate-row-5',
];
let distinctDuplication = 0;

export default class ImportCreate extends React.PureComponent {
  constructor(props) {
    super(props);
    this.render = this.render.bind(this);
  }

  showConfirm = options => {
    if (this.confirmRef) {
      this.confirmRef.showConfirm(options);
    }
  };

  getColumnDef = (typeNewImport, formik, configData) => configData.columnDefs;

  getColumnDefSection4 = configData => configData.columnBasket4;

  getColumnDefAsset = (typeNewImport, formik, configData) => {
    if (formik && formik.values.assetType === 3) {
      return configData.columnAsset3;
    }
    if (formik && formik.values.assetType === 4) {
      return configData.columnAsset4;
    }
    return configData.columnAsset;
  };

  getColumnSection2 = configData => {
    const { columnDefsSection2Edit, columnDefsSection2 } = configData;

    if (!this.props.formik.values.isForBasket) {
      if (configData.value === constants.TYPE_PNKS.PNKS_DIEU_CHUYEN) {
        return columnDefsSection2Edit;
      }
    }
    return columnDefsSection2;
  };

  isCreate = () => true;

  isEdit = () => false;

  isView = () => false;

  handleImport = e => {
    this.props.formik.handleSubmitClick(e);
  };

  previousPage = () => {
    this.props.history.goBack();
  };

  onGridReady = params => {
    this.gridApi = params.api;
  };

  onGridReadySection3 = params => {
    this.gridApiSection3 = params.api;
  };

  onGridReadyAsset = params => {
    this.gridApiAsset = params.api;
  };

  onNewColumnsLoaded = () => {
    if (this.gridApi) {
      this.gridApi.sizeColumnsToFit();
    }
  };

  onNewColumnsLoadedSection3 = () => {
    if (this.gridApiSection3) {
      this.gridApiSection3.sizeColumnsToFit();
    }
  };

  onNewColumnsLoadedAsset = () => {
    if (this.gridApiAsset) {
      this.gridApiAsset.sizeColumnsToFit();
    }
  };

  onGridReadySection4 = params => {
    this.gridApiSection4 = params.api;
  };

  onNewColumnsLoadedSection4 = () => {
    if (this.gridApiSection4) {
      this.gridApiSection4.sizeColumnsToFit();
    }
  };

  rowKeys = new Map();

  /* eslint-disable no-plusplus */
  getRowClass = params => {
    if (this.props.formik.values.importSubType) {
      if (
        this.props.formik.values.importSubType.value ===
          constants.TYPE_PNKS.PNKS_DIEU_CHUYEN ||
        this.props.formik.values.importSubType.value ===
          constants.TYPE_PNKS.PNKS_MOI ||
        this.props.formik.values.importSubType.value ===
          constants.TYPE_PNKS.PNKS_TRA ||
        this.props.formik.values.importSubType.value ===
          constants.TYPE_PNKS.PNKS_MUON
      ) {
        const {
          data,
          context: { rowKeys },
        } = params;
        if (params.rowIndex === 0) {
          const tempKeys = {};
          this.props.section3.forEach(row => {
            if (isRowValid(row)) {
              const key = getRowKey(row);
              if (tempKeys[key]) {
                tempKeys[key]++;

                if (!rowKeys.has(key)) {
                  rowKeys.set(key, duplicateClasses[distinctDuplication]);
                  distinctDuplication++;

                  if (distinctDuplication >= duplicateClasses.length) {
                    distinctDuplication = 0;
                  }
                }
                this.props.onShowWarning(
                  'Không được nhiều hơn một Mã Khay Sọt có cùng một Kho Đích',
                );
              } else {
                tempKeys[key] = 1;
              }
            }
          });
          // delete keys that only appear 1 time
          // eslint-disable-next-line no-restricted-syntax
          for (const prop in tempKeys) {
            if (tempKeys[prop] === 1) {
              rowKeys.delete(prop);
            }
          }
        }

        // return the duplicate class
        if (isRowValid(data)) {
          const key = getRowKey(data);
          if (rowKeys.has(key)) {
            return rowKeys.get(key);
          }
        }

        return '';
      }
    }
    return '';
  };

  /* eslint-enable no-plusplus */
  render() {
    const {
      formOption,
      configData,
      classes,
      onChangeSubtype,
      onAddRow,
      formik,
      bottomBasket,
      form,
      section3,
      getDeliver,
      print,
      rePrint,
      preview,
      setBtnSubmit,
      assetDetails,
      typeNewImport,
      bottomAsset,
      bottomSection4,
      section4,
    } = this.props;
    const columnDefs = this.getColumnDef(typeNewImport, formik, configData);
    const columnDefsSection4 = this.getColumnDefSection4(configData);
    const columnDefAsset = this.getColumnDefAsset(
      typeNewImport,
      formik,
      configData,
    );
    const columnSection2 = this.getColumnSection2(configData);
    const enableBBGH =
      formik.values.importSubType &&
      formik.values.importSubType.value ===
        constants.TYPE_PNKS.PNKS_DIEU_CHUYEN;

    const enableAdd = () => {
      if (formik.values.importSubType) {
        if (
          (formik.values.importSubType.value ===
            constants.TYPE_PNKS.PNKS_DIEU_CHUYEN ||
            formik.values.importSubType.value ===
              constants.TYPE_PNKS.PNKS_MUON ||
            formik.values.importSubType.value ===
              constants.TYPE_PNKS.PNKS_MOI ||
            formik.values.importSubType.value ===
              constants.TYPE_PNKS.PNKS_TRA) &&
          !this.isView()
        ) {
          return true;
        }
      }
      return false;
    };

    const enableSection2 = () => {
      if (formik.values.importSubType) {
        if (
          (formik.values.importSubType.value ===
            constants.TYPE_PNKS.PNKS_DIEU_CHUYEN &&
            !this.isView()) ||
          (formik.values.importSubType.value === constants.TYPE_PNKS.PNKS_TRA &&
            !this.isView())
        ) {
          return true;
        }
      }
      return false;
    };

    const titleSection2 = () => {
      if (formik.values.importSubType) {
        return formik.values.importSubType.value ===
          constants.TYPE_PNKS.PNKS_DIEU_CHUYEN
          ? 'II.Thông Tin Khay Sọt BBGH'
          : 'II.Thông Tin Khay Sọt Đang Cho Mượn';
      }
      return false;
    };
    const titleSection3 = enableSection2()
      ? 'III. Thông Tin Khay Sọt'
      : 'II. Thông Tin Khay Sọt';

    const enableShowScale = !!(
      !this.isView() &&
      configData.renderGetTurnToScale &&
      !this.props.formik.values.isForBasket
    );

    const enableHandle =
      formik.values.importSubType &&
      (formik.values.importSubType.value ===
        constants.TYPE_PNKS.PNKS_DIEU_CHINH &&
        this.isView &&
        true);

    const enableBtn = !!(
      (formik.values.status === 1 && this.isEdit()) ||
      this.isCreate()
    );

    // eslint-disable-next-line consistent-return
    const enableDeliver = () => {
      if (formik.values.importSubType) {
        if (
          formik.values.importSubType.value ===
            constants.TYPE_PNKS.PNKS_DIEU_CHUYEN ||
          formik.values.importSubType.value === constants.TYPE_PNKS.PNKS_MUON ||
          formik.values.importSubType.value === constants.TYPE_PNKS.PNKS_TRA ||
          formik.values.importSubType.value ===
            constants.TYPE_PNKS.PNKS_KHO_DI_DUONG
        ) {
          return true;
        }
        return false;
      }
    };
    const confirmChange = func => {
      this.showConfirm({
        title: 'Cảnh báo',
        message: messChange,
        actions: [
          { text: 'Hủy' },
          {
            text: 'Đồng Ý',
            color: 'primary',
            onClick: () => {
              func();
            },
          },
        ],
      });
    };

    const messChange =
      'Nếu bạn thay đổi giá trị thì thông tin khay sọt vừa nhập sẽ không được lưu! Bạn vẫn muốn thay đổi?';

    const enableAsset = () => {
      if (configData.columnAsset && this.isView()) {
        return true;
      }
      return false;
    };

    const enableSection4 = () => {
      if (
        configData.columnBasket4 &&
        this.isView() &&
        this.props.formik &&
        this.props.formik.values.assetType === 4
      ) {
        return true;
      }
      return false;
    };

    // eslint-disable-next-line consistent-return
    const disableDate = () => {
      if (formik.values.importSubType) {
        if (
          this.isView() ||
          formik.values.importSubType.value === constants.TYPE_PNKS.PNKS_TRA ||
          formik.values.importSubType.value === constants.TYPE_PNKS.PNKS_MUON
        ) {
          return true;
        }
      }
    };

    const checkComplete = () => {
      const data = [];
      if (this.props.section3) {
        this.props.section3.forEach(item => {
          if (item.basketCode) {
            data.push(item);
          }
        });
        if (data < 1) {
          return true;
        }
      }
      return false;
    };

    const enableAssetDocument = () => {
      if (
        formik.values.importSubType &&
        formik.values.importSubType.value === constants.TYPE_PNKS.PNKS_MOI &&
        this.isView()
      ) {
        return true;
      }
      return false;
    };

    const titleAssetDocumentCode = () => {
      // label={
      //   formik.values.importType &&
      //   formik.values.importType !== 11
      //     ? 'Mã PNKS (Sở Hữu)'
      //     : 'Mã PNKS Mới (Sở Hữu)'
      // }
      let title = '';
      // xuất hủy sở hữu
      if (this.props.formik.values.assetType === 4) {
        title = 'Mã PXKS (Sở Hữu)';
      } else if (formik.values.importType && formik.values.importType !== 11) {
        title = 'Mã PNKS (Sở Hữu)';
      } else {
        title = 'Mã PNKS Mới (Sở Hữu)';
      }
      return title;
    };

    const titleBasketDocumentCode = () => {
      // label={
      //   formik.values.importType && formik.values.importType !== 11
      //     ? 'Mã PNKS - PXKS (Sử dụng)'
      //     : 'Mã PNKS Mới (Sử dụng)'
      // }
      let title = 'Mã PNKS (Sử dụng)';
      // xuất hủy sở hữu
      if (this.props.formik.values.assetType === 4) {
        title = 'Mã PXKS (Sử Dụng)';
      }
      // chuyen noi bo
      if (this.props.formik.values.assetType === 3) {
        title = 'Mã PNKS - PXKS (Sử Dụng)';
      }

      return title;
    };

    return (
      <Form>
        <HeadingStyled>{`${
          form === constants.TYPE_FORM.CREATE
            ? 'Tạo Mới'
            : `${form === constants.TYPE_FORM.EDIT ? 'Chỉnh Sửa' : 'Xem'}`
        } Phiếu Nhập Kho Khay Sọt`}</HeadingStyled>
        <Expansion
          title="I. Thông Tin Chung"
          rightActions={
            this.isView() && (
              <Grid container justify="flex-end" spacing={16}>
                <Grid item className={classes.spacing}>
                  <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    onClick={preview}
                  >
                    Xem Trước Phiếu In
                  </Button>
                </Grid>
                <Grid item className={classes.spacing}>
                  <Can not do={CODE.inLai} on={SCREEN_CODE.PRINTABLE}>
                    <Button
                      type="button"
                      variant="contained"
                      color="primary"
                      onClick={print}
                    >
                      In Phiếu
                    </Button>
                  </Can>
                  <Can do={CODE.inLai} on={SCREEN_CODE.PRINTABLE}>
                    <Button
                      type="button"
                      variant="contained"
                      color="primary"
                      onClick={rePrint}
                    >
                      In Phiếu
                    </Button>
                  </Can>
                </Grid>
              </Grid>
            )
          }
          content={
            <Grid container spacing={24}>
              <Grid item md={3} xs={6}>
                {!typeNewImport && !this.isCreate() ? (
                  <Field
                    name="basketDocumentCode"
                    label="Mã Phiếu Nhập Khay Sọt"
                    component={InputControl}
                    disabled
                  />
                ) : (
                  ''
                )}
                <Field
                  name="importSubType"
                  label={configData.newImport ? 'Loại Phiếu' : 'Loại Nhập Kho'}
                  component={SelectAutocomplete}
                  onChangeSelectAutoComplete={selected => {
                    this.showConfirm({
                      title: 'Cảnh báo',
                      message: messChange,
                      actions: [
                        { text: 'Hủy' },
                        {
                          text: 'Đồng ý',
                          color: 'primary',
                          onClick: () => {
                            onChangeSubtype(selected);
                          },
                        },
                      ],
                    });
                  }}
                  required
                  options={formOption.subTypes}
                  placeholder="Lựa Chọn Loại Nhập Kho"
                  disabled={
                    this.isView() ||
                    (!formik.values.checkEdit && formik.values.status === 1)
                  }
                />
                <Can not do={CODE.backdatePNKS} on={SCREEN_CODE.PNKS}>
                  <Field
                    name="date"
                    label="Ngày Nhập Kho"
                    component={DatePickerControl}
                    isDateTimePicker
                    format="dd/MM/yyyy HH:mm:ss"
                    controlOutside={date =>
                      this.props.onChangeField({
                        field: 'date',
                        value: date,
                      })
                    }
                    disabled
                  />
                </Can>
                {this.props.formik.values.assetType === 3 && (
                  <Field
                    name="basketCancellReceiptCode"
                    label="Mã PYCH"
                    component={InputControl}
                    disabled
                  />
                )}

                {this.props.formik.values.assetType === 4 && (
                  <Field
                    name="basketCancellReceiptCode"
                    label="Mã PYC Thanh Lý/Hủy"
                    component={InputControl}
                    disabled
                  />
                )}
                <Can do={CODE.backdatePNKS} on={SCREEN_CODE.PNKS}>
                  <Field
                    name="date"
                    label="Ngày Nhập Kho"
                    component={DatePickerControl}
                    isDateTimePicker
                    format="dd/MM/yyyy HH:mm:ss"
                    controlOutside={date =>
                      this.props.onChangeField({
                        field: 'date',
                        value: date,
                      })
                    }
                    disabled={disableDate()}
                    required
                  />
                </Can>
                {enableBBGH && (
                  <Field
                    name="deliveryOrder"
                    label="Mã Biên Bản Giao Hàng"
                    component={SelectAutocomplete}
                    onChangeSelectAutoComplete={selected => {
                      if (formik.values.deliveryOrder) {
                        this.showConfirm({
                          title: 'Cảnh báo',
                          message: messChange,
                          actions: [
                            { text: 'Hủy' },
                            {
                              text: 'Đồng ý',
                              color: 'primary',
                              onClick: () => {
                                this.props.onChangeDeliveryOrder({
                                  field: 'deliveryOrder',
                                  value: selected,
                                });
                              },
                            },
                          ],
                        });
                      } else {
                        this.props.onChangeDeliveryOrder({
                          field: 'deliveryOrder',
                          value: selected,
                        });
                      }
                    }}
                    placeholder="Lựa Chọn Mã BBGH"
                    options={formOption.deliveryOrders}
                    required
                    disabled={
                      this.isView() ||
                      (!formik.values.checkEdit && formik.values.status === 1)
                    }
                  />
                )}
                {this.props.formik.values.importType === 13 && (
                  <Field
                    name="stockTakingCode"
                    label="Mã BBKK"
                    component={InputControl}
                    disabled
                  />
                )}
              </Grid>
              <Grid item md={3} xs={6}>
                {enableDeliver() && (
                  <Field
                    name="deliver"
                    label="Đơn Vị Giao Hàng"
                    component={SelectAutocomplete}
                    loadOptionsFunc={getDeliver}
                    onChangeSelectAutoComplete={selected => {
                      const changeBasket = () => {
                        this.props.getDoBasketDetail(
                          {
                            importSubType: formik.values.importSubType.value,
                            deliverType: selected && selected.deliverType,
                            receiverCode:
                              formik.values.receiver &&
                              formik.values.receiver.value,
                            deliverCode: selected && selected.value,
                          },
                          {
                            field: 'deliver',
                            value: selected,
                            locator: formOption.locatorTo,
                          },
                        );
                      };
                      if (formik.values.deliver) {
                        confirmChange(() => {
                          changeBasket();
                        });
                      } else {
                        changeBasket();
                      }
                    }}
                    isAsync
                    placeholder="Lựa Chọn Đơn Vị Giao Hàng"
                    required
                    disabled={
                      this.isView() ||
                      (!formik.values.checkEdit && formik.values.status === 1)
                    }
                  />
                )}

                {enableAssetDocument() && (
                  <Field
                    name="assetDocumentCode"
                    label={titleAssetDocumentCode()}
                    component={InputControl}
                    disabled={
                      this.isView() ||
                      (!formik.values.checkEdit && formik.values.status === 1)
                    }
                  />
                )}
                {typeNewImport && this.isView() ? (
                  <Field
                    name="basketDocumentCode"
                    label={titleBasketDocumentCode()}
                    component={InputControl}
                    disabled={
                      this.isView() ||
                      (!formik.values.checkEdit && formik.values.status === 1)
                    }
                  />
                ) : (
                  ''
                )}

                {this.props.formik.values.assetType === 4 ? (
                  <Field
                    name="receiver"
                    label="Đơn Vị Hủy"
                    component={SelectAutocomplete}
                    options={formOption.receivers}
                    required
                    disabled
                  />
                ) : (
                  <Field
                    name="receiver"
                    label={
                      configData.newImport
                        ? 'Nơi Nhận Sở Hữu'
                        : 'Đơn Vị Nhận Hàng'
                    }
                    component={SelectAutocomplete}
                    onChangeSelectAutoComplete={selected => {
                      const changeBasket = locator => {
                        this.props.getDoBasketDetail(
                          {
                            importSubType: formik.values.importSubType.value,
                            deliverType:
                              formik.values.deliver &&
                              formik.values.deliver.deliverType,
                            deliverCode:
                              formik.values.deliver &&
                              formik.values.deliver.value,
                            receiverCode: selected && selected.value,
                          },
                          {
                            field: 'receiver',
                            value: selected,
                            locator: locator || [],
                          },
                        );
                      };
                      if (formik.values.receiver) {
                        if (selected) {
                          confirmChange(() => {
                            this.props.onGetLocatorTo(
                              selected.value,
                              locator => {
                                changeBasket(locator);
                              },
                            );
                          });
                        } else {
                          confirmChange(() => {
                            changeBasket();
                          });
                        }
                      } else {
                        this.props.onGetLocatorTo(selected.value, locator => {
                          changeBasket(locator);
                        });
                      }
                    }}
                    options={formOption.receivers}
                    placeholder={
                      configData.newImport
                        ? 'Lựa Chọn Nơi Nhận Sở Hữu'
                        : 'Lựa Chọn Đơn vị Nhận Hàng'
                    }
                    required
                    disabled={
                      this.isView() ||
                      (!formik.values.checkEdit && formik.values.status === 1)
                    }
                  />
                )}
                {enableHandle && (
                  <Field
                    name="originAdjustCode"
                    label="Mã Nguồn Điều Chỉnh"
                    component={InputControl}
                    disabled
                  />
                )}
                {enableHandle && (
                  <Field
                    name="originAdjust"
                    label="Nguồn Xử Lí"
                    component={InputControl}
                    disabled
                  />
                )}
              </Grid>
              <Grid item md={3} xs={6}>
                {this.props.formik.values.assetType === 4 ? (
                  <Field
                    name="importor"
                    label="Nhân Viên Hủy"
                    component={SelectAutocomplete}
                    required
                    options={formOption.users}
                    disabled
                  />
                ) : (
                  <Field
                    name="importor"
                    label={
                      configData.newImport
                        ? 'Nhân Viên Thực Hiện'
                        : 'Nhân Viên Nhập Kho'
                    }
                    component={SelectAutocomplete}
                    onChangeSelectAutoComplete={selected =>
                      this.props.onChangeField({
                        field: 'importor',
                        value: selected,
                      })
                    }
                    required
                    options={formOption.users}
                    placeholder={
                      configData.newImport
                        ? 'Lựa Chọn Nhân Viên Thực Hiện'
                        : 'Lựa Chọn Nhân Viên Nhập Kho'
                    }
                    disabled
                  />
                )}
                <Field
                  name="phoneNumber"
                  label="Điện Thoại"
                  component={InputControl}
                  disabled
                />
                {!configData.newImport && (
                  <Field
                    name="email"
                    label="Email"
                    component={InputControl}
                    disabled
                  />
                )}

                {this.props.formik.values.assetType === 4 && (
                  <Field
                    name="email"
                    label="Email"
                    component={InputControl}
                    disabled
                  />
                )}
                {this.isView() && this.props.formik.values.assetType !== 4 ? (
                  <Field
                    name="statusName"
                    label="Trạng Thái"
                    component={InputControl}
                    disabled
                  />
                ) : (
                  ''
                )}
              </Grid>
              <Grid item md={3} xs={12}>
                {!configData.newImport && (
                  <Field
                    name="supervisor"
                    label="Nhân Viên Giám Sát"
                    component={SelectAutocomplete}
                    onChangeSelectAutoComplete={selected =>
                      this.props.onChangeField({
                        field: 'supervisor',
                        value: selected,
                      })
                    }
                    placeholder="Lựa chọn nhân viên giám sát"
                    options={formOption.users}
                    disabled={this.isView()}
                  />
                )}
                {this.props.formik.values.assetType === 4 && (
                  <Field
                    name="statusName"
                    label="Trạng Thái"
                    component={InputControl}
                    disabled
                  />
                )}
                <Field
                  name="note"
                  label="Ghi Chú"
                  component={InputControl}
                  multiline
                  onChange={note => {
                    this.props.onChangeField({
                      field: 'note',
                      value: note.target.value,
                    });
                  }}
                  disabled={this.isView()}
                />
              </Grid>
            </Grid>
          }
        />
        <StyledSpacingTop />

        {enableSection2() && (
          <Grid item xs={12}>
            <Expansion
              title={titleSection2()}
              content={
                <Section2
                  {...this.props}
                  columnSection2={columnSection2}
                  onNewColumnsLoaded={this.onNewColumnsLoaded}
                  onGridReady={this.onGridReady}
                />
              }
            />
          </Grid>
        )}

        <StyledSpacingTop />
        {!typeNewImport && (
          <Grid item xs={12}>
            <Expansion
              title={titleSection3}
              rightActions={
                <Grid
                  container
                  justify="flex-end"
                  alignItems="center"
                  spacing={24}
                >
                  {enableShowScale && (
                    <Grid item>
                      <FormControlLabel
                        onChange={(e, checked) =>
                          this.props.getToImportReceipt(checked)
                        }
                        control={<Checkbox color="primary" />}
                        label="Thông Tin Khay Sọt Từ PNK"
                      />
                    </Grid>
                  )}
                  <Grid item>
                    <div className={classes.topToolbarPart}>
                      {enableAdd() && (
                        <MuiButton icon="note_add" outline onClick={onAddRow} />
                      )}
                    </div>
                  </Grid>
                </Grid>
              }
              content={
                <FormData
                  name="section3"
                  idGrid="imported-section3"
                  rowData={section3}
                  gridStyle={{ height: 'auto' }}
                  columnDefs={columnDefs}
                  defaultColDef={defaultColDef}
                  setFieldValue={formik.setFieldValue}
                  setFieldTouched={formik.setFieldTouched}
                  errors={formik.errors}
                  touched={formik.touched}
                  autoLayout
                  gridProps={{
                    getRowClass: this.getRowClass,
                    context: this,
                    suppressScrollOnNewData: true,
                    suppressHorizontalScroll: true,
                    pinnedBottomRowData: bottomBasket(),
                    frameworkComponents: {
                      customPinnedRowRenderer: PinnedRowRenderer,
                    },
                    domLayout: 'autoHeight',
                    onNewColumnsLoaded: this.onNewColumnsLoadedSection3,
                    getRowStyle,
                  }}
                  {...formik}
                  onGridReady={this.onGridReadySection3}
                />
              }
            />
          </Grid>
        )}
        <StyledSpacingTop />

        {enableAsset() && (
          <Grid item xs={12}>
            <Expansion
              title={
                typeNewImport
                  ? 'II. Thông Tin Tài Sản'
                  : 'III. Thông Tin Tài Sản'
              }
              content={
                <FormData
                  name="assetDetails"
                  idGrid="imported-assetDetails"
                  rowData={assetDetails}
                  columnDefs={columnDefAsset}
                  defaultColDef={defaultColDefAsset}
                  setFieldValue={formik.setFieldValue}
                  autoLayout
                  gridStyle={{ height: 'auto' }}
                  gridProps={{
                    context: this,
                    suppressScrollOnNewData: true,
                    suppressHorizontalScroll: true,
                    pinnedBottomRowData: bottomAsset(),
                    frameworkComponents: {
                      customPinnedRowRenderer: PinnedRowRenderer,
                    },
                    domLayout: 'autoHeight',
                    onNewColumnsLoaded: this.onNewColumnsLoadedAsset,
                    getRowStyle,
                  }}
                  {...formik}
                  onGridReady={this.onGridReadyAsset}
                />
              }
            />
          </Grid>
        )}
        <StyledSpacingTop />
        {enableSection4() && (
          <Grid item xs={12}>
            <Expansion
              title="III. Thông Tin Khay Sọt"
              content={
                <FormData
                  name="section4"
                  rowData={section4}
                  columnDefs={columnDefsSection4}
                  defaultColDef={defaultColDefSection4}
                  setFieldValue={formik.setFieldValue}
                  autoLayout
                  gridStyle={{ height: 'auto' }}
                  gridProps={{
                    context: this,
                    suppressScrollOnNewData: true,
                    suppressHorizontalScroll: true,
                    pinnedBottomRowData: bottomSection4(),
                    frameworkComponents: {
                      customPinnedRowRenderer: PinnedRowRenderer,
                    },
                    domLayout: 'autoHeight',
                    onNewColumnsLoaded: this.onNewColumnsLoadedSection4,
                    getRowStyle,
                  }}
                  {...formik}
                  onGridReady={this.onGridReadySection4}
                />
              }
            />
          </Grid>
        )}

        <Grid
          className={classes.spacing}
          container
          spacing={24}
          justify="flex-end"
        >
          <Grid item>
            <MuiButton outline onClick={this.previousPage}>
              Quay Lại
            </MuiButton>
          </Grid>
          {enableBtn && (
            <React.Fragment>
              <Grid item>
                <MuiButton
                  type="submit"
                  onClick={e => {
                    setBtnSubmit(form);
                    this.handleImport(e);
                  }}
                >
                  Lưu
                </MuiButton>
              </Grid>
              <Grid item>
                <CompleteButton
                  type="submit"
                  text="Hoàn Thành"
                  onClick={e => {
                    setBtnSubmit(constants.FIELD_NAME.COMPLETE);
                    this.handleImport(e);
                  }}
                  disabled={checkComplete()}
                />
              </Grid>
            </React.Fragment>
          )}
        </Grid>
        <ConfirmationDialog
          ref={ref => {
            this.confirmRef = ref;
          }}
        />
      </Form>
    );
  }
}

ImportCreate.propTypes = {
  formData: PropTypes.object,
  classes: PropTypes.object,
  configData: PropTypes.object,
  onChangeSubtype: PropTypes.func,
  onAddRow: PropTypes.func,
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
  onComplete: PropTypes.func,
  onShowWarning: PropTypes.func,
  onGetDeliverTransition: PropTypes.func,
  onGetLocatorTo: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onChangeBasketsCode: PropTypes.func,
  changeReceiveQuantity: PropTypes.func,
  history: PropTypes.object,
  onChangeQuantity: PropTypes.func,
  section2: PropTypes.array,
  section3: PropTypes.array,
  section4: PropTypes.array,
  assetDetails: PropTypes.array,
  fakeDoBasketDetail: PropTypes.array,
  fakeBasketDetail: PropTypes.array,
  getDoBasketDetail: PropTypes.func,
  print: PropTypes.func,
  changebasketLocatorTo: PropTypes.func,
  table: PropTypes.object,
  columnDoBasket: PropTypes.object,
  typeForm: PropTypes.string,
  formik: PropTypes.object,
  bottomBasket: PropTypes.func,
  bottomAsset: PropTypes.func,
  form: PropTypes.func,
  onChangeDeliveryOrder: PropTypes.func,
  confirmRemoveRecord: PropTypes.func,
  getDeliver: PropTypes.func,
  getToImportReceipt: PropTypes.func,
  setBtnSubmit: PropTypes.func,
  setBasketDetails: PropTypes.func,
  bottomSection4: PropTypes.func,
  typeNewImport: PropTypes.string,
};

function isRowValid(row) {
  return row.basketCode && row.locatorReceiver;
}

function getRowKey(row) {
  return `${row.basketCode}${row.locatorReceiver}`;
}
