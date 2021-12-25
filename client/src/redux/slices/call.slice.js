import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosClient from 'apis/axiosClient';
const URL = process.env.REACT_APP_API_LOCAL_BASE_URL;

const onlineSlice = createSlice({
  name: 'call',
  initialState: {
    call: [],
  },
  reducers: {
    setCall(state, action) {
      state.call = action.payload;
    },
  },
  extraReducers: {
    // [createPost.fulfilled]: (state, action) => {
    //   state.posts.unshift(action.payload);
    // },
  }
});

const { reducer, actions } = onlineSlice;
export const { setCall } = actions;
export default reducer;

