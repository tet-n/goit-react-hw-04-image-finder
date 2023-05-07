import { Component } from 'react';
import { Searchbar, ImageGallery } from 'components/index';

export class App extends Component {
  state = {
    name: '',
  };

  getName = name => {
    this.setState({ name });
  };

  render() {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gridGap: 16,
          paddingBottom: 24,
        }}
      >
        <Searchbar getName={this.getName} />
        <ImageGallery name={this.state.name} />
      </div>
    );
  }
}
