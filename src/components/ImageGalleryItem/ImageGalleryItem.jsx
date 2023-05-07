import css from 'components/ImageGalleryItem/ImaheGallery.module.css';

export const ImageGalleryItem = ({ src, alt, openModal }) => {
  return (
    <li className={css.ImageGalleryItem}>
      <img src={src} alt={alt} onClick={openModal} />
    </li>
  );
};
