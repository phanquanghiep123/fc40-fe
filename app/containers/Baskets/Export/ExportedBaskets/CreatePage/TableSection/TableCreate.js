import React from 'react';
import FormData from 'components/FormikUI/FormData';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import Expansion from 'components/Expansion';
import ConfirmationDialog from 'components/ConfirmationDialog';
import { getRowStyle } from 'utils/index';
import PinnedRowRenderer from 'components/FormikUI/PinnedRowRenderer';
import { sumBy } from 'utils/numberUtils';
import Button from '../Button';
import { defaultColDef } from '../Config';
import DialogWrapper from '../Dialog';

// eslint-disable-next-line react/prefer-stateless-function
export default class TableCreate extends React.PureComponent {
  state = {
    openDialog: false,
  };

  isCreate = () => true;

  isEdit = () => false;

  isView = () => false;

  handleDialogOpen = () => {
    this.setState({ openDialog: true });
  };

  handleDialogClose = () => {
    this.setState({ openDialog: false });
  };

  confirmRemoveRecord(rowIndex) {
    const { onDeleteRowServer, dataValues, onDeleteRow } = this.props;
    this.showConfirm({
      message:
        'Thông tin phiếu xuất bị xóa không thể khôi phục! Bạn chắc chắn muốn xóa?',
      actions: [
        { text: 'Hủy' },
        {
          text: 'Đồng ý',
          color: 'primary',
          onClick: () => {
            if (dataValues.basketDocumentDetails[rowIndex].id) {
              onDeleteRowServer(
                dataValues.basketDocumentDetails[rowIndex].id,
                rowIndex,
              );
            } else onDeleteRow(rowIndex);
          },
        },
      ],
    });
  }

  showConfirm = options => {
    if (this.confirmRef) {
      this.confirmRef.showConfirm(options);
    }
  };

  onGridReady = params => {
    this.gridApi = params.api;
  };

  onNewColumnsLoaded = () => {
    if (this.gridApi) {
      this.gridApi.sizeColumnsToFit();
    }
  };

  bottomRowData = () => {
    const basketDetails = this.props.formik.values.basketDocumentDetails;
    return [
      {
        totalCol: true,
        basketName: 'Tổng',
        inventoryQuantity: sumBy(basketDetails, 'inventoryQuantity'),
        deliveryQuantity: sumBy(basketDetails, 'deliveryQuantity'),
        quantityBorrowByVendo: sumBy(basketDetails, 'quantityBorrowByVendo'),
      },
    ];
  };

  render() {
    const {
      formik,
      onAddRows,
      classes,
      ui,
      history,
      match,
      config,
    } = this.props;
    return (
      <Expansion
        title="II. Thông Tin Khay Sọt"
        rightActions={
          <div>
            {config.renderSuggest && (
              <Button
                text="Gợi ý KS đang mượn"
                outline
                className={classes.actions}
                onClick={this.handleDialogOpen}
              />
            )}
            {!this.isView() && (
              <Button
                icon="note_add"
                outline
                onClick={onAddRows}
                className={classes.actions}
              />
            )}
          </div>
        }
        content={
          <React.Fragment>
            <FormData
              name="basketDocumentDetails"
              gridStyle={{ height: 250 }}
              rowData={formik.values.basketDocumentDetails}
              columnDefs={config.columnDefs}
              defaultColDef={defaultColDef}
              gridProps={{
                context: this,
                pinnedBottomRowData: this.bottomRowData(),
                frameworkComponents: {
                  customPinnedRowRenderer: PinnedRowRenderer,
                },
                // getRowStyle: this.getRowStyle,
                // onCellValueChanged: this.onCellValueChanged,
                onNewColumnsLoaded: this.onNewColumnsLoaded,
                suppressScrollOnNewData: true,
                suppressHorizontalScroll: true,
                getRowStyle,
              }}
              onGridReady={this.onGridReady}
              {...formik}
            />
            <ConfirmationDialog
              ref={ref => {
                this.confirmRef = ref;
              }}
            />
            <DialogWrapper
              // openDl={openDl}
              open={this.state.openDialog}
              onClose={this.handleDialogClose}
              ui={ui}
              history={history}
              match={match}
            />
          </React.Fragment>
        }
      />
    );
  }
}
TableCreate.propTypes = {};
