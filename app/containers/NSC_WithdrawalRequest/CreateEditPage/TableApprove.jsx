import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { getIn } from 'formik';
import { debounce } from 'lodash';

import {
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@material-ui/core';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';

import { SEARCH_DEBOUNCE_DELAY } from 'utils/constants';
import FormData from 'components/FormikUI/FormData';
import Expansion from 'components/Expansion';
import InputControl from 'components/InputControl';
import { MuiButton } from 'components/MuiButton';
import ButtonWhite from 'components/Button/ButtonWhite';

// import { PATH_GATEWAY } from 'utils/request';

import { APPROVAL_DETAIL_KEY } from './reducer';
import { TEXT_ALIGN_RIGHT_CLASS, APPROVE_REQUEST_API } from './constants';
import { post, formatDatetimeTableCell } from './utils';

export default class TableApprove extends PureComponent {
  state = {
    isApproved: '1', // 1 === approve, 2 === disapprove
    note: '',
  };

  changeApproval = ev => {
    this.setState({
      isApproved: ev.target.value,
    });
  };

  changeNote = ev => {
    this.setState({
      note: ev.target.value,
    });
  };

  // #region api request

  submitApprovement = debounce(
    async () => {
      const { isApproved, note } = this.state;
      post(
        APPROVE_REQUEST_API,
        {
          id: this.props.id,
          isAgreement: isApproved === '1',
          note,
        },
        response => {
          this.props.notifySuccess(response.message);
          this.props.history.push('/danh-sach-ban-xa');
        },
      );
    },
    SEARCH_DEBOUNCE_DELAY,
    { leading: true },
  );

  // #endregion

  // #region column defs

  columns = [
    {
      headerName: 'STT',
      field: 'stt',
      width: 40,
      editable: false,
      suppressSizeToFit: true,
      cellClass: TEXT_ALIGN_RIGHT_CLASS,
    },
    {
      headerName: 'Người phê duyệt',
      field: 'approverName',
      tooltipField: 'approverName',
    },
    {
      headerName: 'Ý kiến',
      field: 'agreementName',
      tooltipField: 'agreementName',
    },
    {
      headerName: 'Ghi chú',
      field: 'note',
      tooltipField: 'note',
    },
    {
      headerName: 'Thời gian cập nhật',
      field: 'approvalDate',
      tooltipValueGetter: formatDatetimeTableCell,
      valueFormatter: formatDatetimeTableCell,
    },
  ];

  defaultColDef = {
    editable: false,
    resizable: false,
    suppressMovable: true,
    cellEditorFramework: undefined,
  };
  // #endregion

  render() {
    const { isApproved, note } = this.state;
    const { classes, formik, back, isApprovePage, userId } = this.props;

    const { values } = formik;

    const isApprovingLevel1 =
      userId === values.approverLevel1 && values.level === 1;

    const isApprovingLevel2 =
      userId === values.approverLevel2 && values.level === 2;

    const canApprove = isApprovingLevel1 || isApprovingLevel2;

    const data = getIn(values, APPROVAL_DETAIL_KEY, []);

    return (
      <Fragment>
        <Grid item md={12}>
          <Expansion
            title="III. Thông tin phê duyệt"
            content={
              <Fragment>
                <FormData
                  name={APPROVAL_DETAIL_KEY}
                  gridStyle={{ height: 200 }}
                  idGrid="grid-withdrawal-request-approval-info"
                  /**
                   * Props Formik
                   */
                  values={formik.values}
                  errors={formik.errors}
                  touched={formik.touched}
                  setFieldValue={formik.setFieldValue}
                  setFieldTouched={formik.setFieldTouched}
                  updateFieldArrayValue={formik.updateFieldArrayValue}
                  /**
                   * Props Ag-Grid
                   */
                  columnDefs={this.columns}
                  defaultColDef={this.defaultColDef}
                  onGridReady={this.onGridReady}
                  rowData={data}
                  gridProps={{
                    context: this,
                    suppressScrollOnNewData: true,
                    suppressHorizontalScroll: true,
                  }}
                />

                {isApprovePage && (
                  <Grid
                    container
                    spacing={40}
                    style={{ marginBottom: '-0.5rem' }}
                  >
                    <Grid item xs={6} lg={3}>
                      <FormControl
                        component="fieldset"
                        className="classes.formControl"
                      >
                        <FormLabel component="legend">Phê duyệt</FormLabel>
                        <RadioGroup
                          aria-label="Approve"
                          name="approve"
                          value={isApproved}
                          onChange={this.changeApproval}
                          row
                        >
                          <FormControlLabel
                            value="1"
                            control={<Radio />}
                            label="Đồng ý"
                            disabled={!canApprove}
                          />
                          <FormControlLabel
                            value="0"
                            control={<Radio />}
                            label="Không đồng ý"
                            disabled={!canApprove}
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <InputControl
                        field={{
                          name: 'approverNote',
                          value: note,
                        }}
                        label="Ghi chú"
                        onChange={this.changeNote}
                        multiline
                        disabled={!canApprove}
                      />
                    </Grid>
                  </Grid>
                )}
              </Fragment>
            }
          />
        </Grid>

        {/* eslint-disable prettier/prettier */}
        {isApprovePage && (
          <Grid
            container
            spacing={16}
            justify="flex-end"
            className={classes.btnContainer}
          >
            <Grid item>
              <ButtonWhite text="Quay lại" onClick={back} />
            </Grid>
            {canApprove && (
              <Grid item>
                <MuiButton classes={classes} onClick={this.submitApprovement}>
                    Lưu
                </MuiButton>
              </Grid>
            )}
          </Grid>
        )}
        {/* eslint-enable prettier/prettier */}
      </Fragment>
    );
  }
}

TableApprove.propTypes = {
  classes: PropTypes.object,
  formik: PropTypes.object,
  history: PropTypes.object,

  back: PropTypes.func,
  // showConfirmation: PropTypes.func,
  notifySuccess: PropTypes.func,

  // isCreatePage: PropTypes.bool,
  // isEditPage: PropTypes.bool,
  // isViewPage: PropTypes.bool,
  isApprovePage: PropTypes.bool,

  id: PropTypes.string,
  userId: PropTypes.string,
};
