import React from 'react';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import { addNice } from '../../actions/actions';

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
  onClickHandler = () => {
    this.props.addNice(this.props.id);
  };
  render() {
    return (
      <div
        className="comment"
        ref="comment"
        style={{ zIndex: 2, whiteSpace: 'nowrap' }}
        onClick={this.onClickHandler}
      >
        <Tooltip title="いいね" placement="bottom" ref="comment">
          <Button style={{ textTransform: 'none' }}>
            {this.props.message}
          </Button>
        </Tooltip>
      </div>
    );
  }
}

export default Comment;
