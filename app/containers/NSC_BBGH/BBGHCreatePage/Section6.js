import React from 'react';
import PropTypes from 'prop-types';
import Expansion from 'components/Expansion';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import FormData from 'components/FormikUI/FormData';

import { columnDefsDeliver } from './header';
import PopupEditor from './PopupEditor';
import CellRenderer from './CellRenderer';
import { TYPE_BBGH } from './constants';

export class Section6 extends React.Component {
  state = { tabs: 0 };

  changeTabs = (event, value) => {
    this.setState({ tabs: value });
  };

  render() {
    const defaultColDef = {
      suppressMovable: true,
    };

    const { classes, formik } = this.props;
    const { tabs } = this.state;

    const gridStyle = { height: 'auto' };
    const gridProps = { context: this, domLayout: 'autoHeight' };

    return (
      <Expansion
        title={
          TYPE_BBGH.BASKET_DELIVERY_ORDER === this.props.typeBBGHSelected
            ? 'V. Thông Tin Bên Vận Chuyển'
            : 'VI. Thông Tin Bên Vận Chuyển'
        }
        rightActions={
          <Tabs
            classes={{
              root: classes.tabs,
            }}
            TabIndicatorProps={{
              classes: {
                root: classes.indicator,
                colorSecondary: classes.indicatorColor,
              },
            }}
            value={tabs}
            onChange={this.changeTabs}
          >
            {[
              { value: 0, label: 'Bên giao' },
              { value: 1, label: 'Bên nhận' },
            ].map(tab => (
              <Tab
                key={tab.value}
                disableRipple
                classes={{
                  root: classes.tab,
                  labelContainer: classes.tabLabel,
                }}
                label={tab.label}
              />
            ))}
          </Tabs>
        }
        content={
          tabs === 0 && (
            <FormData
              idGrid="grid-section6"
              name="shipperList"
              gridStyle={gridStyle}
              defaultColDef={defaultColDef}
              gridProps={gridProps}
              columnDefs={columnDefsDeliver}
              popupEditor={PopupEditor}
              cellRenderer={CellRenderer}
              ignoreSuppressColumns={['driver', 'drivingDuration']}
              {...formik}
            />
          )
        }
      />
    );
  }
}

Section6.propTypes = {
  classes: PropTypes.object,
  suppliers: PropTypes.array,
  leadtimes: PropTypes.array,
  /**
   * @formik props pass from Formik
   */
  formik: PropTypes.object,
};

export default Section6;
