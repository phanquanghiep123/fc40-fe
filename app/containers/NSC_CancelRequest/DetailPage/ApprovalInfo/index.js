/* eslint-disable indent */
import React, { Component } from 'react';
import { compose } from 'redux';
import * as PropTypes from 'prop-types';
import {
  withStyles,
  createMuiTheme,
  MuiThemeProvider,
  Grid,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
} from '@material-ui/core';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { Field } from 'formik';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import { withRouter } from 'react-router-dom';
import appTheme from '../../../App/theme';
import commonStyles from '../../../../components/StyleCommon/styles';
import Expansion from '../../../../components/Expansion';
import FormData from '../../../../components/FormikUI/FormData';
import { defaultColDef, makeColumnDefs } from './columnDefs';
import InputControl from '../../../../components/InputControl';
import { getUrlParams } from '../../../App/utils';
// import * as actions from '../actions';

const style = () => ({
  formControl: {
    margin: theme.spacing.unit * 3,
  },
  group: {
    display: 'flex',
    flexDirection: 'row',
  },
});

const theme = createMuiTheme({
  ...appTheme,
  overrides: {},
});

// eslint-disable-next-line react/prefer-stateless-function
class ApprovalSection extends Component {
  render() {
    const { classes, pageType, formik, history } = this.props;
    const { isBasket } = getUrlParams(history);
    const columnDefs = makeColumnDefs();

    let titleNumbering = 'III';
    if (isBasket) titleNumbering = 'IV';
    if (isBasket && pageType.edit) titleNumbering = 'V';

    return (
      <MuiThemeProvider theme={theme}>
        <div style={{ marginBottom: '1rem' }}>
          <Expansion
            title={`${titleNumbering}. THÔNG TIN PHÊ DUYỆT`}
            content={
              <React.Fragment>
                <FormData
                  name="approvalInfo"
                  idGrid="approvalInfo"
                  gridStyle={{ height: 150 }}
                  gridProps={{
                    context: this,
                    suppressMovable: true,
                    suppressScrollOnNewData: true,
                    suppressHorizontalScroll: true,
                  }}
                  rowData={
                    formik.values.approvalInfo ? formik.values.approvalInfo : []
                  }
                  columnDefs={columnDefs}
                  defaultColDef={defaultColDef}
                  ignoreSuppressColumns={['productCode', 'cause']}
                  {...formik} // pass formik props into agGrid
                />
                {pageType.approve ? (
                  <Grid
                    container
                    spacing={40}
                    style={{ marginBottom: '-0.5rem' }}
                  >
                    <Grid item xs={6} lg={3}>
                      <FormControl
                        component="fieldset"
                        className={classes.formControl}
                      >
                        <FormLabel component="legend">Phê duyệt</FormLabel>
                        <RadioGroup
                          aria-label="Approve"
                          name="approve"
                          className={classes.group}
                          value={formik.values.approve}
                          onChange={formik.handleChange}
                        >
                          <FormControlLabel
                            value="1"
                            control={<Radio />}
                            label="Đồng ý"
                          />
                          <FormControlLabel
                            value="0"
                            control={<Radio />}
                            label="Không đồng ý"
                          />
                        </RadioGroup>
                        {formik.errors.approve && (
                          <div style={commonStyles(appTheme).errorMessage}>
                            {formik.errors.approve}
                          </div>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <Field
                        name="approverNote"
                        label="Ghi chú"
                        value={formik.values.approverNote}
                        onChange={formik.handleChange}
                        component={InputControl}
                        multiline
                      />
                    </Grid>
                  </Grid>
                ) : null}
              </React.Fragment>
            }
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

ApprovalSection.propTypes = {
  classes: PropTypes.object,
  pageType: PropTypes.object,
  formik: PropTypes.object,
  history: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  //
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withRouter,
  withImmutablePropsToJs,
  withStyles(style()),
)(ApprovalSection);
