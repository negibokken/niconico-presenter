import { connect } from 'react-redux';
import CommentView from '../../components/CommentView/CommentView';
import {
  postComment,
  resetComment,
  numberOfClientUpdate,
  addNice,
  updateNice,
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
      updateNice: (commentId, nice) => {
        dispatch(updateNice(commentId, nice));
      },
    },
    resetComment: () => {
      dispatch(resetComment());
    },
    addNice: async comment_id => {
      dispatch(await addNice(comment_id));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CommentView);
