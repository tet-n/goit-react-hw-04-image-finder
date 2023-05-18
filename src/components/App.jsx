import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { fetchImages } from 'services/api';

import {
  Searchbar,
  ImageGallery,
  Button,
  Loader,
  ErrorMessage,
  Modal,
} from 'components/index';

export const App = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [error, setError] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (!query) return;
    setShowLoader(true);
    setShowButton(false);
    fetchImages(query, page)
      .then(({ totalHits, images }) => {
        if (!images.length) {
          notify();
          return;
        }
        setImages(prevImages => [...prevImages, ...images]);
        setShowButton(page < Math.ceil(totalHits / 12));
      })
      .catch(e => handleError(e.message))
      .finally(() => setShowLoader(false));
  }, [query, page]);

  const openModal = (src, alt) => {
    setShowModal({ src, alt });
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmitting = query => {
    setQuery(query);
    setImages([]);
    setPage(1);
  };
  const notify = () =>
    toast.info(
      'There are not any images for your request...Please make another one'
    );

  const handleError = message => {
    setError(message);
    setShowLoader(false);
    setShowButton(false);
  };

  const renderImages = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridGap: 16,
        paddingBottom: 24,
      }}
    >
      <Searchbar updateStateAfterSubmittingForm={handleSubmitting} />
      <ToastContainer
        bodyClassName="toast-w"
        className="toast-c"
        autoClose={3500}
      />
      <ImageGallery images={images} openModal={openModal} />
      {showButton && <Button onClick={renderImages} />}
      <Loader visible={showLoader} />
      {error && <ErrorMessage error={error} />}
      {showModal && (
        <Modal
          closeModal={closeModal}
          src={showModal.src}
          alt={showModal.alt}
        />
      )}
    </div>
  );
};
