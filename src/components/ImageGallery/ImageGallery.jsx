import { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Loader,
  ErrorMessage,
  ErrorBoundary,
  Modal,
  ImageGalleryItem,
} from 'components/index';
import { fetchImages } from 'services/api';
import css from 'components/ImageGallery/ImageGallery.module.css';

export class ImageGallery extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
  };

  state = {
    images: [],
    page: 1,
    total: null,
    loading: false,
    showButton: false,
    showModal: false,
    error: false,
  };

  componentDidUpdate(prevProps, _) {
    if (prevProps.name !== this.props.name) {
      this.showLoader();
      fetchImages(this.props.name)
        .then(({ totalHits, hits }) => {
          const total = Math.ceil(totalHits / 12);
          if (this.state.page >= total) {
            this.setState({
              images: hits,
              loading: false,
              showButton: false,
            });
          } else {
            this.setState({
              images: hits,
              total,
              page: 2,
              loading: false,
              showButton: true,
            });
          }
        })
        .catch(this.onError);
      return;
    }
  }

  renderImages = page => {
    this.showLoader();
    this.showButton();
    fetchImages(this.props.name, page)
      .then(({ hits }) => {
        this.setState(state => {
          if (state.page >= state.total) {
            return {
              showButton: false,
              loading: false,
              images: [...state.images, ...hits],
            };
          }
          return {
            showButton: true,
            page: state.page + 1,
            loading: false,
            images: [...state.images, ...hits],
          };
        });
      })
      .catch(this.onError);
  };

  onError = () => {
    this.setState({ error: true, loading: false, showButton: false });
  };

  showLoader = () => {
    this.setState({ loading: true });
  };

  showButton = () => {
    this.setState({ showButton: false });
  };

  openModal = (src, alt) => {
    this.setState({ showModal: { src, alt } });
  };

  closeModal = () => {
    this.setState({
      showModal: null,
    });
  };

  render() {
    const { showModal, showButton, loading, error, images, page } = this.state;
    return (
      <>
        <ErrorBoundary>
          <ul className={css.ImageGallery}>
            {images.map(image => (
              <ImageGalleryItem
                key={image.id}
                src={image.webformatURL}
                alt={image.tags}
                openModal={() =>
                  this.openModal(image.largeImageURL, image.tags)
                }
              />
            ))}
          </ul>
          <Loader visible={loading} />
          {error && <ErrorMessage />}
          {showModal && (
            <Modal
              closeModal={this.closeModal}
              src={showModal.src}
              alt={showModal.alt}
            />
          )}
          {showButton && (
            <Button
              onClick={() => {
                this.renderImages(page);
              }}
            />
          )}
        </ErrorBoundary>
      </>
    );
  }
}
