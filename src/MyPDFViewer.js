import React from 'react';
import PDF from 'react-pdf-js';

export class MyPdfViewer extends React.Component {
  state = {};
  componentDidMount() {
    const $container = document.querySelector('#container');
    $container.addEventListener('keydown', e => {
      e.preventDefault();
    });
    $container.addEventListener('keyup', e => {
      e.preventDefault();
      switch (e.key) {
        case 'ArrowLeft':
          if (this.state.page <= 0) {
            return;
          }
          this.handleNext();
          break;
        case 'ArrowRight':
          if (this.state.page >= this.state.pages) {
            return;
          }
          this.handlePrevious();
          break;
        default:
      }
    });
  }

  onDocumentComplete = pages => {
    this.setState({ page: 1, pages });
  };

  onPageComplete = page => {
    this.setState({ page });
  };

  handlePrevious = () => {
    this.setState({ page: this.state.page + 1 });
  };

  handleNext = () => {
    this.setState({ page: this.state.page - 1 });
  };

  render() {
    return (
      <div>
        <PDF
          file="somefile.pdf"
          onDocumentComplete={this.onDocumentComplete}
          onPageComplete={this.onPageComplete}
          page={this.state.page}
        />
      </div>
    );
  }
}
