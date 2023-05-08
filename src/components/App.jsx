import { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { fetchImages } from 'services/api';

import {
  Searchbar,
  ImageGallery,
  Button,
  Loader,
  ErrorMessage,
  ErrorBoundary,
  Modal,
} from 'components/index';

export class App extends Component {
  state = {
    name: '',
    images: [],
    page: 1,
    total: null,
    loading: false,
    showButton: false,
    showModal: false,
    error: false,
  };

  notify = () =>
    toast.info(
      'There are not any images for your request...Please make another one'
    );

  componentDidUpdate(_, prevState) {
    if (prevState.name !== this.state.name) {
      this.setState({ loading: true });
      fetchImages(this.state.name)
        .then(({ totalHits, images }) => {
          if (!images.length) {
            this.notify();
          }
          const total = Math.ceil(totalHits / 12);

          if (prevState.page >= total) {
            this.setState({
              images,
              loading: false,
              showButton: false,
            });
          } else {
            this.setState({
              images,
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
    this.setState({ loading: true });
    this.setState({ showButton: false });
    fetchImages(this.state.name, page)
      .then(({ images }) => {
        this.setState(state => {
          if (state.page >= state.total) {
            return {
              showButton: false,
              loading: false,
              images: [...state.images, ...images],
            };
          }
          return {
            showButton: true,
            page: state.page + 1,
            loading: false,
            images: [...state.images, ...images],
          };
        });
      })
      .catch(this.onError);
  };

  getName = name => {
    this.setState({ name });
  };

  onError = () => {
    this.setState({ error: true, loading: false, showButton: false });
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
    const { showModal, showButton, loading, error, page, images } = this.state;
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gridGap: 16,
          paddingBottom: 24,
        }}
      >
        <ErrorBoundary>
          <Searchbar getName={this.getName} />
          <ToastContainer
            bodyClassName="toast-w"
            className="toast-c"
            autoClose={3500}
          />
          <ImageGallery
            images={images}
            openModal={this.openModal}
            showModal={showModal}
          />
          {showButton && <Button onClick={() => this.renderImages(page)} />}
          <Loader visible={loading} />
          {error && <ErrorMessage />}
          {showModal && (
            <Modal
              openModal={this.openModal}
              closeModal={this.closeModal}
              src={showModal.src}
              alt={showModal.alt}
            />
          )}
        </ErrorBoundary>
      </div>
    );
  }
}
