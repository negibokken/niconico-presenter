import React from 'react';
import Comment from '../Comment/Comment';
import CommentList from '../../containers/CommentList/CommentList';
import { Input, Button, FormControl } from '@material-ui/core';
import { socket } from '../../utils';

const styles = {
  container: {
    width: '100vw',
    position: 'fixed',
    bottom: 0,
  },
  inputWrapper: {
    width: '450px',
    marginTop: '10px',
    margin: '0 auto',
  },
  input: {
    width: '350px',
  },
  button: {
    display: 'inline-block',
    width: '100px',
  },
};

socket.addEventListener('open', e => {
  console.log('websocket connection open');
});

const socketListener = socketMethods => e => {
  const { postComment, numberOfClientUpdate, updateNice } = socketMethods;
  const data = JSON.parse(e.data);
  switch (data.type) {
    case 'message': {
      postComment(data.value);
      break;
    }
    case 'client_number': {
      numberOfClientUpdate(data.value);
      break;
    }
    case 'nice_update': {
      updateNice(data.value.commentId, data.value.nice);
      break;
    }
  }
};

const keyDownListener = onClick => e => {
  if ((e.metaKey || e.ctrlKey) && e.keyCode === 13) {
    onClick();
  }
};

class CommentView extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.keyDownListener = keyDownListener(this.onClick);
    this.socketListener = socketListener(props.socketMethods);
  }
  onClick = () => {
    if (!this.inputRef || !this.inputRef.current) {
      return;
    }
    if (this.inputRef.current.value === '') {
      return;
    }
    socket.send(
      JSON.stringify({ type: 'message', value: this.inputRef.current.value }),
    );
    this.inputRef.current.value = '';
  };
  componentDidMount = () => {
    document.addEventListener('keydown', this.keyDownListener);
    socket.addEventListener('message', this.socketListener);
  };
  componentWillUnmount() {
    document.removeEventListener('keydown', this.keyDownListener);
    socket.removeEventListener('message', this.socketListener);
    this.props.resetComment();
  }
  render() {
    const { comments } = this.props;
    return (
      <div>
        <div>
          {comments
            ? comments.map((v, i) => {
                return (
                  <Comment
                    key={i}
                    id={v.id}
                    message={v.content}
                    addNice={this.props.addNice}
                  />
                );
              })
            : undefined}
        </div>

        <CommentList />

        <div style={styles.container}>
          <div style={styles.inputWrapper}>
            <Input
              autoFocus={true}
              fullWidth={false}
              multiline={true}
              rowsMax={1}
              placeholder={'コメント (ctrl (または cmd) + Enter で送信)'}
              inputRef={this.inputRef}
              style={styles.input}
            />
            <Button
              style={styles.button}
              variant="outlined"
              onClick={this.onClick}
            >
              送信
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default CommentView;
