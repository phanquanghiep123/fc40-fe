/* eslint-disable indent */
import React from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { generateUUID, getNested } from '../../../../../../App/utils';

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
function ImageUploadCellRenderer(props) {
  const { classes, rowIndex, data, onOpenImagePopup } = props;

  return (
    <div className={classes.cellContainer}>
      <div className={classes.imagesContainer}>
        {data.images
          ? data.images.map((image, imgIndex) => {
              const uuid = generateUUID();
              return (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
                <figure
                  className={classes.image}
                  key={image.id || getNested(image, 'file', 'name') + uuid}
                  onClick={() => onOpenImagePopup(rowIndex, imgIndex)}
                >
                  <img alt={imgIndex} src={image.previewData} />
                </figure>
              );
            })
          : null}
      </div>
    </div>
  );
}

ImageUploadCellRenderer.propTypes = {
  classes: PropTypes.object,
  rowIndex: PropTypes.number,
  data: PropTypes.object,
  onOpenImagePopup: PropTypes.func,
};

export default withStyles(styles)(ImageUploadCellRenderer);
