import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

class Hello extends React.Component {
  render() {
    return (
      <div>
        hello world
        <Comment />
      </div>
    );
  }
}

class Comment extends React.Component {
  onClick() {
    this.refs.comment.css = {
      transform: 'translate(400px, -200px)'
    };
  }
  render() {
    return (
      <div id="comment" ref="comment" onClick={this.onClick.bind(this)}>
        comment
      </div>
    );
  }
}

ReactDOM.render(<Hello />, document.getElementById('root'));
