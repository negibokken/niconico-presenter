import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { setInterval, clearInterval } from 'timers';
import { MyPdfViewer } from './MyPDFViewer';

const socket = new WebSocket(`ws://localhost:3000`);

socket.addEventListener('open', e => {
  socket.send('Hello Server!');
});
socket.addEventListener('message', e => {
  console.log('message: ', e.data);
});

class Index extends React.Component {
  constructor() {
    super();
    this.state = {
      comments: [<Comment message="a" />]
    };
  }
  pushComment() {
    const comments = this.state.comments;
    comments.push(`hello ${comments.length}`);
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
        <input type="file" id="files" name="files[]" multiple />
        <MyPdfViewer />
        {this.state.comments.map((v, i) => {
          return <Comment key={i} message={v} />;
        })}
      </div>
    );
  }
}

class Comment extends React.Component {
  right = 0;
  move() {
    const comment = this.refs.comment;
    const rect = comment.getBoundingClientRect();
    if (rect.left <= 0) {
      clearInterval(this.timerID);
      comment.parentNode.removeChild(comment);
      return;
    }
    this.right += 100;
    comment.style.right = `${this.right}px`;
  }
  componentDidMount() {
    this.i = 0;
    const rand = Math.random() * (600 - 0) + 0;
    this.refs.comment.style.top = `${rand}px`;
    this.timerID = setInterval(this.move.bind(this), 100);
  }
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
  render() {
    return (
      <div className="comment" ref="comment">
        {this.props.message}
      </div>
    );
  }
}

ReactDOM.render(<Index />, document.getElementById('root'));
