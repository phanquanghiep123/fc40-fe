import React from 'react';
import MuiButton from 'components/MuiButton';
import InputControl from 'components/InputControl';
import PropTypes from 'prop-types';
import WeightDialog from './index';
import weightSchema from './SampleSchema';
export default class Test extends React.Component {
  state = { openDl: false };

  openDl = () => {
    this.setState({ openDl: true });
  };

  closeDialog = () => {
    this.setState({ openDl: false });
  };

  formAttr = [
    {
      name: 'productCode',
      label: 'Mã Sản Phẩm',
      component: InputControl,
    },
    {
      name: 'productName',
      label: 'Tên Sản Phẩm',
      component: InputControl,
    },
  ];

  render() {
    const { ui } = this.props;
    return (
      <React.Fragment>
        <WeightDialog
          openDl={this.state.openDl}
          closeDialog={this.closeDialog}
          ui={ui}
          weightSchema={weightSchema}
          section1Attr={this.formAttr}
          onSubmitWeight={(value, callback) => {
            console.log(value);
            callback();
          }}
          ignoreCustomer={false}
        />
        <MuiButton onClick={this.openDl}>Test</MuiButton>
      </React.Fragment>
    );
  }
}

Test.propTypes = {
  ui: PropTypes.object.isRequired,
};
