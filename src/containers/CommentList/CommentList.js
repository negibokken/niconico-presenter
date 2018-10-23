import { connect } from 'react-redux';
import CommentList from '../../components/CommentList/CommentList';
import {
  addNice,
  getComments,
  postComment,
  sortComment
} from '../../actions/actions';

const mapStateToProps = state => {
  return {
    allComments: state.allComments,
    sortOption: state.sortOption
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getComments: async value => {
      dispatch(await getComments(value));
    },
    addNice: async (num, value) => {
      dispatch(await addNice(num, value));
    },
    postComment: async value => {
      dispatch(await postComment(value));
    },
    sortComment: async (value, comments) => {
      dispatch(await sortComment(value, comments));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommentList);
