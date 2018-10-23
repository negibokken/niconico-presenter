import { connect } from 'react-redux';
import CommentView from '../../components/CommentView/CommentView';
import { postComment } from '../../actions/actions';

const mapStateToProps = state => {
  return {
    comments: state.comments
  };
};

const mapDispatchToProps = dispatch => {
  return {
    postComment: value => {
      dispatch(postComment(value));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommentView);
