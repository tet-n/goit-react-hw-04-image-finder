import PropTypes from 'prop-types';
import css from 'components/ImageGalleryItem/ImaheGallery.module.css';

export const ImageGalleryItem = ({ src, alt, openModal }) => {
  return (
    <li className={css.ImageGalleryItem}>
      <img
        src={src}
        alt={alt}
        onClick={openModal}
        className={css['ImageGalleryItem-image']}
      />
    </li>
  );
};

ImageGalleryItem.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  openModal: PropTypes.func.isRequired,
};
