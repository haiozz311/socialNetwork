import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosClient from 'apis/axiosClient';
const URL = process.env.REACT_APP_API_LOCAL_BASE_URL;

export const addMessage = createAsyncThunk(
  'messenger/addMessage',
  async ({ msg, userInfor, refresh_token, socket }) => {
    console.log('redux', { msg, userInfor, refresh_token, socket });
    const { _id, avatar, name } = userInfor;
    socket.emit('addMessage', { ...msg, user: { _id, avatar, name } });
    const res = await axiosClient.post(
      `${URL}/api/message`,
      { msg },
      {
        headers: { Authorization: refresh_token },
      },
    );
    console.log('data res addmessage', { res });
    return msg;
  },
);

export const getConversations = createAsyncThunk(
  'messenger/getConversations',
  async ({ userInfor, refresh_token, page = 1 }) => {
    const res = await axiosClient.get(`${URL}/api/conversations?limit=${page * 9}`, {
      headers: { Authorization: refresh_token }
    });

    console.log('res', res);

    let newArr = [];
    res.data.conversations.forEach(item => {
      item.recipients.forEach(cv => {
        if (cv._id !== userInfor._id) {
          newArr.push({ ...cv, text: item.text, media: item.media });
        }
      });
    });
    console.log('newArr', newArr);
    return { newArr, result: res.data.result };
  },
);

export const getMessages = createAsyncThunk(
  'messenger/getMessages',
  async ({ refresh_token, id, page = 1 }) => {
    const res = await axiosClient.get(`${URL}/api/message/${id}?limit=${page * 9}`, {
      headers: { Authorization: refresh_token }
    });
    const data = res.data;
    // console.log('res123', res);
    return data;
  },
);

export const loadMoreMessages = createAsyncThunk(
  'messenger/loadMoreMessages',
  async ({ refresh_token, id, page = 1 }) => {
    const res = await axiosClient.get(`${URL}/api/message/${id}?limit=${page * 9}`, {
      headers: { Authorization: refresh_token }
    });
    const newData = { ...res.data, messages: res.data.messages.reverse() };
    return { ...newData, _id: id, page };
  },
);

export const deleteMessages = createAsyncThunk(
  'messenger/deleteMessages',
  async ({ msg, data, refresh_token }) => {
    console.log('remove', { msg, data, refresh_token });
    const newData = data.filter(item => item._id !== msg._id);
    await axiosClient.delete(`${URL}/api/message/${msg._id}`, {
      headers: { Authorization: refresh_token }
    });
    const result = { newData, _id: msg.recipient };
    console.log('result', result);
    return result;
  },
);

export const deleteConversation = createAsyncThunk(
  'messenger/deleteConversation',
  async ({ refresh_token, id }) => {
    await axiosClient.delete(`${URL}/api/conversation/${id}`, {
      headers: { Authorization: refresh_token }
    });
    return id;
  },
);

const messengerSlice = createSlice({
  name: 'messenger',
  initialState: {
    users: [],
    resultUsers: 0,
    data: [],
    firstLoad: false
  },
  reducers: {
    addUser(state, action) {
      if (state.users.every(item => item._id !== action.payload._id)) {
        state.users.push(action.payload);
      }
    },
    checkUserOnlineOffline(state, action) {
      state.users = state.users.map(user =>
        action.payload.includes(user._id)
          ? { ...user, online: true }
          : { ...user, online: false }
      );
    },

    addMessageSocket(state, action) {
      state.data.push(action.payload);
      state.users.map(user =>
        user._id === action.payload.recipient || user._id === action.payload.sender
          ? { ...user, text: action.payload.text, media: action.payload.media }
          : user
      );
    }
  },
  extraReducers: {
    [addMessage.fulfilled]: (state, action) => {
      console.log('action addmessage', action.payload);
      state.data.push(action.payload);
      state.users.map(user =>
        user._id === action.payload.recipient || user._id === action.payload.sender
          ? { ...user, text: action.payload.text, media: action.payload.media }
          : user
      );
    },
    [getConversations.fulfilled]: (state, action) => {
      state.users = action.payload.newArr;
      state.resultUsers = action.payload.result;
      state.firstLoad = true;
    },
    [getMessages.fulfilled]: (state, action) => {
      console.log('action', action.payload);
      state.data = action.payload.messages.reverse();
      state.resultUsers = action.payload.result;
    },
    [loadMoreMessages.fulfilled]: (state, action) => {
      const newData = state.data.map(item =>
        (item._id === action.payload._id ? action.payload : item)
      );
      state.data = newData;
    },
    [deleteMessages.fulfilled]: (state, action) => {
      state.data = action.payload.newData;
    },
    [deleteConversation.fulfilled]: (state, action) => {
      console.log('id', action.payload);
      state.data = state.data.filter(item => item._id !== action.payload);
      state.users = state.users.filter(item => item._id !== action.payload);
    },
  }
});

const { reducer, actions } = messengerSlice;
export const { addUser, addMessageSocket, checkUserOnlineOffline } = actions;
export default reducer;
