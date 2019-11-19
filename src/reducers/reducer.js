import { constants } from '../constants/constants';

const initialState = {
  comments: [],
  allComments: [
    {
      id: 1,
      user_id: 'dfadsfadsfadf',
      content: 'hellowodfjads;lfjadsklfja;dslfdffadafdafddfajadf',
    },
  ],
  tab: 0,
  sortOption: '1',
  userNum: 1,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.POST_COMMENT: {
      let comments = Array.prototype.concat(state.comments);
      let allComments = JSON.parse(JSON.stringify(state.allComments));
      comments.push(action.payload);
      allComments.push(action.payload);
      return Object.assign({}, state, { comments, allComments });
    }
    case constants.NUMBER_OF_CLIENTS_UPDATE: {
      return Object.assign({}, state, { userNum: action.payload });
    }
    case constants.GET_ALL_COMMENTS: {
      const allComments = action.payload;
      return Object.assign({}, state, { allComments });
    }
    case constants.TOGGLE_TAB: {
      const tab = action.payload;
      return Object.assign({}, state, { tab });
    }
    case constants.ADD_NICE: {
      let allComments = Array.prototype.concat(state.allComments);
      const cid = allComments.findIndex(v => v.id == action.payload);
      if (cid != -1) {
        allComments[cid] = action.payload;
      }
      return Object.assign({}, state, { allComments });
    }
    case constants.SORT_COMMENT: {
      const { sortedComments, sortOption } = action.payload;
      return Object.assign({}, state, {
        allComments: sortedComments,
        sortOption,
      });
    }
    case constants.GET_USER_NUM: {
      return Object.assign({}, state, { userNum: action.payload });
    }
    case constants.RESET_COMMENT: {
      return Object.assign({}, state, { comments: [] });
    }
    default: {
      return state;
    }
  }
};
