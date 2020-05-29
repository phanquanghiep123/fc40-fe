import React from 'react';
import MuiTable from 'components/MuiTable';
import MuiButton from 'components/MuiButton';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
export default class BasketSuggest extends React.PureComponent {
  state = {
    selected: null,
  };

  selectionChange = () => {
    // this.setState({ selected });
  };

  commitSelected = () => {
    this.props.suggest(this.state.selected);
  };

  render() {
    const { ui, openDl, onCloseDialog } = this.props;
    return (
      <ui.Dialog
        maxWidth="md"
        title="Danh Sách Khay Sọt Đang Mượn"
        fullWidth
        openDl={openDl}
        content={
          <div>
            <Paper style={{ padding: 24 }}>
              <Grid container spacing={24}>
                <Grid item md={6}>
                  <TextField label="Đơn Vị Cho Mượn" fullWidth disabled />
                </Grid>
                <Grid item md={6}>
                  <TextField label="Đơn Vị Mượn" fullWidth disabled />
                </Grid>
              </Grid>
            </Paper>
            <div style={{ marginTop: 24 }} />
            <MuiTable
              data={[
                { basketCode: 'K04037', basketName: 'Khay Sọt 1', uoM: 'KG' },
                { basketCode: 'K04038', basketName: 'Khay Sọt 2', uoM: 'KG' },
              ]}
              columns={[
                { title: 'Mã Khay Sọt', field: 'basketCode' },
                { title: 'Tên Khay Sọt', field: 'basketName' },
                { title: 'Đơn Vị Tính', field: 'uoM' },
                { title: 'SL Đang Mượn', field: 'quantity' },
              ]}
              options={{
                toolbar: false,
                selection: true,
              }}
              onSelectionChange={this.selectionChange}
            />
            <div style={{ marginTop: 24 }} />
            <Grid container spacing={16} justify="flex-end">
              <Grid item>
                <MuiButton outline onClick={onCloseDialog}>
                  Đóng
                </MuiButton>
              </Grid>
              <Grid item>
                <MuiButton onClick={this.commitSelected}>Chọn</MuiButton>
              </Grid>
            </Grid>
          </div>
        }
        customActionDialog
      />
    );
  }
}

BasketSuggest.propTypes = {
  onCloseDialog: PropTypes.func,
  suggest: PropTypes.func,
  openDl: PropTypes.bool,
  ui: PropTypes.object,
};
