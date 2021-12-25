import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosClient from 'apis/axiosClient';
const URL = process.env.REACT_APP_API_LOCAL_BASE_URL;

const peerSlice = createSlice({
  name: 'peer',
  initialState: {
    peer: [],
  },
  reducers: {
    setPeer(state, action) {
      state.peer = action.payload;
    },
  },
  extraReducers: {
    // [createPost.fulfilled]: (state, action) => {
    //   state.posts.unshift(action.payload);
    // },
  }
});

const { reducer, actions } = peerSlice;
export const { setPeer } = actions;
export default reducer;

