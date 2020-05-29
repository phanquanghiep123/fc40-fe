import React from 'react';
import Button from '@material-ui/core/Button/index';
import Dialog from '@material-ui/core/Dialog/index';
import DialogActions from '@material-ui/core/DialogActions/index';
import * as PropTypes from 'prop-types';
import {
  createMuiTheme,
  MuiThemeProvider,
  withStyles,
} from '@material-ui/core';
import MuiButton from 'components/MuiButton';
import appTheme from '../../../App/theme';

const style = theme => ({
  navContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'absolute',
    width: '100%',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  navBtn: {
    fontSize: '2rem',
    color: 'white',
    '&:hover': {
      background: theme.palette.primary.main,
    },
  },
});

const muiTheme = (theme = appTheme) =>
  createMuiTheme({
    ...theme,
    overrides: {
      MuiDialog: {
        paper: {
          maxWidth: '90% !important',
        },
      },
    },
  });

class ImagePopup extends React.PureComponent {
  state = {};

  componentWillReceiveProps = nextProps => {
    this.setState({
      rowIndex: nextProps.rowIndex,
      imgIndex: nextProps.imgIndex,
    });
  };

  componentWillUpdate = (nextProps, nextState) => {
    if (nextState.imgIndex !== this.state.imgIndex) {
      this.getImgSrc(nextState.rowIndex, nextState.imgIndex);
    }
  };

  loadNextImage = () =>
    this.setState(prevState => ({
      imgIndex: prevState.imgIndex + 1,
    }));

  loadPrevImage = () =>
    this.setState(prevState => ({
      imgIndex: prevState.imgIndex - 1,
    }));

  componentWillMount() {
    this.getImgSrc(this.props.rowIndex, this.props.imgIndex);
    this.setState({
      rowIndex: this.props.rowIndex,
      imgIndex: this.props.imgIndex,
    });
  }

  /**
   * Get Image Source - used in popup
   * @param rowIndex
   * @param imgIndex
   * @returns {string}
   */
  getImgSrc(rowIndex, imgIndex) {
    const { onFetchBigImage, tableData } = this.props;
    if (
      tableData &&
      tableData[rowIndex] &&
      tableData[rowIndex].images[imgIndex]
    ) {
      const img = tableData[rowIndex].images[imgIndex];
      this.setState({
        id: img.id,
        isRefactorImage: tableData[rowIndex].isRefactorImage,
      });
      // get img src
      onFetchBigImage({
        id: img.id,
        callback: data => {
          this.setState({
            imgSrc: data,
          });
        },
        isRefactorImage: tableData[rowIndex].isRefactorImage,
      });
    }
  }

  deleteImage = () => {
    const { id, rowIndex, imgIndex, isRefactorImage } = this.state;
    const { deleteImage } = this.props;
    deleteImage({
      id,
      rowIndex,
      imgIndex,
      callback: this.deleteImageSuccess,
      isRefactorImage,
    });
  };

  deleteImageSuccess = () => {
    if (this.hasNextImage()) {
      this.loadNextImage();
    } else if (this.hasPrevImage()) {
      this.loadPrevImage();
    } else {
      this.props.onClose();
    }
  };

  hasNextImage = () =>
    !!(
      this.props.tableData &&
      this.props.tableData[this.state.rowIndex] &&
      this.props.tableData[this.state.rowIndex].images[this.state.imgIndex + 1]
    );

  hasPrevImage = () =>
    !!(
      this.state.imgIndex > 0 &&
      this.props.tableData &&
      this.props.tableData[this.state.rowIndex] &&
      this.props.tableData[this.state.rowIndex].images[this.state.imgIndex - 1]
    );

  render() {
    const { classes, open, onClose, tableData } = this.props;
    const { rowIndex, imgIndex, imgSrc } = this.state;

    const hasNextImage = !!(
      tableData &&
      tableData[rowIndex] &&
      tableData[rowIndex].images[imgIndex + 1]
    );

    const hasPrevImage = !!(
      imgIndex > 0 &&
      tableData &&
      tableData[rowIndex] &&
      tableData[rowIndex].images[imgIndex - 1]
    );

    return (
      <MuiThemeProvider theme={muiTheme}>
        <Dialog
          open={open}
          keepMounted
          onClose={onClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <figure style={{ position: 'relative', margin: 0 }}>
            {imgSrc ? (
              <img
                src={imgSrc}
                alt="preview"
                style={{
                  minWidth: 450,
                  maxHeight: 450,
                  objectFit: 'cover',
                }}
              />
            ) : (
              <div
                style={{
                  width: 450,
                  height: 450,
                  backgroundColor: 'white',
                }}
              />
            )}
            <div className={classes.navContainer}>
              <Button
                className={classes.navBtn}
                onClick={this.loadPrevImage}
                disabled={!hasPrevImage}
              >
                ❮
              </Button>
              <Button
                className={classes.navBtn}
                onClick={this.loadNextImage}
                disabled={!hasNextImage}
              >
                ❯
              </Button>
            </div>
          </figure>
          <DialogActions>
            <React.Fragment>
              <MuiButton outline onClick={onClose}>
                Đóng
              </MuiButton>
              <MuiButton
                onClick={this.deleteImage}
                color="primary"
                style={{ marginLeft: 24 }}
              >
                Xoá
              </MuiButton>
            </React.Fragment>
          </DialogActions>
        </Dialog>
      </MuiThemeProvider>
    );
  }
}

ImagePopup.propTypes = {
  classes: PropTypes.object,
  deleteImage: PropTypes.func,
  imgIndex: PropTypes.number,
  onClose: PropTypes.func,
  onFetchBigImage: PropTypes.func,
  open: PropTypes.bool,
  rowIndex: PropTypes.number,
  tableData: PropTypes.array,
};

export default withStyles(style)(ImagePopup);
