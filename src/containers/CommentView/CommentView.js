import { connect } from 'react-redux';
import CommentView from '../../components/CommentView/CommentView';
import {
  postComment,
  resetComment,
  numberOfClientUpdate,
} from '../../actions/actions';

const mapStateToProps = state => {
  return {
    comments: state.comments,
    allComments: state.allComments,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    socketMethods: {
      postComment: value => {
        dispatch(postComment(value));
      },
      numberOfClientUpdate: value => {
        dispatch(numberOfClientUpdate(value));
      },
    },
    resetComment: () => {
      dispatch(resetComment());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CommentView);
