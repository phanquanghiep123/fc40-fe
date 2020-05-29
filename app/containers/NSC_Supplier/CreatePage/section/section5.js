import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { Field } from 'formik';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import Expansion from 'components/Expansion';
import InputControl from 'components/InputControl';

import { compose } from 'redux';

/* eslint-disable react/prefer-stateless-function */
export class NoteSection extends React.PureComponent {
  render() {
    const { classes, formik, disabled } = this.props;

    return (
      <Grid item xs={12} className={classes.section}>
        <Expansion
          title="V. Ghi chú"
          content={
            <Grid container justify="space-between">
              <Grid
                item
                lg={12}
                xl={12}
                md={12}
                xs={12}
                className={classes.group}
              >
                <Field
                  name="notes"
                  label="Ghi Chú"
                  component={InputControl}
                  onChange={formik.handleChange}
                  disabled={disabled}
                />
              </Grid>
            </Grid>
          }
        />
      </Grid>
    );
  }
}

NoteSection.propTypes = {
  classes: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
  /**
   * @formik props pass from Formik
   */
  formik: PropTypes.object,
};

export default compose()(withImmutablePropsToJS(NoteSection));
