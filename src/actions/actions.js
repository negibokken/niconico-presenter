import { constants } from '../constants/constants';
import { socket } from '../utils';
import axios from 'axios';

export const toggleTabs = value => {
  return {
    type: constants.TOGGLE_TAB,
    payload: value,
  };
};

export const postComment = value => {
  return {
    type: constants.POST_COMMENT,
    payload: value,
  };
};

export const getComments = async value => {
  const result = await axios.get('/messages');
  const messages = sortComments(value, result.data);
  return {
    type: constants.GET_ALL_COMMENTS,
    payload: messages,
  };
};

export const addNice = async num => {
  const result = await axios.post(`/messages/${num}`);
  const comment = result.data;
  socket.send(JSON.stringify({ type: 'nice', value: num }));
  return {
    type: constants.ADD_NICE,
    payload: comment,
  };
};

export const updateNice = (commentId, niceNum) => {
  return {
    type: constants.UPDATE_NICE,
    payload: { commentId, niceNum },
  };
};

export const sortComments = (value, comments) => {
  switch (value) {
    case '1':
      return comments.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });
    case '2':
      return comments.sort((a, b) => {
        return a.id - b.id;
      });
    case '3':
      return comments.sort((a, b) => {
        return b.nice - a.nice;
      });
    default:
      return comments;
  }
};

export const sortComment = async (value, comments) => {
  let sortedComments = sortComments(value, comments);
  return {
    type: constants.SORT_COMMENT,
    payload: { sortedComments, sortOption: value },
  };
};

export const getUserNum = async () => {
  const result = await axios.post(`/users`);
  const userNum = result.data;
  return {
    type: constants.GET_USER_NUM,
    payload: userNum,
  };
};

export const resetComment = () => {
  return {
    type: constants.RESET_COMMENT,
  };
};

export const numberOfClientUpdate = num => {
  return {
    type: constants.NUMBER_OF_CLIENTS_UPDATE,
    payload: num,
  };
};
