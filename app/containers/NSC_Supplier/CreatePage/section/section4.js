import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { Field } from 'formik';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import Expansion from 'components/Expansion';
import InputControl from 'components/InputControl';
import CheckboxControl from 'components/CheckboxControl';

import { compose } from 'redux';

/* eslint-disable react/prefer-stateless-function */
export class StatusSection extends React.PureComponent {
  render() {
    const { classes, formik, disabled } = this.props;

    return (
      <Grid item xs={12} className={classes.section}>
        <Expansion
          title="IV. Thông tin trạng thái"
          content={
            <Grid container justify="space-between">
              <Grid item md={6} xs={12} className={classes.group}>
                <Grid container>
                  <Grid item xs={6}>
                    <Field
                      name="postingBlock"
                      label="PostingBlock"
                      component={CheckboxControl}
                      labelPlacement="end"
                      disabled={disabled}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      name="purchBlock"
                      label="PurchBlock"
                      component={CheckboxControl}
                      labelPlacement="end"
                      disabled={disabled}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={2} xs={12} className={classes.group}>
                <Field
                  label="Block function"
                  name="blockFunction"
                  component={InputControl}
                  onChange={formik.handleChange}
                  disabled={disabled}
                />
              </Grid>
              <Grid item md={4} xs={false}>
                <div> </div>
              </Grid>
            </Grid>
          }
        />
      </Grid>
    );
  }
}

StatusSection.propTypes = {
  classes: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
  /**
   * @formik props pass from Formik
   */
  formik: PropTypes.object,
};

export default compose()(withImmutablePropsToJS(StatusSection));
