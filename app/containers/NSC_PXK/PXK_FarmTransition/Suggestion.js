import React from 'react';
import DialogActions from '@material-ui/core/DialogActions';
import MuiButton from 'components/MuiButton';
import MuiTable from 'components/MuiTable';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { groupBy, sumBy } from 'lodash';
import FormSection from './FormSection';

const styleCell = {
  borderBottom: 'none',
};

const styleCellNormal = {
  borderTop: '1px solid rgba(224, 224, 224, 1)',
  borderBottom: 'none',
};

const stylePlaning = {
  borderLeft: '1px solid rgba(224, 224, 224, 1)',
  borderBottom: 'none',
};

const stylePlaningNormal = {
  borderTop: '1px solid rgba(224, 224, 224, 1)',
  borderLeft: '1px solid rgba(224, 224, 224, 1)',
  borderBottom: 'none',
};

export default class Suggestion extends React.Component {
  tableRef = null;

  handleTableReady = ref => {
    this.tableRef = ref;
  };

  onCancelClick = () => {};

  handleSubmitClick = () => {
    const selected = [];
    if (this.tableRef.state.data.length > 0) {
      this.tableRef.state.data.forEach(item => {
        if (item.tableData.checked) {
          console.log('----item----', item);
          selected.push({
            ...item,
            isNotSaved: true,
            processingType: 2000,
            processingTypeName: 'Sơ Chế',
          });
        }
      });
    }

    const obj = groupBy(selected, item => `${item.planningCodeValidate}`);
    const codes = [];
    Object.keys(obj).forEach(item => {
      if (
        sumBy(obj[item], 'inventoryQuantity') >
        obj[item][0].planningDivideQuantityValidate
      ) {
        codes.push(item);
      }
    });
    if (codes.length > 0) {
      // alert(`${codes}`);
      this.props.onShowWarning({
        title: 'Cảnh Báo',
        message: `Tổng Khối Lượng Tồn của các sản phẩm đã chọn lớn hơn Tổng Dự Kiến Chia ở mã kế hoạch ${codes.join(
          ', ',
        )}`,
        actions: [
          { text: 'Hủy' },
          {
            text: 'Đồng ý',
            color: 'primary',
            onClick: this.props.onHandleSubmitClick,
            payload: selected,
          },
        ],
      });
    } else {
      this.props.onHandleSubmitClick(selected);
    }
  };

  // componentDidMount() {
  //   this.props.onGetSuggest();
  // }

  render() {
    const {
      ui,
      classes,
      openDl,
      onControlDlClose,
      onGetSuggest,
      initValues,
      inventories,
      onResetSuggest,
      organizations,
    } = this.props;
    return (
      openDl && (
        <ui.Dialog
          title="Gợi Ý Từ Điều Phối"
          maxWidth="lg"
          fullWidth
          isDialog={false}
          customActionDialog={
            <DialogActions className={classes.actionButtons}>
              <Grid container justify="flex-end" spacing={24}>
                <Grid item>
                  <MuiButton outline onClick={onControlDlClose}>
                    Hủy Bỏ
                  </MuiButton>
                </Grid>
                <Grid item>
                  <MuiButton onClick={this.handleSubmitClick}>
                    Chọn Sản Phẩm
                  </MuiButton>
                </Grid>
              </Grid>
            </DialogActions>
          }
          openDl={openDl}
          content={
            <div>
              <FormSection
                onGetSuggest={onGetSuggest}
                initValues={initValues}
                onResetSuggest={onResetSuggest}
                organizations={organizations}
              />
              <MuiTable
                tableRef={this.handleTableReady}
                columns={[
                  { title: 'Mã tồn kho', field: 'productCode' },
                  { title: 'Kho', field: 'locatorName' },
                  { title: 'Tên Sản Phẩm', field: 'productName' },
                  { title: 'Batch', field: 'slotCode' },
                  { title: 'Khối Lượng Tồn', field: 'inventoryQuantity' },
                  { title: 'Đơn Vị', field: 'uom' },
                  {
                    title: 'Mã Kế Hoạch',
                    field: 'planningCode',
                    cellStyle: value =>
                      !value ? stylePlaning : stylePlaningNormal,
                  },
                  {
                    title: 'Tên Sản Phẩm',
                    field: 'productNameGeneral',
                    cellStyle: value => (!value ? styleCell : styleCellNormal),
                  },
                  {
                    title: 'Phân Loại Xử Lý',
                    field: 'processingTypeName',
                    cellStyle: value => (!value ? styleCell : styleCellNormal),
                  },
                  {
                    title: 'Tổng Dự Kiến Chia',
                    field: 'planningDivideQuantity',
                    cellStyle: value => (!value ? styleCell : styleCellNormal),
                  },
                ]}
                data={inventories}
                options={{
                  showTitle: false,
                  search: false,
                  exportButton: false,
                  selection: true,
                  paging: false,
                  showSelectAllCheckbox: false,
                  emptyRowsWhenPaging: false,
                }}
              />
            </div>
          }
        />
      )
    );
  }
}
Suggestion.propTypes = {
  classes: PropTypes.object,
  ui: PropTypes.object,
  initValues: PropTypes.object,
  inventories: PropTypes.array,
  onHandleSubmitClick: PropTypes.func,
  openDl: PropTypes.bool,
  onControlDlClose: PropTypes.func,
  // tableValue: PropTypes.array,
  organizations: PropTypes.array,
  onGetSuggest: PropTypes.func,
  onResetSuggest: PropTypes.func,
  onShowWarning: PropTypes.func,
};
