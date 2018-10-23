import { constants } from '../constants/constants';

const initialState = {
  comments: [],
  allComments: [],
  tab: 0,
  sortOption: 1,
  userNum: 1
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.POST_COMMENT:
      let comments = Array.prototype.concat(state.comments);
      comments.push(action.payload);
      return Object.assign({}, state, { comments });
    case constants.GET_ALL_COMMENTS:
      const allComments = action.payload;
      return Object.assign({}, state, { allComments });
    case constants.TOGGLE_TAB:
      const tab = action.payload;
      return Object.assign({}, state, { tab });
    case constants.ADD_NICE:
      return Object.assign({}, state, { allComments: action.payload });
    case constants.SORT_COMMENT:
      const { sortedComments, sortOption } = action.payload;
      return Object.assign({}, state, {
        allComments: sortedComments,
        sortOption
      });
    case constants.GET_USER_NUM:
      return Object.assign({}, state, { userNum: action.payload });
    default:
      return state;
  }
};
