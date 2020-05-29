import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import classNames from 'classnames';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { HotKeys } from 'react-hotkeys';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import FormWrapper from 'components/FormikUI/FormWrapper';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import KEY_MAP from 'containers/App/keysmap';

import { alertInvalidWhenSubmit } from 'containers/NSC_BBGH/BBGHCreatePage/actions';
import validSchema from './Schema';
import { getInitPage, printBBGH } from './actions';
import * as constants from './constants';
import reducer from './reducer';
import styles from './styles';
import saga from './saga';
import { makeSelectBbghEdit } from './selectors';

import Section1 from './Section1';
import Section2 from './Section2';
import Section3 from './Section3';
import Section4 from './Section4';
import Section6 from './Section6';
import Section5 from './Section5';

import { TYPE_BBGH } from '../BBGHCreatePage/constants';
import { viewBasketSection } from '../BBGHCreatePage/basketLogicFunction';

class BBGHViewPage extends React.Component {
  componentWillMount() {
    const { id } = this.props.match.params;
    this.props.onGetInitPage(id);
  }

  handleInvalidSubmission = () => {
    this.props.onAlertInvalidWhenSubmit(
      'Biên bản chưa được điền đầy đủ thông tin vui lòng kiểm tra lại',
    );
  };

  onPrintBBGH = e => {
    e.preventDefault();
    this.props.onPrintBBGH(this.props.match.params.id, res => {
      const html = res;
      const win = window.open('', 'win', 'width="100%",height="100%"');
      if (win === null)
        throw Object({
          message:
            'Trình duyệt đang chặn popup trên trang này! Vui lòng bỏ chặn popup',
        });
      win.document.open('text/html', 'replace');
      win.document.write(html);
      win.document.close();
    });
  };

  exportExcel = e => {
    e.preventDefault();
    this.props.onExportExcel(this.props.match.params.id);
  };

  renderSection6 = formik => formik.values.shipperList.length > 0;

  /**
   * shortcut
   */

  render() {
    const { classes, bbghEdit } = this.props;
    const handlers = {
      [KEY_MAP.VIEW_BBGH.PRINT_BBGH]: this.onPrintBBGH,
    };

    return (
      <HotKeys
        keyMap={KEY_MAP.VIEW_BBGH}
        handlers={handlers}
        focused
        attach={document}
      >
        <FormWrapper
          enableReinitialize
          initialValues={bbghEdit}
          validationSchema={validSchema}
          onSubmit={() => {}}
          onInvalidSubmission={() => {}}
          render={formik => (
            <React.Fragment>
              <Grid container tabIndex="-1" style={{ outline: 0 }}>
                <Grid container justify="space-between">
                  <Grid item xl={8} lg={8} className={classes.titleBBGH}>
                    <Typography variant="h5" gutterBottom>
                      {formik.values.doType === TYPE_BBGH.NCC_TO_NSC
                        ? 'Đơn Đặt Hàng'
                        : 'Biên Bản Giao Hàng'}
                    </Typography>
                  </Grid>
                  <Grid item xl={4} lg={4} className={classes.btnPrint}>
                    <Grid container spacing={24} justify="flex-end">
                      <Grid item>
                        <Button
                          variant="contained"
                          color="primary"
                          className={classNames(classes.submit, classes.space)}
                          onClick={this.onPrintBBGH}
                        >
                          In BBGH
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          color="primary"
                          className={classNames(classes.submit, classes.space)}
                          onClick={this.exportExcel}
                        >
                          Xuất Excel
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} className={classes.section}>
                  <Section1 formik={formik} />
                </Grid>
                <Grid item xs={12} className={classes.section}>
                  <Section2 formik={formik} />
                </Grid>
                <Grid item xs={12} className={classes.section}>
                  <Section3 formik={formik} />
                </Grid>
                <Grid item xs={12} className={classes.section}>
                  <Section4
                    formik={formik}
                    classes={classes}
                    suggest={false}
                    isUpdate={3}
                  />
                </Grid>
                <Grid item xs={12} xl={6} lg={6} className={classes.section}>
                  {viewBasketSection(formik.values.doType) && (
                    <Section5 formik={formik} />
                  )}
                </Grid>
                <Grid item xs={12} className={classes.section}>
                  {this.renderSection6(formik) ? (
                    <Section6 formik={formik} />
                  ) : null}
                </Grid>
                <Grid
                  container
                  className={classNames(classes.groupButton, classes.section)}
                  justify="flex-end"
                >
                  <Button
                    type="button"
                    variant="contained"
                    className={classNames(classes.cancel, classes.space)}
                    onClick={() => this.props.history.goBack()}
                  >
                    Đóng
                  </Button>
                </Grid>
              </Grid>
            </React.Fragment>
          )}
        />
      </HotKeys>
    );
  }
}

BBGHViewPage.propTypes = {
  classes: PropTypes.object.isRequired,
  onGetInitPage: PropTypes.func,
  onExportExcel: PropTypes.func,
  match: PropTypes.object,
  bbghEdit: PropTypes.object,
  onAlertInvalidWhenSubmit: PropTypes.func,
  history: PropTypes.object,
  onPrintBBGH: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onGetInitPage: idBBGH => dispatch(getInitPage(idBBGH)),
    onAlertInvalidWhenSubmit: message =>
      dispatch(alertInvalidWhenSubmit(message)),
    onPrintBBGH: (id, callback) => dispatch(printBBGH(id, callback)),
    onExportExcel: id => dispatch({ type: constants.EXPORT_EXCEL, id }),
  };
}

const mapStateToProps = createStructuredSelector({
  bbghEdit: makeSelectBbghEdit(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'bbghView', reducer });
const withSaga = injectSaga({ key: 'bbghView', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(withStyles(styles)(withImmutablePropsToJS(withRouter(BBGHViewPage))));
