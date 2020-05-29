/* eslint-disable react/no-array-index-key */
import MuiButton from 'components/MuiButton';
import { compose } from 'redux';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { withStyles, Grid, DialogActions } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  VerticalBarSeries,
  Hint,
} from 'react-vis';
import appTheme from '../../../App/theme';

const style = () => ({
  btnContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '1rem',
    '& > *': {
      minWidth: 120,
      '&:not(:last-child)': {
        marginRight: '1rem',
      },
    },
  },
  causeFieldContainer: {
    display: 'flex',
    width: 300,
    marginRight: '1rem',
    '& > div': {
      marginBottom: '0 !important',
    },
  },
  fontBold: {
    fontWeight: 'bold',
  },
  centerAlign: {
    display: 'flex',
    justifyContent: 'center',
  },
  squareBorder: {
    display: 'flex',
    marginLeft: 20,
  },
  square: {
    height: 20,
    width: 20,
  },
  gridMargin: {
    marginTop: 30,
  },
  toolTipChart: {
    width: 200,
    padding: 3,
    fontSize: 13,
    color: 'black',
    fontWeight: 'bold',
    backgroundColor: appTheme.palette.background.default,
    opacity: 0.7,
    borderRadius: 10,
  },
});

class ChartPopup extends React.Component {
  state = {
    showValueChart: false,
  };

  componentDidMount() {}

  calChartWidth = data => {
    let width = 500;
    if (data[0] && data[0].data.length >= 25) {
      width = 2200;
    } else if (data[0] && data[0].data.length >= 20) {
      width = 2000;
    } else if (data[0] && data[0].data.length >= 15) {
      width = 1800;
    } else if (data[0] && data[0].data.length >= 10) {
      width = 1500;
    } else if (data[0] && data[0].data.length >= 8) {
      width = 1000;
    } else if (data[0] && data[0].data.length >= 4) {
      width = 700;
    } else if (data.length <= 2 && data[0].data.length <= 1) {
      width = 200;
    } else if (data.length <= 3 && data[0].data.length <= 2) {
      width = 300;
    } else {
      width = 500;
    }
    return width;
  };

  render() {
    const { classes, onClose, data } = this.props;
    const { showValueChart } = this.state;
    const chartWidth = this.calChartWidth(data);
    return (
      <div>
        <DialogTitle>
          BIỂU ĐỒ SỐ LƯỢNG HỦY SO VỚI TỔNG TỒN CỦA ĐƠN VỊ THEO NGÀY
        </DialogTitle>
        <DialogContent>
          <div>
            <XYPlot
              margin={{ bottom: 70, left: 70 }}
              xType="ordinal"
              width={chartWidth}
              height={300}
              colorType="literal"
            >
              <VerticalGridLines />
              <HorizontalGridLines />
              <XAxis />
              <YAxis tickFormat={v => `${v}%`} />
              {data.map((e, i) => (
                <VerticalBarSeries
                  onValueMouseOver={v => this.setState({ showValueChart: v })}
                  onSeriesMouseOut={() =>
                    this.setState({ showValueChart: false })
                  }
                  key={i}
                  color={e.color}
                  data={e.data}
                />
              ))}
              {showValueChart !== false && (
                <Hint value={showValueChart}>
                  <div className={classes.toolTipChart}>
                    <table>
                      <tbody>
                        <tr>
                          <td className={classes.tableWitdh}>Đơn vị:</td>
                          <td>{showValueChart.plant}</td>
                        </tr>
                        <tr>
                          <td className={classes.tableWitdh}>Tỉ lệ:</td>
                          <td>{showValueChart.y}%</td>
                        </tr>
                        <tr>
                          <td className={classes.tableWitdh}>Số lượng hủy:</td>
                          <td>{showValueChart.quantity}</td>
                        </tr>
                        <tr>
                          <td className={classes.tableWitdh}>Tổng tồn:</td>
                          <td>{showValueChart.inventory}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Hint>
              )}
            </XYPlot>
          </div>

          <div className={classes.centerAlign}>
            <Grid container spacing={24}>
              {data.map((element, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <div className={classes.squareBorder}>
                    <div
                      className={classes.square}
                      style={{ backgroundColor: element.color }}
                    />
                    <span style={{ marginLeft: 10 }}>{element.farm}</span>
                  </div>
                </Grid>
              ))}
            </Grid>
          </div>
        </DialogContent>
        <DialogActions>
          <div className={classes.btnContainer} style={{ marginBottom: 0 }}>
            <MuiButton outline onClick={onClose}>
              Đóng
            </MuiButton>
          </div>
        </DialogActions>
      </div>
    );
  }
}
ChartPopup.propTypes = {
  onClose: PropTypes.func,
  data: PropTypes.array,
  classes: PropTypes.object,
};

export default compose(withStyles(style()))(ChartPopup);
