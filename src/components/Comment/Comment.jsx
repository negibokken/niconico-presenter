import React from 'react';

class Comment extends React.Component {
  right = 0;
  move() {
    const comment = this.refs.comment;
    const rect = comment.getBoundingClientRect();
    if (rect.left <= -3000) {
      clearInterval(this.timerID);
      comment.parentNode.removeChild(comment);
      return;
    }
    this.right += 50;
    comment.style.right = `${this.right}px`;
  }
  componentDidMount() {
    this.i = 0;
    const rand = Math.random() * (500 - 0) + 80;
    this.refs.comment.style.top = `${rand}px`;
    this.timerID = setInterval(this.move.bind(this), 100);
  }
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
  render() {
    return (
      <div className="comment" ref="comment" style={{ whiteSpace: 'nowrap' }}>
        {this.props.message}
      </div>
    );
  }
}

export default Comment;
