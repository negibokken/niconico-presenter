import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import { setInterval, clearInterval } from 'timers';

class Hello extends React.Component {
  render() {
    return (
      <div>
        hello world [1..10]
        <Comment />
      </div>
    );
  }
}

class Comment extends React.Component {
  right = 0;
  move() {
    this.right += 100;
    this.refs.comment.style.right = `${this.right}px`;
  }
  componentDidMount() {
    this.i = 0;
    this.timerID = setInterval(this.move.bind(this), 100);
  }
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
  onClick() {
    console.log(this.refs.comment);
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
