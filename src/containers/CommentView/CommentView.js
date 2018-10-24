import { connect } from 'react-redux';
import CommentView from '../../components/CommentView/CommentView';
import { postComment, resetComment } from '../../actions/actions';

const mapStateToProps = state => {
  return {
    comments: state.comments
  };
};

const mapDispatchToProps = dispatch => {
  return {
    postComment: value => {
      dispatch(postComment(value));
    },
    resetComment: () => {
      dispatch(resetComment());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommentView);
