/**
 *
 * ImportedBaskets
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { showWarning } from 'containers/App/actions';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import ConfirmationDialog from 'components/ConfirmationDialog';
import { withStyles } from '@material-ui/core';
import FormWrapper from 'components/FormikUI/FormWrapper';
import { groupBy } from 'lodash';
import PrintPreview from 'components/PrintPreview';
import { addNumbers } from 'utils/numberUtils';
import BasketSuggest from './basketSuggest';
import * as constants from './constants';
import makeSelectImportedBaskets, { makeSelectArrBasket } from './selectors';
import reducer from './reducer';
import saga from './saga';
import ImportEdit from './ImportEdit';
import ImportView from './ImportView';
import ImportCreate from './ImportCreate';

/* eslint-disable react/prefer-stateless-function */
export const styles = theme => ({
  spacing: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  topToolbarPart: {
    display: 'flex',
    '& > *:first-child': {
      marginLeft: theme.spacing.unit * 2,
    },
    '& > *:not(:last-child)': {
      marginRight: theme.spacing.unit * 2,
    },
  },
  btnAction: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.primary.main,
    marginRight: theme.spacing.unit * 2,
  },
});

export class ImportedBaskets extends React.PureComponent {
  constructor(props) {
    super(props);
    this.confirmRemoveRecord = this.confirmRemoveRecord.bind(this);
  }

  form = null;

  id = null;

  formik = null;

  typeNewImport = null;

  isWeight = false;

  state = {
    openDl: false,
    printPreviewContent: '',
    printPreview: false,
  };

  dataBasketDetails = [];

  setBasketDetails = data => {
    this.dataBasketDetails = data;
  };

  init = () => {
    const {
      location: { search, pathname },
    } = this.props;
    if (search) {
      const urlParams = new URLSearchParams(search); // not support IE
      const form = urlParams.get('form'); // 1:create/2:edit/3:view
      this.form = form;
      const id = urlParams.get('id');
      this.id = id;
      const typeNewImport = urlParams.get('type');
      this.typeNewImport = typeNewImport;
      const isWeight = urlParams.get('isWeight');
      this.isWeight = isWeight || false;

      this.props.onInitFormData(
        { form, id, typeNewImport, pathname },
        (data, basket) => {
          this.props.onGetLocatorTo(data.receiverCode);
          // duoc phep thay doi loai nhap kho
          if (basket) {
            if (form !== constants.TYPE_FORM.VIEW) {
              if (data.subType === constants.TYPE_PNKS.PNKS_DIEU_CHUYEN) {
                if (
                  (basket.basketDetails.length === 0 &&
                    basket.doBasketDetails.length === 0) ||
                  (basket.basketDetails.length === 0 &&
                    basket.loanBasketDetails.length === 0)
                ) {
                  this.getDeliveryOrder(data);
                }
              }
            }
          } else {
            this.getDeliveryOrder(data);
          }
        },
      );
    }
  };

  componentDidMount() {
    this.init();
  }

  // eslint-disable-next-line consistent-return
  onSubmit = values => {
    const group = groupBy(this.props.section3, 'basketCode');
    delete group.undefined;
    const dataMain = {
      ...this.props.section3,
      ...values,
    };
    if (this.props.btnSubmit) {
      const data = {
        id: this.id || 0,
        importSubType: dataMain.importSubType.value,
        deliverCode: dataMain.deliver && dataMain.deliver.value,
        deliverName: dataMain.deliver && dataMain.deliver.label,
        receiverCode: dataMain.receiver.value,
        receiverName: dataMain.receiver.label,
        deliverType: dataMain.deliver && dataMain.deliver.deliverType,
        deliveryOrderCode:
          dataMain.deliveryOrder && dataMain.deliveryOrder.value,
        date: dataMain.date,
        userId: dataMain.importor && dataMain.importor.value,
        supervisorId: dataMain.supervisor && dataMain.supervisor.value,
        note: dataMain.note,
        isChecked: dataMain.isChecked,
      };
      // Tao luu, cap nhat
      if (
        this.props.btnSubmit === constants.FIELD_NAME.CREATE ||
        this.props.btnSubmit === constants.FIELD_NAME.UPDATE
      ) {
        const basketDetails = [];
        // dieu chuyen
        if (
          dataMain.importSubType.value === constants.TYPE_PNKS.PNKS_DIEU_CHUYEN
        ) {
          let message = '';
          if (this.dataBasketDetails) {
            this.dataBasketDetails.forEach(item => {
              const differentDeRe =
                (item.deliveryQuantity || 0) - (item.receiverQuantity || 0);
              if (differentDeRe < 0) {
                message += `Mã Khay Sọt ${
                  item.basketCode
                } có Chênh Lệch Giao/Nhận < 0 \n`;
              } else if (differentDeRe > 0) {
                message += `Mã Khay Sọt ${
                  item.basketCode
                } có Chênh Lệch Giao/Nhận > 0 \n`;
              }
            });
          }

          this.showConfirm({
            title: 'Xác nhận lưu',
            message: `${message}Bạn có chắc chắn muốn lưu?`,
            actions: [
              { text: 'Hủy' },
              {
                text: 'Đồng ý',
                color: 'primary',
                onClick: () => {
                  dataMain.section3.forEach(item => {
                    if (item.basketCode) {
                      basketDetails.push({
                        ...item,
                        locatorReceiver: item.locatorReceiverId,
                      });
                    }
                  });
                  const mainData = {
                    ...data,
                    basketDetails,
                  };
                  if (this.props.btnSubmit === constants.FIELD_NAME.CREATE) {
                    this.props.onCreate(mainData, () => {
                      this.props.history.push(
                        '/danh-sach-phieu-nhap-khay-sot/',
                      );
                    });
                  } else {
                    this.props.onUpdate(mainData, () => {
                      if (this.isWeight) {
                        this.props.history.goBack();
                      } else
                        this.props.history.push(
                          '/danh-sach-phieu-nhap-khay-sot/',
                        );
                    });
                  }
                },
              },
            ],
          });
        }

        // nhap mượn
        if (dataMain.importSubType.value === constants.TYPE_PNKS.PNKS_MUON) {
          dataMain.section3.forEach(item => {
            if (item.basketCode) {
              basketDetails.push(item);
            }
          });
          const mainData = {
            ...data,
            basketDetails,
          };
          if (this.props.btnSubmit === constants.FIELD_NAME.CREATE) {
            this.props.onCreate(mainData, () => {
              this.props.history.push('/danh-sach-phieu-nhap-khay-sot/');
            });
          } else {
            this.props.onUpdate(mainData, () => {
              this.props.history.push('/danh-sach-phieu-nhap-khay-sot/');
            });
          }
        }

        // Nhap trả
        if (dataMain.importSubType.value === constants.TYPE_PNKS.PNKS_TRA) {
          if (this.dataBasketDetails.length > 0) {
            let warning = 1;
            if (this.dataBasketDetails.length > 0) {
              this.dataBasketDetails.forEach(item => {
                if (item.loanQuantity - item.receiverQuantity < 0) {
                  warning = 0;
                }
              });
            }

            if (warning === 0) {
              this.props.onShowWarning(
                'Chênh Lệch Đang Mượn/Trả không được nhỏ hơn 0',
              );
              return false;
            }
            dataMain.section3.forEach(subItem => {
              if (subItem.basketCode) {
                basketDetails.push(subItem);
              }
            });
            const mainData = {
              ...data,
              basketDetails,
            };
            if (this.props.btnSubmit === constants.FIELD_NAME.CREATE) {
              this.props.onCreate(mainData, () => {
                this.props.history.push('/danh-sach-phieu-nhap-khay-sot/');
              });
            } else {
              this.props.onUpdate(mainData, () => {
                this.props.history.push('/danh-sach-phieu-nhap-khay-sot/');
              });
            }
          }
        }

        // nhap mới
        if (dataMain.importSubType.value === constants.TYPE_PNKS.PNKS_MOI) {
          dataMain.section3.forEach(item => {
            if (item.basketCode) {
              basketDetails.push(item);
            }
          });
          const mainData = {
            ...data,
            basketDetails,
          };
          if (this.props.btnSubmit === constants.FIELD_NAME.CREATE) {
            this.props.onCreate(mainData, () => {
              // this.props.history.push('/danh-sach-phieu-nhap-khay-sot/');
              this.props.history.goBack();
            });
          } else {
            this.props.onUpdate(mainData, () => {
              // this.props.history.push('/danh-sach-phieu-nhap-khay-sot/');
              this.props.history.goBack();
            });
          }
        }
      }

      // hoan thanh
      if (this.props.btnSubmit === constants.FIELD_NAME.COMPLETE) {
        if (
          dataMain.importSubType.value === constants.TYPE_PNKS.PNKS_DIEU_CHUYEN
        ) {
          const basketDetails = [];
          const messQuantity = [];
          dataMain.section3.forEach(item => {
            if (item.basketCode) {
              basketDetails.push({
                ...item,
                locatorReceiver: item.locatorReceiverId,
              });
            }
            if (item.basketCode && item.receiverQuantity) {
              messQuantity.push(item);
            }
          });
          if (messQuantity.length === 0) {
            this.props.onShowWarning(
              'Phải có ít nhất một Mã Khay Sọt có Số Lượng Nhập lớn hơn 0',
            );
            return false;
          }

          // confirm chenh lech
          let message = '';
          if (this.dataBasketDetails) {
            this.dataBasketDetails.forEach(item => {
              const differentDeRe =
                (item.deliveryQuantity || 0) - (item.receiverQuantity || 0);
              if (differentDeRe < 0) {
                message += `Mã Khay Sọt ${
                  item.basketCode
                } có Chênh Lệch Giao/Nhận < 0 \n`;
              } else if (differentDeRe > 0) {
                message += `Mã Khay Sọt ${
                  item.basketCode
                } có Chênh Lệch Giao/Nhận > 0 \n`;
              }
            });
          }

          this.showConfirm({
            title: 'Xác nhận hoàn thành',
            message: `${message}Bạn có chắc chắn muốn hoàn thành?`,
            actions: [
              { text: 'Hủy' },
              {
                text: 'Đồng ý',
                color: 'primary',
                onClick: () => {
                  const mainData = {
                    ...data,
                    basketDetails,
                  };
                  this.props.onComplete(mainData, () => {
                    if (this.isWeight) {
                      this.props.history.goBack();
                    } else
                      this.props.history.push(
                        '/danh-sach-phieu-nhap-khay-sot/',
                      );
                  });
                },
              },
            ],
          });
          // documentStatus = 2 đã hoàn thành
          // không phải loại khay sọt và PNK chưa được tạo
          // if (!dataMain.isForBasket && !dataMain.documentStatus) {
          //   this.showConfirm({
          //     title: 'Xác nhận hoàn thành',
          //     message:
          //       'PNK chưa được tạo, bạn có muốn hoàn thành PNKS trước không?',
          //     actions: [
          //       { text: 'Hủy' },
          //       {
          //         text: 'Đồng ý',
          //         color: 'primary',
          //         onClick: () => {
          //           confirmComplete();
          //         },
          //       },
          //     ],
          //   });
          // không phải loại khay sọt và PNK chưa hoàn thành
          // } else if (!dataMain.isForBasket && dataMain.documentStatus === 1) {
          //   this.showConfirm({
          //     title: 'Xác nhận hoàn thành',
          //     message: `PNK hàng hóa mã ${
          //       dataMain.documentCode
          //     } chưa hoàn thành, bạn có muốn hoàn thành PNKS trước không?`,
          //     actions: [
          //       { text: 'Hủy' },
          //       {
          //         text: 'Đồng ý',
          //         color: 'primary',
          //         onClick: () => {
          //           confirmComplete();
          //         },
          //       },
          //     ],
          //   });
          // } else {
          //   confirmComplete();
          // }
        }

        if (dataMain.importSubType.value === constants.TYPE_PNKS.PNKS_TRA) {
          const basketDetails = [];
          const messQuantity = [];

          if (this.dataBasketDetails) {
            let warning = 1;
            this.dataBasketDetails.forEach(item => {
              if (item.loanQuantity - item.receiverQuantity < 0) {
                warning = 0;
              }
            });
            if (warning === 0) {
              this.props.onShowWarning(
                'Chênh Lệch Đang Mượn/Trả không được nhỏ hơn 0',
              );
              return false;
            }
            dataMain.section3.forEach(subItem => {
              if (subItem.basketCode) {
                basketDetails.push(subItem);
              }
              if (subItem.basketCode && subItem.receiverQuantity) {
                messQuantity.push(subItem);
              }
            });
            if (messQuantity.length === 0) {
              this.props.onShowWarning(
                'Phải có ít nhất một Mã Khay Sọt có Số Lượng Nhập lớn hơn 0',
              );
              return false;
            }
            const mainData = {
              ...data,
              basketDetails,
            };
            this.showConfirm({
              title: 'Xác nhận hoàn thành',
              message: `Bạn có chắc chắn muốn hoàn thành?`,
              actions: [
                { text: 'Hủy' },
                {
                  text: 'Đồng ý',
                  color: 'primary',
                  onClick: () => {
                    this.props.onComplete(mainData, () => {
                      this.props.history.push(
                        '/danh-sach-phieu-nhap-khay-sot/',
                      );
                    });
                  },
                },
              ],
            });
          }
        }

        if (dataMain.importSubType.value === constants.TYPE_PNKS.PNKS_MUON) {
          const basketDetails = [];
          const messQuantity = [];
          dataMain.section3.forEach(item => {
            if (item.basketCode) {
              basketDetails.push(item);
            }
            if (item.basketCode && item.receiverQuantity) {
              messQuantity.push(item);
            }
          });
          if (messQuantity.length === 0) {
            this.props.onShowWarning(
              'Phải có ít nhất một Mã Khay Sọt có Số Lượng Nhập lớn hơn 0',
            );
            return false;
          }
          const mainData = {
            ...data,
            basketDetails,
          };
          this.showConfirm({
            title: 'Xác nhận hoàn thành',
            message: `Bạn có chắc chắn muốn hoàn thành?`,
            actions: [
              { text: 'Hủy' },
              {
                text: 'Đồng ý',
                color: 'primary',
                onClick: () => {
                  this.props.onComplete(mainData, () => {
                    this.props.history.push('/danh-sach-phieu-nhap-khay-sot/');
                  });
                },
              },
            ],
          });
        }

        if (dataMain.importSubType.value === constants.TYPE_PNKS.PNKS_MOI) {
          const basketDetails = [];
          dataMain.section3.forEach(item => {
            if (item.basketCode) {
              basketDetails.push(item);
            }
          });
          const mainData = {
            ...data,
            basketDetails,
          };
          this.showConfirm({
            title: 'Xác nhận hoàn thành',
            message: `Bạn có chắc chắn muốn hoàn thành?`,
            actions: [
              { text: 'Hủy' },
              {
                text: 'Đồng ý',
                color: 'primary',
                onClick: () => {
                  this.props.onComplete(mainData, () => {
                    // this.props.history.push('/danh-sach-phieu-nhap-khay-sot/');
                    this.props.history.goBack();
                  });
                },
              },
            ],
          });
        }
      }
      this.formik.setFieldValue('fieldName', '');
    }
  };

  handleInvalidSubmission = () => {
    this.props.onShowWarning(
      'Bạn chưa điền đầy đủ thông tin. Vui lòng kiểm tra lại',
    );
  };

  getDeliveryOrder = params => {
    this.props.onGetDeliveryOrder(params);
  };

  getDeliver = (inputText, callback) => {
    const params = {
      importSubType: this.formik.values.importSubType.value,
      filter: inputText,
    };
    this.props.onGetDeliver({ params, callback });
  };

  onOpenDialog = () => {
    this.setState({ openDl: true });
  };

  onCloseDialog = () => {
    this.setState({ openDl: false });
  };

  onNewColumnsLoaded = () => {
    if (this.gridApi) {
      this.gridApi.sizeColumnsToFit();
    }
  };

  onGridReady = params => {
    this.gridApi = params.api;
  };

  bottomAsset = () => {
    if (this.props.formData.assetType === 4) {
      let priceCancell = 0;
      let quantityCancell = 0;
      if (this.props.assetDetails.length > 0) {
        this.props.assetDetails.forEach(item => {
          // priceCancell += item.priceCancell || 0;
          priceCancell = addNumbers(priceCancell, item.priceCancell);
          quantityCancell += item.quantityCancell || 0;
        });
      }
      return [
        {
          totalCol: true,
          basketName: 'Tổng',
          priceCancell,
          quantityCancell,
        },
      ];
    }
    if (this.props.assetDetails && this.props.formData.assetType !== 4) {
      let receiverQuantity = 0;
      if (this.props.assetDetails.length > 0) {
        this.props.assetDetails.forEach(item => {
          receiverQuantity += item.receiverQuantity || 0;
        });
      }
      return [
        {
          totalCol: true,
          uoM: 'Tổng',
          receiverQuantity,
        },
      ];
    }
    return [];
  };

  bottomSection4 = () => {
    if (this.props.section4) {
      let quantityCancell = 0;
      if (this.props.section4.length > 0) {
        this.props.section4.forEach(item => {
          quantityCancell += item.quantityCancell || 0;
        });
      }
      return [
        {
          totalCol: true,
          reasonName: 'Tổng',
          quantityCancell,
        },
      ];
    }
    return [];
  };

  bottomBasket = () => {
    if (this.props.section3) {
      let receiverQuantity = 0;
      if (this.props.section3.length > 0) {
        this.props.section3.forEach(item => {
          receiverQuantity += item.receiverQuantity || 0;
        });
      }
      return [
        {
          totalCol: true,
          uoM: 'Tổng',
          receiverQuantity,
        },
      ];
    }
    return [];
  };

  showConfirm = options => {
    if (this.confirmRef) {
      this.confirmRef.showConfirm(options);
    }
  };

  confirmRemoveRecord(rowIndex, id) {
    this.showConfirm({
      message: id
        ? `Thông tin phiếu nhập bị xóa không thể khôi phục! Bạn chắc chắn muốn xóa?`
        : 'Bạn chắc chắn muốn xóa?',
      actions: [
        { text: 'Hủy' },
        {
          text: 'Đồng ý',
          color: 'primary',
          onClick: () => {
            const subtype = this.formik.values.importSubType;
            if (subtype) {
              if (
                subtype.value === constants.TYPE_PNKS.PNKS_DIEU_CHUYEN ||
                subtype.value === constants.TYPE_PNKS.PNKS_TRA ||
                subtype.value === constants.TYPE_PNKS.PNKS_MUON ||
                subtype.value === constants.TYPE_PNKS.PNKS_MOI
              ) {
                this.props.onDeleteRow(rowIndex, {
                  basketdocumentId: this.id,
                  basketDetailId: id,
                });
              }
            }
          },
        },
      ],
    });
  }

  changeDeliveryOrder = selected => {
    if (selected.value) {
      this.props.onGetLocatorTo(selected.value.receiverCode, data => {
        this.props.onChangeDeliveryOrder(selected, data);
      });
    } else {
      this.props.onGetLocatorTo(this.formik.values.receiver.value, data => {
        this.props.onChangeDeliveryOrder(selected, data);
      });
    }

    this.getDeliveryOrder({
      deliverCode: selected.value.deliverCode
        ? selected.value.deliverCode
        : null,
      receiverCode: selected.value.receiverCode
        ? selected.value.receiverCode
        : null,
      subType: constants.TYPE_PNKS.PNKS_DIEU_CHUYEN,
    });
  };

  onPrint = () => {
    this.showConfirm({
      title: 'Cảnh báo',
      message: 'Bạn có chắc chắn muốn in không ?',
      actions: [
        { text: 'Bỏ qua' },
        {
          text: 'Đồng ý',
          color: 'primary',
          onClick: () =>
            this.props.print({
              id: this.id,
              onRePrint: false,
              typeNewImport: this.typeNewImport,
            }),
        },
      ],
    });
  };

  onRePrint = () => {
    const { formData } = this.props;
    if (formData.printTimes === 0) {
      this.showConfirm({
        title: 'Cảnh báo',
        message: 'Bạn có chắc chắn muốn in không ?',
        actions: [
          { text: 'Bỏ qua' },
          {
            text: 'Đồng ý',
            color: 'primary',
            onClick: () =>
              this.props.print({
                id: this.id,
                onRePrint: false,
                typeNewImport: this.typeNewImport,
              }),
          },
        ],
      });
    } else
      this.showConfirm({
        title: 'Xác nhận',
        message: 'Có phải bạn muốn in lại lần đầu không ?',
        actions: [
          {
            text: 'Sai',
            color: 'primary',
            onClick: () =>
              this.props.print({
                id: this.id,
                onRePrint: false,
                typeNewImport: this.typeNewImport,
              }),
          },
          {
            text: 'Đúng',
            color: 'primary',
            onClick: () =>
              this.props.print({
                id: this.id,
                onRePrint: true,
                typeNewImport: this.typeNewImport,
              }),
          },
        ],
      });
  };

  onPreview = () => {
    this.props.preview({
      id: this.id,
      typeNewImport: this.typeNewImport,
      callback: content => {
        this.setState({
          printPreview: true,
          printPreviewContent: content,
        });
      },
    });
  };

  onGetToImportReceipt = checked => {
    if (checked) {
      this.props.getToImportReceipt(this.formik.values.basketDocumentCode);
      this.formik.setFieldValue('isChecked', true);
    } else {
      this.props.removeToImportReceipt();
      this.formik.setFieldValue('isChecked', false);
    }
  };

  onGetDoBasketDetail = (payload, data) => {
    this.props.getDoBasketDetail(payload, data);
    if (
      this.formik.values.importSubType.value ===
      constants.TYPE_PNKS.PNKS_DIEU_CHUYEN
    ) {
      this.getDeliveryOrder({
        deliverCode: payload.deliverCode ? payload.deliverCode : null,
        receiverCode: payload.receiverCode ? payload.receiverCode : null,
        importSubType: constants.TYPE_PNKS.PNKS_DIEU_CHUYEN,
      });
    }
  };

  closePrintPreview = () => {
    this.setState({
      printPreview: false,
      printPreviewContent: '',
    });
  };

  render() {
    const { ui, formData, configData } = this.props;
    return (
      <React.Fragment>
        {/* eslint-disable-next-line react/button-has-type */}
        <BasketSuggest
          openDl={this.state.openDl}
          onCloseDialog={this.onCloseDialog}
          ui={ui}
          isDialog={false}
        />
        <React.Fragment>
          <BasketSuggest
            openDl={this.state.openDl}
            onCloseDialog={this.onCloseDialog}
            ui={ui}
            isDialog={false}
          />
          <FormWrapper
            initialValues={formData}
            validationSchema={configData.validationSchema}
            enableReinitialize
            onSubmit={this.onSubmit}
            onInvalidSubmission={this.handleInvalidSubmission}
            render={formik => {
              this.formik = formik;
              return (
                <React.Fragment>
                  {this.form === constants.TYPE_FORM.CREATE && (
                    <ImportCreate
                      {...this.props}
                      formik={formik}
                      bottomBasket={this.bottomBasket}
                      bottomAsset={this.bottomAsset}
                      form={this.form}
                      onChangeDeliveryOrder={this.changeDeliveryOrder}
                      confirmRemoveRecord={this.confirmRemoveRecord}
                      getDoBasketDetail={this.onGetDoBasketDetail}
                      getDeliver={this.getDeliver}
                      changebasketLocatorTo={this.props.changebasketLocatorTo}
                      getToImportReceipt={this.onGetToImportReceipt}
                      setBasketDetails={this.setBasketDetails}
                      typeNewImport={this.typeNewImport}
                      bottomSection4={this.bottomSection4}
                    />
                  )}
                  {this.form === constants.TYPE_FORM.EDIT && (
                    <ImportEdit
                      {...this.props}
                      formik={formik}
                      bottomBasket={this.bottomBasket}
                      bottomAsset={this.bottomAsset}
                      form={this.form}
                      onChangeDeliveryOrder={this.changeDeliveryOrder}
                      confirmRemoveRecord={this.confirmRemoveRecord}
                      cellValueChange={this.cellValueChange}
                      getDoBasketDetail={this.onGetDoBasketDetail}
                      getDeliver={this.getDeliver}
                      getToImportReceipt={this.onGetToImportReceipt}
                      setBasketDetails={this.setBasketDetails}
                      typeNewImport={this.typeNewImport}
                      bottomSection4={this.bottomSection4}
                    />
                  )}
                  {this.form === constants.TYPE_FORM.VIEW && (
                    <ImportView
                      {...this.props}
                      formik={formik}
                      bottomBasket={this.bottomBasket}
                      bottomAsset={this.bottomAsset}
                      bottomSection4={this.bottomSection4}
                      form={this.form}
                      confirmRemoveRecord={this.confirmRemoveRecord}
                      getDoBasketDetail={this.onGetDoBasketDetail}
                      getDeliver={this.getDeliver}
                      print={this.onPrint}
                      rePrint={this.onRePrint}
                      preview={this.onPreview}
                      typeNewImport={this.typeNewImport}
                    />
                  )}
                </React.Fragment>
              );
            }}
          />
          <ConfirmationDialog
            ref={ref => {
              this.confirmRef = ref;
            }}
          />
        </React.Fragment>
        <PrintPreview
          content={this.state.printPreviewContent}
          open={this.state.printPreview}
          close={this.closePrintPreview}
        />
      </React.Fragment>
    );
  }
}

ImportedBaskets.propTypes = {
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
  setBtnSubmit: PropTypes.func,
  btnSubmit: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  formData: makeSelectImportedBaskets('formData'),
  configData: makeSelectImportedBaskets('config'),
  section2: makeSelectArrBasket(['formData', 'section2']),
  assetDetails: makeSelectArrBasket(['formData', 'assetDetails']),
  section3: makeSelectArrBasket(['formData', 'section3']),
  section4: makeSelectArrBasket(['formData', 'section4']),
  fakeDoBasketDetail: makeSelectArrBasket(['formData', 'fakeDoBasketDetail']),
  fakeBasketDetail: makeSelectArrBasket(['formData', 'fakeBasketDetail']),
  formOption: makeSelectImportedBaskets('formOption'),
  btnSubmit: makeSelectArrBasket(['formData', 'btnSubmit']),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onChangeSubtype: payload =>
      dispatch({ type: constants.CHANGE_SUBTYPE, payload }),
    onAddRow: payload => dispatch({ type: constants.ADD_ROW, payload }),
    onCreate: (payload, callback) =>
      dispatch({ type: constants.CREATE, payload, callback }),
    onUpdate: (payload, callback) =>
      dispatch({ type: constants.UPDATE, payload, callback }),
    onComplete: (payload, callback) =>
      dispatch({ type: constants.COMPLETE, payload, callback }),
    onUpdateDetailsCommand: payload =>
      dispatch({ type: constants.UPDATE_DETAILS_COMMAND, payload }),
    onShowWarning: mess => dispatch(showWarning(mess)),
    onChangeField: payload =>
      dispatch({ type: constants.CHANGE_FIELD, payload }),
    onChangeDeliveryOrder: (payload, data) =>
      dispatch({ type: constants.CHANGE_DELIVERY_ORDER, payload, data }),
    onInitFormData: (payload, callback) =>
      dispatch({ type: constants.GET_INIT_FORM_DATA, payload, callback }),
    onGetFromTurnToScale: payload =>
      dispatch({ type: constants.GET_FROM_TURN_TO_SCALE, payload }),
    onGetDeliveryOrder: payload =>
      dispatch({ type: constants.GET_DELIVERY_ORDER, payload }),
    onGetLocatorTo: (payload, callback) =>
      dispatch({ type: constants.GET_LOCATOR_TO, payload, callback }),
    onDeleteRow: (rowIndex, id, callback) =>
      dispatch({ type: constants.DELETE_ROW, rowIndex, id, callback }),
    onChangeBasketsCode: payload =>
      dispatch({ type: constants.CHANGE_GET_BASKETS_CODE, payload }),
    onChangeQuantity: data =>
      dispatch({ type: constants.CHANGE_QUANTITY, data }),
    getDoBasketDetail: (payload, data) =>
      dispatch({ type: constants.GET_DO_BASKET_DETAIL, payload, data }),
    onGetDeliver: payload => dispatch({ type: constants.GET_DELIVER, payload }),
    print: payload => dispatch({ type: constants.PRINT, payload }),
    preview: payload => dispatch({ type: constants.PRINT_PREVIEW, payload }),
    changebasketLocatorTo: payload =>
      dispatch({ type: constants.CHANGE_BASKET_LOCATOR_TO, payload }),
    getToImportReceipt: payload =>
      dispatch({ type: constants.GET_TO_IMPORT_RECEIPT, payload }),
    removeToImportReceipt: () =>
      dispatch({ type: constants.REMOVE_TO_IMPORT_RECEIPT }),
    setBtnSubmit: payload =>
      dispatch({ type: constants.SET_BTN_SUBMIT, payload }),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'importedBaskets', reducer });
const withSaga = injectSaga({ key: 'importedBaskets', saga });

export default compose(
  withStyles(styles),
  withConnect,
  withReducer,
  withSaga,
  withImmutablePropsToJs,
)(ImportedBaskets);
