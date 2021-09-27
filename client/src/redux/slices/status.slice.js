import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosClient from 'apis/axiosClient';
import { imageUpload } from 'helper/imageUpload';

const URL = process.env.REACT_APP_API_LOCAL_BASE_URL;

export const updatePost = createAsyncThunk(
  'statusPost/update',
  async ({ content, images, refresh_token, statusPost }) => {
    let media = [];
    const imgNewUrl = images.filter(img => !img.url);
    const imgOldUrl = images.filter(img => img.url);
    if (statusPost.content === content
      && imgNewUrl.length === 0
      && imgOldUrl.length === statusPost.images.length
    ) return;
    if (imgNewUrl.length > 0) {
      media = await imageUpload(imgNewUrl);
    }
    const res = await axiosClient.patch(`${URL}/api/post/${statusPost._id}`, { content, images: [...imgOldUrl, ...media] }, {
      headers: { Authorization: refresh_token }
    });
    return res.data.newPost;
  },
);

const tokenSlice = createSlice({
  name: 'statusPost',
  initialState: {
    statusPost: false,
  },
  reducers: {
    setStatus(state, action) {
      state.statusPost = action.payload;
    }
  },
  extraReducers: {
    [updatePost.fulfilled]: (state, action) => {
      state.statusPost = action.payload;
    },
  }
});

const { reducer, actions } = tokenSlice;
export const { setStatus } = actions;
export default reducer;
