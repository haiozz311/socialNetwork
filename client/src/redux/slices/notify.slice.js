import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosClient from 'apis/axiosClient';
import { imageUpload } from 'helper/imageUpload';

const URL = process.env.REACT_APP_API_LOCAL_BASE_URL;

export const createNotify = createAsyncThunk(
  'notify/create',
  async ({msg}) => {
    console.log({ msg });
  },
);

const notifySlice = createSlice({
  name: 'statusPost',
  initialState: {
    data: [],
    sound: false
  },
  reducers: {

  },
  extraReducers: {
    [createNotify.fulfilled]: (state, action) => {
      // state.statusPost = action.payload;
    },
  }
});

const { reducer, actions } = notifySlice;
export const { setStatus } = actions;
export default reducer;
