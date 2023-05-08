import { Component } from 'react';
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

export class App extends Component {
  state = {
    name: '',
    images: [],
    page: 1,
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
    if (
      prevState.name !== this.state.name ||
      prevState.page !== this.state.page
    ) {
      this.setState({ loading: true });
      this.setState({ showButton: false });
      fetchImages(this.state.name, this.state.page)
        .then(({ totalHits, images }) => {
          if (!images.length) {
            this.notify();
            return;
          }

          this.setState(state => ({
            images: [...state.images, ...images],
            showButton: this.state.page < Math.ceil(totalHits / 12),
          }));
        })
        .catch(this.onError)
        .finally(() => this.setState({ loading: false }));
      return;
    }
  }

  renderImages = () => {
    this.setState(state => ({
      page: state.page + 1,
    }));
  };

  updateStateAfterSubmittingForm = name => {
    this.setState({ name, page: 1, images: [] });
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
    const { showModal, showButton, loading, error, images } = this.state;
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gridGap: 16,
          paddingBottom: 24,
        }}
      >
        <Searchbar
          updateStateAfterSubmittingForm={this.updateStateAfterSubmittingForm}
        />
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
        {showButton && <Button onClick={this.renderImages} />}
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
      </div>
    );
  }
}
