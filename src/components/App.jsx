import { Component } from 'react';
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

  componentDidUpdate(_, prevState) {
    if (prevState.name !== this.state.name) {
      this.showLoader();
      fetchImages(this.state.name)
        .then(({ totalHits, hits }) => {
          const total = Math.ceil(totalHits / 12);
          if (prevState.page >= total) {
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
    fetchImages(this.state.name, page)
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

  getName = name => {
    this.setState({ name });
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
