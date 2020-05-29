/* eslint-disable indent */
import React from 'react';
import * as PropTypes from 'prop-types';
import { Typography, Tooltip, withStyles } from '@material-ui/core';
import { CloudUploadOutlined } from '@material-ui/icons';
import classnames from 'classnames';
import { generateUUID, getNested } from '../../App/utils';
import { loadingError } from '../../App/actions';

export const styles = {
  error: {
    color: 'red',
  },
  errorDivider: {
    height: '100%',
    borderBottom: '1.5px solid red',
  },
  uploadBtn: {
    cursor: 'pointer',
  },
  imagesContainer: {
    display: 'flex',
  },
  image: {
    position: 'relative',
    margin: '-0.5rem 0 0 0',
    height: 32,
    width: 32,
    cursor: 'pointer',
    overflow: 'hidden',
    '& > img': {
      height: '100%',
      width: '100%',
      objectFit: 'cover',
    },
    '&:not(:last-child)': {
      marginRight: '0.25rem',
    },
    '&:hover > *': {
      visibility: 'visible',
    },
  },
  imageMarkedDelete: {
    opacity: 0.5,
    height: '32px !important',
    width: '32px !important',
    cursor: 'default',
    position: 'relative',
    '&:before': {
      content: '""',
      position: 'absolute',
      top: '55%',
      left: '50%',
      height: '100%',
      width: 2,
      background: 'red',
      zIndex: 100,
      transform: 'translate(-50%, -50%) rotate(45deg)',
    },
    '&:after': {
      content: '""',
      position: 'absolute',
      top: '55%',
      left: '50%',
      height: '100%',
      width: 2,
      background: 'red',
      zIndex: 100,
      transform: 'translate(-50%, -50%) rotate(-45deg)',
    },
  },
  btnContainer: {
    marginRight: '0.5rem',
  },
  cellContainer: {
    display: 'flex',
  },
};

/**
 * Cell Renderer for uploading file and storing data into formik
 */
class ImageUploadCellRenderer extends React.Component {
  /**
   * Handle upload input change
   * @param event - onchange event
   */
  uploadHandler = event => {
    event.stopPropagation();
    const { formik, rowIndex, node, dispatch, context } = this.props;
    const { files } = event.target;
    const maxFiles = 3;
    const maxSize = 5e6; // 5 megabytes
    const images =
      formik.values.cancelBaskets[rowIndex] &&
      formik.values.cancelBaskets[rowIndex].images
        ? formik.values.cancelBaskets[rowIndex].images
        : [];
    const updatedImages = [...images];

    Array.from(files).forEach(file => {
      if (file.size > maxSize) {
        dispatch(loadingError('Chỉ cho phép ảnh có dung lượng không quá 5Mb'));
        return;
      }

      this.generatePreviewImg(file, previewData => {
        if (updatedImages.length >= 3) {
          dispatch(
            loadingError(`Chỉ cho phép tối đa ${maxFiles} ảnh mỗi dòng`),
          );
          return;
        }

        updatedImages.push({
          // id: generateUUID(),
          newlyUploaded: true, // to distinguish new images from images loaded from server
          file,
          previewData,
        });
        // formik.setFieldValue(`cancelBaskets[${rowIndex}]images`, updatedImages);
        const dataRow = {
          ...this.props.data,
          images: updatedImages,
        };
        context.props.onChangeImage({
          index: rowIndex,
          data: dataRow,
          table: 'cancelBaskets',
        });
        node.setDataValue(`cancelBaskets[${rowIndex}]images`, updatedImages);
      });
    });
  };

  /**
   * Generate preview image before uploading to server
   * @param file
   * @param callback
   */
  generatePreviewImg = (file, callback) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => callback(reader.result);
  };

  /**
   * Delete image
   * @param rowIndex
   * @param imgIndex
   */
  deleteImage = (rowIndex, imgIndex) => {
    const { formik } = this.props;
    const { images } = formik.values.cancelBaskets[rowIndex];
    const image = images[imgIndex];
    const updatedImages = [...images];

    if (image.newlyUploaded) {
      updatedImages.splice(imgIndex, 1);
    } else {
      const updatedImage = { ...image };
      updatedImage.markedDelete = true;
      updatedImages[imgIndex] = updatedImage;
    }

    formik.setFieldValue(`cancelBaskets[${rowIndex}]images`, updatedImages);
  };

  componentWillUnmount() {
    this.props.api.sizeColumnsToFit();
  }

  render() {
    const {
      classes,
      rowIndex,
      // pageType,
      data,
      formik: { errors, submitCount },
      onOpenImagePopup,
      // context,
      form,
    } = this.props;
    const keyStr = `cancelBaskets[${rowIndex}]images`;
    const hasError = !!(
      submitCount > 0 &&
      errors.cancelBaskets &&
      errors.cancelBaskets[rowIndex] &&
      errors.cancelBaskets[rowIndex].images
    );
    const error = hasError ? errors.cancelBaskets[rowIndex].images : '';
    const maxImages = 3; // giới hạn tốt đa 3 ảnh
    const showUploadBtn =
      form === '1' && (!data.images || data.images.length < maxImages);

    const content = (
      <div className={classes.cellContainer}>
        {showUploadBtn ? (
          <div className={classes.btnContainer}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id={keyStr}
              multiple
              type="file"
              onChange={e => this.uploadHandler(e)}
            />
            <label htmlFor={keyStr}>
              <Typography
                component="span"
                variant="body2"
                className={classes.uploadBtn}
              >
                <CloudUploadOutlined />
              </Typography>
            </label>
          </div>
        ) : null}
        <div className={classes.imagesContainer}>
          {data.images
            ? data.images.map((image, imgIndex) => {
                const uuid = generateUUID();
                return (
                  // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
                  <figure
                    className={
                      image.markedDelete
                        ? classnames(classes.image, classes.imageMarkedDelete)
                        : classes.image
                    }
                    key={image.id || getNested(image, 'file', 'name') + uuid}
                    onClick={() => {
                      if (image.markedDelete) return;
                      onOpenImagePopup(rowIndex, imgIndex, this.deleteImage);
                    }}
                  >
                    <Tooltip
                      title={
                        image.markedDelete
                          ? 'Ảnh sẽ được xoá sau khi lưu phiếu'
                          : ''
                      }
                    >
                      <img alt={imgIndex} src={image.previewData} />
                    </Tooltip>
                  </figure>
                );
              })
            : null}
        </div>
      </div>
    );

    return (
      <React.Fragment>
        {hasError ? (
          <Tooltip title={error}>
            <div style={styles.errorDivider}>{content}</div>
          </Tooltip>
        ) : (
          content
        )}
      </React.Fragment>
    );
  }
}

ImageUploadCellRenderer.propTypes = {
  classes: PropTypes.object,
  formik: PropTypes.object,
  rowIndex: PropTypes.number,
  // pageType: PropTypes.object,
  api: PropTypes.object,
  node: PropTypes.object,
  data: PropTypes.object,
  onOpenImagePopup: PropTypes.func,
  context: PropTypes.object,
  dispatch: PropTypes.func,
  form: PropTypes.string,
};

export default withStyles(styles)(ImageUploadCellRenderer);
