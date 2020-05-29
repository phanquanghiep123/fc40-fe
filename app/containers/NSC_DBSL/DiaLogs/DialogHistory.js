import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Button, Grid, Typography } from '@material-ui/core';
import PaperPanel from 'components/PaperPanel';
import ArrowDownwardRoundedIcon from '@material-ui/icons/ArrowDownwardRounded';
import ArrowUpwardRoundedIcon from '@material-ui/icons/ArrowUpwardRounded';
import { convertDateString } from '../../App/utils';
import { constSchema } from '../ListPage/TableSection/schema';
import { formatToCurrency } from '../../../utils/numberUtils';
class DialogHistory extends React.Component {
  onClose = () => {
    const { onClose } = this.props;
    onClose();
  };

  renderArrow = value => {
    let color = 'transparent';
    switch (value) {
      case 1:
        color = '#479c52';
        return (
          <ArrowUpwardRoundedIcon
            style={{
              color,
              margin: '0px 50px -5px 50px',
            }}
          />
        );
      case 2:
        color = '#c10f30';
        return (
          <ArrowDownwardRoundedIcon
            style={{
              color,
              margin: '0px 50px -5px 50px',
            }}
          />
        );
      default:
        return (
          <ArrowDownwardRoundedIcon
            style={{
              color,
              margin: '0px 50px -5px 50px',
            }}
          />
        );
    }
  };

  render() {
    const { ui, openDl, classes, DBSL } = this.props;
    const forcastingQuantitys = DBSL.historyForecastingQuantities;
    return (
      <React.Fragment>
        <ui.Dialog
          {...ui.props}
          fullScreen
          title="Lịch Sử Dự Báo Sản Lượng"
          content={
            <div>
              <div>
                <PaperPanel>
                  <div id="alert-dialog-slide-description">
                    <Grid container style={{ marginBottom: '50px' }}>
                      <Grid item lg={5} xs={12}>
                        <Typography>
                          LSX: {DBSL[constSchema.productionOrderCode]}
                        </Typography>
                        <Typography>
                          Mã sản phẩm: {DBSL[constSchema.productCode]}
                        </Typography>
                      </Grid>

                      <Grid item lg={7} xs={12}>
                        <Typography>
                          Ngày thu hoạch:{' '}
                          {convertDateString(DBSL[constSchema.finishDate])}
                        </Typography>
                        <Typography>
                          Tên sản phẩm: {DBSL[constSchema.productName]}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container>
                      {forcastingQuantitys.map((forcastingQuantity, index) => {
                        const plannedDate = moment(
                          forcastingQuantity[
                            constSchema.forcastingQuantityItem.plannedDate
                          ],
                        ).format('DD/MM/YYYY  h:mm:ss');

                        const plannedQuantity =
                          forcastingQuantity[
                            constSchema.forcastingQuantityItem.plannedQuantity
                          ];
                        const basicUnit =
                          forcastingQuantity[
                            constSchema.forcastingQuantityItem.basicUnit
                          ];

                        return (
                          <Grid
                            item
                            xs={12}
                            style={{ marginBottom: '30px' }}
                            key={index.toString()}
                          >
                            <Typography>{plannedDate}</Typography>
                            <Typography>
                              {`${
                                plannedQuantity
                                  ? formatToCurrency(plannedQuantity)
                                  : ''
                              } ${basicUnit} `}
                              {this.renderArrow(forcastingQuantity.asc)}
                              {forcastingQuantity.plannedBy}
                            </Typography>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </div>
                </PaperPanel>
              </div>
              <div className={classes.btnContainer}>
                <Button
                  className={classes.cancelBtn}
                  variant="contained"
                  onClick={() => this.onClose()}
                >
                  Đóng
                </Button>
              </div>
            </div>
          }
          openDl={openDl}
          isDialog={false}
          customActionDialog
          fullWidth
          maxWidth="md"
        />
      </React.Fragment>
    );
  }
}
DialogHistory.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  openDl: PropTypes.bool,
  DBSL: PropTypes.object,
};

export default DialogHistory;
