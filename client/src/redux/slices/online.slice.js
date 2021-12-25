import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosClient from 'apis/axiosClient';
const URL = process.env.REACT_APP_API_LOCAL_BASE_URL;
import { createPost } from './post.slice';

const onlineSlice = createSlice({
  name: 'online',
  initialState: {
    online: [],
  },
  reducers: {
    setOnline(state, action) {
      state.online.push(action.payload);
    },
    setOffline(state, action) {
      state.online = state.online.filter(item => item !== action.payload);
    },
  },
  extraReducers: {
    // [createPost.fulfilled]: (state, action) => {
    //   state.posts.unshift(action.payload);
    // },
  }
});

const { reducer, actions } = onlineSlice;
export const { setOnline,setOffline } = actions;
export default reducer;

