import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import { setInterval, clearInterval } from 'timers';

class Hello extends React.Component {
  constructor() {
    super();
    this.state = {
      comments: [<Comment message="a" />]
    };
  }
  pushComment() {
    const comments = this.state.comments;
    comments.push(`hello${comments.length}`);
    this.setState({
      comments
    });
  }
  componentDidMount() {
    setInterval(this.pushComment.bind(this), 1000);
  }
  render() {
    return (
      <div>
        hello world
        {this.state.comments.map(i => {
          return <Comment message={i} />;
        })}
      </div>
    );
  }
}

class Comment extends React.Component {
  right = 0;
  move() {
    console.log('interval');
    if (this.right >= 5000) {
      clearInterval(this.timerID);
      return;
    }
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
        {this.props.message}
      </div>
    );
  }
}

ReactDOM.render(<Hello />, document.getElementById('root'));
