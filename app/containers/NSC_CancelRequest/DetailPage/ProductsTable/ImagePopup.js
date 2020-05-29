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
    if (nextProps.open) {
      this.getImgSrc(nextState.rowIndex, nextState.imgIndex);
    }
    // if (nextState.imgIndex !== this.state.imgIndex) {
    // this.getImgSrc(nextState.rowIndex, nextState.imgIndex);
    // }
  };

  loadNextImage = () =>
    this.setState(prevState => ({
      imgIndex: prevState.imgIndex + 1,
    }));

  loadPrevImage = () =>
    this.setState(prevState => ({
      imgIndex: prevState.imgIndex - 1,
    }));

  /**
   * Get Image Source - used in popup
   * @param rowIndex
   * @param imgIndex
   * @returns {string}
   */
  getImgSrc(rowIndex, imgIndex) {
    const {
      formik: { values },
      pageType,
      onFetchBigImage,
    } = this.props;

    if (
      values.products &&
      values.products[rowIndex] &&
      values.products[rowIndex].images[imgIndex]
    ) {
      const img = values.products[rowIndex].images[imgIndex];

      // get img src
      if (pageType.create || img.newlyUploaded) {
        this.setState({
          imgSrc: img.previewData,
        });
      } else {
        onFetchBigImage(
          img.id,
          data => {
            this.setState({
              imgSrc: data,
            });
          },
          values.products[rowIndex].isRefactorImage,
        );
      }
    }
  }

  render() {
    const {
      classes,
      open,
      onClose,
      deleteImage,
      formik: { values },
      pageType,
    } = this.props;
    const { rowIndex, imgIndex, imgSrc } = this.state;

    const hasNextImage = !!(
      values.products &&
      values.products[rowIndex] &&
      values.products[rowIndex].images[imgIndex + 1]
    );

    const hasPrevImage = !!(
      imgIndex > 0 &&
      values.products &&
      values.products[rowIndex] &&
      values.products[rowIndex].images[imgIndex - 1]
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
            <img
              src={imgSrc}
              alt="preview"
              style={{
                minWidth: 450,
                maxHeight: 450,
                objectFit: 'cover',
              }}
            />
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
            {pageType.create || pageType.edit ? (
              <React.Fragment>
                <MuiButton outline onClick={onClose}>
                  Đóng
                </MuiButton>
                <MuiButton
                  onClick={() => {
                    deleteImage(rowIndex, imgIndex);
                    onClose();
                  }}
                  color="primary"
                  style={{ marginLeft: 24 }}
                >
                  Xóa
                </MuiButton>
              </React.Fragment>
            ) : null}
          </DialogActions>
        </Dialog>
      </MuiThemeProvider>
    );
  }
}

ImagePopup.propTypes = {
  classes: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  rowIndex: PropTypes.number,
  imgIndex: PropTypes.number,
  deleteImage: PropTypes.func,
  formik: PropTypes.object,
  pageType: PropTypes.object,
  onFetchBigImage: PropTypes.func,
};

export default withStyles(style)(ImagePopup);
