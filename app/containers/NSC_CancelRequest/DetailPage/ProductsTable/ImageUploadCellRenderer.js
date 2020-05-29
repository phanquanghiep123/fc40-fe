/* eslint-disable indent */
import React from 'react';
import * as PropTypes from 'prop-types';
import { Typography, Tooltip, withStyles } from '@material-ui/core';
import { CloudUploadOutlined } from '@material-ui/icons';
import { generateUUID } from '../../../App/utils';

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
    display: 'none',
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
    const { formik, rowIndex, node } = this.props;
    const { files } = event.target;

    const images =
      formik.values.products[rowIndex] &&
      formik.values.products[rowIndex].images
        ? formik.values.products[rowIndex].images
        : [];
    const updatedImages = [...images];

    Array.from(files).forEach(file => {
      this.generatePreviewImg(file, previewData => {
        updatedImages.push({
          id: generateUUID(),
          newlyUploaded: true, // to distinguish new images from images loaded from server
          file,
          previewData,
        });
        formik.setFieldValue(`products[${rowIndex}]images`, updatedImages);
        node.setDataValue(`products[${rowIndex}]images`, updatedImages);
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
    const { images, imageDeleted } = formik.values.products[rowIndex];
    const image = images[imgIndex];
    const updatedImages = [...images];

    if (image.newlyUploaded) {
      updatedImages.splice(imgIndex, 1);
    } else {
      const updatedImage = { ...image };
      updatedImage.markedDelete = true;
      updatedImages[imgIndex] = updatedImage;

      // add image to delete-list
      const updatedImageDeleted = imageDeleted
        ? `${imageDeleted},${image.id}`
        : image.id;
      formik.setFieldValue(
        `products[${rowIndex}].imageDeleted`,
        updatedImageDeleted,
      );
    }

    formik.setFieldValue(`products[${rowIndex}]images`, updatedImages);
  };

  // componentWillUnmount() {
  //   this.props.api.sizeColumnsToFit();
  // }

  render() {
    const {
      classes,
      rowIndex,
      pageType,
      data,
      formik: { errors, submitCount },
      openImagePopup,
    } = this.props;

    const keyStr = `products[${rowIndex}]images`;
    const hasError = !!(
      submitCount > 0 &&
      errors.products &&
      errors.products[rowIndex] &&
      errors.products[rowIndex].images
    );
    const error = hasError ? errors.products[rowIndex].images : '';
    const maxImages = 3; // giới hạn tốt đa 3 ảnh
    const showUploadBtn =
      (pageType.create || pageType.edit) &&
      !data.isDeleted &&
      data.productCode &&
      (!data.images || data.images.length < maxImages);

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
            ? data.images.map((image, imgIndex) => (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
                <figure
                  className={
                    image.markedDelete
                      ? classes.imageMarkedDelete
                      : classes.image
                  }
                  key={image.id}
                  onClick={() =>
                    openImagePopup(rowIndex, imgIndex, this.deleteImage)
                  }
                >
                  <img alt={imgIndex} src={image.previewData} />
                </figure>
              ))
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
  pageType: PropTypes.object,
  // api: PropTypes.object,
  node: PropTypes.object,
  data: PropTypes.object,
  openImagePopup: PropTypes.func,
};

export default withStyles(styles)(ImageUploadCellRenderer);
