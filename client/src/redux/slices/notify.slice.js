import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosClient from 'apis/axiosClient';

const URL = process.env.REACT_APP_API_LOCAL_BASE_URL;

export const isReadNotify = createAsyncThunk(
  'notify/isReadNotify',
  async ({msg,refresh_token}) => {
    await axiosClient.patch(
      `${URL}/api/isReadNotify/${msg._id}`,
      {},
      {
        headers: { Authorization: refresh_token },
      },
    );
    return { ...msg, isRead: true };
  },
);

export const deleteAllNotify = createAsyncThunk(
  'notify/deleteAllNotify',
  async ({ refresh_token }) => {
    await axiosClient.delete(
      `${URL}/api/deleteAllNotify`,
      {
        headers: { Authorization: refresh_token },
      },
    );
    let data = [];
    return data;
  },
);

const notifySlice = createSlice({
  name: 'statusPost',
  initialState: {
    data: [],
    sound: false
  },
  reducers: {
    setNotify(state, action) {
      state.data = (action.payload);
    },
    AddNotify(state, action) {
      state.data.unshift(action.payload);
    },
    RemoveNotify(state, action) {
      const data = state.data.filter(item => (
        item.id !== action.payload.id || item.url !== action.payload.url
      ));
      state.data = data;
      console.log("data", data);
    },

  },
  extraReducers: {
    [isReadNotify.fulfilled]: (state, action) => {
      console.log("action", action.payload);
      const newData = state.data.map(item =>
        (item._id === action.payload._id ? action.payload : item)
      );
      state.data = newData;
    },
    [deleteAllNotify.fulfilled]: (state, action) => {
      state.data = action.payload;
    },
  }
});

const { reducer, actions } = notifySlice;
export const { setNotify, AddNotify, RemoveNotify } = actions;
export default reducer;
