import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Form, Field, Formik } from 'formik';
import { createStructuredSelector } from 'reselect';
import {
  withStyles,
  createMuiTheme,
  MuiThemeProvider,
  Grid,
  Button,
  Tab,
  Tabs,
  AppBar,
  Typography,
} from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import { withSnackbar } from 'notistack';
import appTheme from '../../../App/theme';
import * as selectors from '../selectors';
import Expansion from '../../../../components/Expansion';
import InputControl from '../../../../components/InputControl';
import CheckboxControl from '../../../../components/CheckboxControl';
import MuiSelectAsync from '../../../../components/MuiSelect/Async';
import * as actions from '../actions';
import message from './messages';
import ConfirmationDialog from '../../../../components/ConfirmationDialog';
import Schema from '../Schema';

const snackbarOptions = {
  variant: 'error',
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'left',
  },
};

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
  tabs: {
    padding: 10,
  },
  tab: {
    minWidth: 100,
    minHeight: 36,
  },
  tabLabel: {
    [theme.breakpoints.up('md')]: {
      padding: '6px 12px',
    },
  },
  indicator: {
    height: '100%',
    borderRadius: 999,
  },
  indicatorColor: {
    backgroundColor: 'rgba(71, 111, 144, 0.2)',
  },
  bar: {
    backgroundColor: '#fff',
    color: 'black',
    boxShadow: '0px 0px 0px 0px',
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
    // this.props.onEmailFilter();
  }

  state = {
    tabs: 0,
  };

  changeTabs = (event, value) => {
    this.setState({ tabs: value });
  };

  showConfirm = options => {
    if (this.confirmRef) {
      this.confirmRef.showConfirm(options);
    }
  };

  pushMessage = (msg, option = snackbarOptions) => {
    this.props.enqueueSnackbar(msg, option);
  };

  onGoBack = () => {
    this.showConfirm({
      message: message.GO_BACK,
      title: message.NOT_SAVE_DATA,
      actions: [
        { text: 'Hủy' },
        {
          text: 'Đồng ý',
          color: 'primary',
          onClick: () => this.props.history.goBack(),
        },
      ],
    });
  };

  render() {
    const {
      classes,
      formDefaultValues,
      onFormSubmit,
      onGetEmailAuto,
    } = this.props;
    const { carbonCopies } = formDefaultValues;
    const { tabs } = this.state;
    const formAttr = pr => ({
      subject: {
        name: 'subject',
        label: 'Subject',
        required: true,
        component: InputControl,
        value: pr.values.subject,
        onChange: pr.handleChange,
        disabled: true,
      },
      header: {
        name: 'header',
        label: 'Header',
        component: InputControl,
        multiline: true,
        required: true,
        rowsMax: 5,
        value: pr.values.header,
        onChange: pr.handleChange,
        disabled: true,
      },
      body: {
        name: 'body',
        label: 'Message',
        component: InputControl,
        multiline: true,
        required: true,
        value: pr.values.body,
        onChange: pr.handleChange,
      },
      footer: {
        name: 'footer',
        label: 'Footer',
        component: InputControl,
        multiline: true,
        required: true,
        rowsMax: 20,
        value: pr.values.footer,
        onChange: pr.handleChange,
        disabled: true,
      },
      isActive: {
        name: 'isActive',
        label: 'isActive',
        component: CheckboxControl,
        value: pr.values.isActive,
        labelPlacement: 'end',
      },
    });

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
          validationSchema={Schema}
          render={pr => (
            <div className={classes.expansionContainer}>
              <Expansion
                title="I. Thông Tin Chung"
                content={
                  <Form>
                    <Grid container spacing={24}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" gutterBottom>
                          Mail.OrderNCC
                        </Typography>
                        <Field {...formAttr(pr).subject} />
                        <Field {...formAttr(pr).header} />
                        <Field {...formAttr(pr).body} />
                        <Field {...formAttr(pr).footer} />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <div className={classes.tab}>
                          <AppBar position="static" className={classes.bar}>
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
                              {carbonCopies.map(tab => (
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
                          </AppBar>
                          <Grid container spacing={24}>
                            <Grid item xs={12}>
                              <Field
                                name={`carbonCopies[${tabs}].emails`}
                                component={MuiSelectAsync}
                                valueKey="email"
                                labelKey="email"
                                sublabelKey="name"
                                isMulti
                                isMultiline
                                isCreatable
                                promiseOptions={onGetEmailAuto}
                                validBeforeChange={options => {
                                  const optionOnchange = options.filter(
                                    (ele, ind) =>
                                      ind ===
                                      options.findIndex(
                                        elem => elem.email === ele.email,
                                      ),
                                  );
                                  if (optionOnchange.length < options.length) {
                                    this.pushMessage(message.EXIST_EMAIL);
                                    return false;
                                  }
                                  const newOption = options[options.length - 1];
                                  if (
                                    !newOption ||
                                    newOption.email.match(
                                      /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i,
                                    )
                                  ) {
                                    return true;
                                  }
                                  this.pushMessage(message.EMAIL_VALIDATE);
                                  return false;
                                }}
                              />
                            </Grid>
                          </Grid>
                        </div>
                      </Grid>
                    </Grid>
                    <Grid container spacing={40}>
                      <Grid item xs={12}>
                        <div className={classes.btnContainer}>
                          <Button
                            type="button"
                            variant="contained"
                            onClick={() => this.onGoBack()}
                            className={classes.resetBtn}
                          >
                            Đóng
                          </Button>
                          <Button
                            className={classes.btn}
                            type="submit"
                            variant="contained"
                            color="primary"
                            onClick={pr.handleSubmit}
                          >
                            Lưu
                          </Button>
                        </div>
                      </Grid>
                    </Grid>
                    <ConfirmationDialog
                      ref={ref => {
                        this.confirmRef = ref;
                      }}
                    />
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
  formData: PropTypes.object,
  formDefaultValues: PropTypes.object,
  onFormSubmit: PropTypes.func,
  // onEmailFilter: PropTypes.func,
  onFetchFormData: PropTypes.func,
  onGetEmailAuto: PropTypes.func,
  enqueueSnackbar: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  formData: selectors.formData(),
  formDefaultValues: selectors.formDefaultValues(),
  suggestEmail: selectors.suggestEmail(),
});

function mapDispatchToProps(dispatch) {
  return {
    onFetchFormData: formValues => dispatch(actions.fetchFormData(formValues)),
    onFormSubmit: formValues => dispatch(actions.submitForm(formValues)),
    // onEmailFilter: formValues => dispatch(actions.filterEmail(formValues)),
    onGetEmailAuto: (inputText, callback) =>
      dispatch(actions.getEmailAuto(inputText, callback)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withImmutablePropsToJS,
  withRouter,
  withSnackbar,
  withStyles(styles),
)(FormSection);
