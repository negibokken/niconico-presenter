import React from 'react';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import { addNice } from '../../actions/actions';

class Comment extends React.Component {
  right = 0;
  isNiced = false;
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
    this.isNiced = !this.isNiced;
  };
  getColor = () => {
    const colors = {
      normal: 'rgba(255, 255, 255, 0)',
      niced: 'rgba(255, 0, 0, 0.3)',
    };
    return this.isNiced ? colors.niced : colors.normal;
  };
  render() {
    const backgroundColor = this.getColor();
    return (
      <div
        className="comment"
        ref="comment"
        style={{ zIndex: 2, whiteSpace: 'nowrap', backgroundColor }}
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
