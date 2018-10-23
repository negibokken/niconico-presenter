import React from 'react';
import Comment from '../Comment/Comment';
import { Input, Button, FormControl } from '@material-ui/core';

const styles = {
  container: {
    width: '100%'
  },
  input: {
    width: '350px',
    margin: '0 auto',
    marginTop: '10px'
  }
};

const wsOrigin = window.location.origin.replace('http', 'ws');
const socket = new WebSocket(wsOrigin, 'echo-protocol');

socket.addEventListener('open', e => {
  console.log('websocket connection open');
});

class CommentView extends React.Component {
  constructor() {
    super();
    this.inputRef = React.createRef();
  }
  onClick = () => {
    if (!this.inputRef || !this.inputRef.current) {
      return;
    }
    if (this.inputRef.current.value === '') {
      return;
    }
    socket.send(this.inputRef.current.value);
    this.inputRef.current.value = '';
  };
  componentDidMount = () => {
    document.addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.keyCode === 13) {
        this.onClick();
      }
    });
    socket.addEventListener('message', e => {
      this.props.postComment(e.data);
    });
  };
  render() {
    const { comments } = this.props;
    return (
      <div style={styles.container}>
        <div style={styles.input}>
          <FormControl fullWidth={true}>
            <Input
              autoFocus={true}
              fullWidth={true}
              multiline={true}
              rowsMax={3}
              placeholder={'コメント (ctrl (または cmd) + Enter で送信)'}
              inputRef={this.inputRef}
              style={{ display: 'inline' }}
            />{' '}
            <Button variant="outlined" onClick={this.onClick}>
              送信
            </Button>
          </FormControl>
        </div>
        {comments
          ? comments.map((v, i) => {
              return <Comment key={i} message={v} />;
            })
          : undefined}
      </div>
    );
  }
}

export default CommentView;
