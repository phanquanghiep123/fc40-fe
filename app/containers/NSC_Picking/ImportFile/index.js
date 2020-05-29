import React from 'react';
import * as PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  Typography,
  Grid,
  Paper,
  Link,
  MuiThemeProvider,
  createMuiTheme,
  withStyles,
} from '@material-ui/core';
import MuiButton from 'components/MuiButton';
import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import { Field, Form, Formik } from 'formik';
import { formatToNumber } from 'utils/numberUtils';
import { SUBMIT_TIMEOUT } from 'utils/constants';
import { debounce } from 'lodash';
import injectReducer from '../../../utils/injectReducer';
import injectSaga from '../../../utils/injectSaga';
import reducer from './reducer';
import saga from './saga';
import appTheme from '../../App/theme';
import InputControl from '../../../components/InputControl';
import * as actions from './actions';
import * as selectors from './selectors';
import { convertDateTimeString } from '../../App/utils';

const style = (theme = appTheme) => ({
  paper: {
    padding: `${theme.spacing.unit * 5}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 2}px`,
    marginBottom: theme.spacing.unit * 3,
  },
  inputContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  uploadBtn: {
    minWidth: '150px',
    marginTop: theme.spacing.unit * 2,
  },
  paperInfo: {
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 2}px`,
    marginBottom: theme.spacing.unit * 3,
    transition: 'all 300ms ease',
  },
});

const theme = createMuiTheme({
  ...appTheme,
  overrides: {
    MuiGrid: {
      item: {
        paddingTop: '0 !important',
      },
    },
  },
});

// Render File Info Row
function InfoRow(props) {
  return (
    <tr>
      <td style={{ paddingRight: '2rem' }}>{props.name}</td>
      <td>{props.value}</td>
    </tr>
  );
}

InfoRow.propTypes = {
  name: PropTypes.string,
  value: PropTypes.any,
};

// eslint-disable-next-line react/prefer-stateless-function
export class PickingImportFile extends React.PureComponent {
  componentDidMount() {
    // dispatch action
  }

  /**
   * Hiển thị số kèm theo đơn vị (mặc định: dòng)
   */
  getNumberUnit = (value, baseUnit = 'dòng') =>
    `${formatToNumber(value)} ${baseUnit}`;

  /**
   * Make form field attributes
   * @param pr
   */
  makeFormAttr = pr => {
    const { onFormValuesChange } = this.props;

    return {
      fileName: {
        name: 'fileName',
        label: 'File Chia Chọn Dự kiến (*)',
        value: pr.values.fileName,
        onChange: pr.handleChange,
        component: InputControl,
        disabled: true,
      },
      fileUpload: {
        name: 'fileUpload',
        type: 'file',
        accept: '.csv, .xls, .xlsx',
        value: pr.values.fileUpload,
        onChange: e => {
          pr.handleChange(e);
          onFormValuesChange();
          pr.setFieldValue('fileData', e.currentTarget.files[0]);
          pr.setFieldValue('fileName', e.currentTarget.files[0].name);
        },
        style: {
          display: 'none',
        },
      },
    };
  };

  render() {
    const {
      classes,
      fileInfo,
      showInfo,
      onSubmitFile,
      onDownloadFile,
    } = this.props;

    const formDefaultValues = {
      fileName: '', // store file name
      fileUpload: '', // handle upload and store file absolute path
      fileData: null, // store all file data uploaded
    };

    return (
      <React.Fragment>
        <Typography variant="h5" color="textPrimary" gutterBottom>
          Import File Chia Chọn Dự Kiến
        </Typography>

        <MuiThemeProvider theme={theme}>
          <Paper className={classes.paper} elevation={1}>
            <Formik
              enableReinitialize
              initialValues={formDefaultValues}
              validate={values => {
                const errors = {};
                // file name must match format ChiaDuKien_YYYYMMDD_version.xls|xlsx|csv
                if (values.fileName.length === 0) {
                  errors.fileName = 'Bạn chưa chọn file để tải lên';
                } else if (
                  !values.fileName.match(
                    /^ChiaDuKien_([12]\d{3})(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])_\d+\.(xls|xlsx|csv)$/g,
                  )
                ) {
                  errors.fileName =
                    'Chưa đúng định dạng "ChiaDuKien_YYYYMMDD_version.xls|xlsx|csv"';
                }
                return errors;
              }}
              validateOnChange
              onSubmit={debounce((values, formikActions) => {
                onSubmitFile(values);
                formikActions.setSubmitting(false);
              }, SUBMIT_TIMEOUT)}
              render={pr => {
                const formAttr = this.makeFormAttr(pr);
                return (
                  <Form style={{ marginBottom: '2rem' }}>
                    <Grid
                      container
                      spacing={40}
                      style={{ marginBottom: '-0.5rem' }}
                    >
                      <Grid item xs={12} md={6}>
                        <div className={classes.inputContainer}>
                          <Field {...formAttr.fileName} />
                          <MuiButton
                            component="label"
                            outline
                            className={classes.uploadBtn}
                          >
                            Chọn file
                            <input {...formAttr.fileUpload} />
                          </MuiButton>
                        </div>
                      </Grid>
                    </Grid>
                    <div>
                      <MuiButton
                        type="submit"
                        variant="contained"
                        color="primary"
                      >
                        Tải lên
                      </MuiButton>
                    </div>
                  </Form>
                );
              }}
            />
            {showInfo ? (
              <div>
                <Typography variant="body1" color="textPrimary" gutterBottom>
                  Kết Quả File Tải Lên
                </Typography>
                <Paper className={classes.paperInfo} elevation={1}>
                  <table>
                    <tbody>
                      <InfoRow name="Tên File" value={fileInfo.fileName} />
                      <InfoRow
                        name="Thời Điểm Tải Lên"
                        value={convertDateTimeString(fileInfo.importTime)}
                      />
                      <InfoRow
                        name="Thời Gian Xử Lý"
                        value={`${convertDateTimeString(
                          fileInfo.startTime,
                        )} - ${convertDateTimeString(fileInfo.endTime)}`}
                      />
                      <InfoRow
                        name="Tổng Số"
                        value={this.getNumberUnit(fileInfo.totalRecord)}
                      />
                      <InfoRow
                        name="Thành Công"
                        value={this.getNumberUnit(fileInfo.totalInsert)}
                      />
                      <InfoRow
                        name="Thất Bại"
                        value={this.getNumberUnit(fileInfo.errorRecord)}
                      />
                      <InfoRow
                        name="Danh Sách NSC"
                        value={fileInfo.processingOrg}
                      />
                      <InfoRow
                        name="Tải File"
                        value={
                          <Link
                            href="#tai-file"
                            onClick={e => {
                              e.preventDefault();
                              onDownloadFile(fileInfo.id, 1);
                            }}
                          >
                            {fileInfo.fileName}
                          </Link>
                        }
                      />
                      {fileInfo.errorRecord > 0 ? (
                        <InfoRow
                          name="Tải File Lỗi"
                          value={
                            <Link
                              href="#tai-file-loi"
                              style={{ color: 'brown' }}
                              onClick={e => {
                                e.preventDefault();
                                onDownloadFile(fileInfo.id, 2);
                              }}
                            >
                              {fileInfo.fileErrorName}
                            </Link>
                          }
                        />
                      ) : null}
                    </tbody>
                  </table>
                </Paper>
              </div>
            ) : null}
          </Paper>
        </MuiThemeProvider>
      </React.Fragment>
    );
  }
}

PickingImportFile.propTypes = {
  classes: PropTypes.object,
  fileInfo: PropTypes.object,
  showInfo: PropTypes.bool,
  onFormValuesChange: PropTypes.func,
  onSubmitFile: PropTypes.func,
  onDownloadFile: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  fileInfo: selectors.fileInfo(),
  showInfo: selectors.showInfo(),
});

export const mapDispatchToProps = dispatch => ({
  dispatch,
  onFormValuesChange: () => dispatch(actions.formValuesChange()),
  onSubmitFile: formValues => dispatch(actions.submitFile(formValues)),
  onDownloadFile: (id, fileType) =>
    dispatch(actions.downloadFile(id, fileType)),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'pickingImportFile', reducer });
const withSaga = injectSaga({ key: 'pickingImportFile', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withImmutablePropsToJS,
  withStyles(style()),
)(PickingImportFile);
