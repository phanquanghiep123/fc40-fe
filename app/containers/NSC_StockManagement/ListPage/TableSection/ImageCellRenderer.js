import React from 'react';
import PropTypes from 'prop-types';

export default function ImageCellRenderer({ data, openImagePopup }) {
  const { images } = data;
  return (
    <div>
      {images &&
        images.map((image, imgIndex) => (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
          <span
            onClick={() => openImagePopup(imgIndex)}
            style={{ cursor: 'pointer' }}
          >
            <img alt={imgIndex} src={image.previewData} />
          </span>
        ))}
    </div>
  );
}

ImageCellRenderer.propTypes = {
  data: PropTypes.object,
  openImagePopup: PropTypes.func,
};
