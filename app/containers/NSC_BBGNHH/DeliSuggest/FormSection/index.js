import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Form, Formik } from 'formik';
import { createStructuredSelector } from 'reselect';
import {
  withStyles,
  createMuiTheme,
  MuiThemeProvider,
  Grid,
  Button,
} from '@material-ui/core';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import appTheme from '../../../App/theme';
import * as selectors from '../selectors';
import * as actions from '../actions';
import Expansion from '../../../../components/Expansion';

const styles = theme => ({
  expansionContainer: {
    marginBottom: theme.spacing.unit * 3,
  },
  paper: {
    height: '100%',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px`,
  },
  btnContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    '& :not(:last-child)': {
      marginRight: theme.spacing.unit * 3,
    },
  },
  btn: {
    margin: 'unset',
  },
});

const muiTheme = (theme = appTheme) =>
  createMuiTheme({
    ...theme,
    overrides: {
      MuiButton: {
        label: {
          margin: '0 !important',
          padding: `${theme.spacing.unit / 3}px ${theme.spacing.unit * 3}px`,
          minWidth: 100,
        },
      },
    },
  });

export class FormSection extends React.Component {
  componentDidMount() {
    this.props.onFetchFormData(this.props.formDefaultValues);
  }

  /* DeliSuggest Start */
  onPopupOpen = ({ documentCode }) => {
    this.props.onPopupOpen(documentCode);
  };

  /* DeliSuggest End */
  render() {
    const { classes, formDefaultValues, onFormSubmit } = this.props;
    return (
      <MuiThemeProvider theme={muiTheme}>
        <Formik
          enableReinitialize
          initialValues={formDefaultValues}
          onSubmit={(values, formikActions) => {
            onFormSubmit(values);
            formikActions.setSubmitting(false);
          }}
          onReset={(values, formikActions) => {
            formikActions.setValues({ ...formDefaultValues });
            onFormSubmit({ ...formDefaultValues });
          }}
          render={pr => (
            <div className={classes.expansionContainer}>
              <Expansion
                title="I. Thông Tin Chung"
                content={
                  <Form>
                    <Grid container spacing={40}>
                      <Grid item xs={12}>
                        <div className={classes.btnContainer}>
                          <Button
                            type="button"
                            variant="contained"
                            onClick={() => this.onPopupOpen(pr)}
                            className={classes.resetBtn}
                          >
                            Gợi ý từ Deli
                          </Button>
                        </div>
                      </Grid>
                    </Grid>
                  </Form>
                }
              />
            </div>
          )}
        />
      </MuiThemeProvider>
    );
  }
}

FormSection.propTypes = {
  classes: PropTypes.object,
  formDefaultValues: PropTypes.object,
  onFormSubmit: PropTypes.func,
  onFetchFormData: PropTypes.func,
  onPopupOpen: PropTypes.func,
  context: PropTypes.shape({
    onWeightPopupOpen: PropTypes.func,
  }),
};

const mapStateToProps = createStructuredSelector({
  formData: selectors.formData(),
  formDefaultValues: selectors.formDefaultValues(),
  formSubmittedValues: selectors.formSubmittedValues(),
  formIsSubmitted: selectors.formIsSubmitted(),
  tableData: selectors.tableData(),
});

function mapDispatchToProps(dispatch) {
  return {
    onFormSubmit: formValues => dispatch(actions.submitForm(formValues)),
    onFetchFormData: formValues => dispatch(actions.fetchFormData(formValues)),
    onPopupOpen: documentId => dispatch(actions.openPopup(documentId)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withImmutablePropsToJS,
  withStyles(styles),
)(FormSection);
