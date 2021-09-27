import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosClient from 'apis/axiosClient';
import { imageUpload } from 'helper/imageUpload';

const URL = process.env.REACT_APP_API_LOCAL_BASE_URL;

export const createPost = createAsyncThunk(
  'post/createPost',
  async ({ content, images, refresh_token }) => {
    let media = [];
    if (images.length > 0) {
      media = await imageUpload(images);
    }
    const res = await axiosClient.post(`${URL}/api/posts`, { content, images: media }, {
      headers: { Authorization: refresh_token }
    });
    return res.data.newPost;
  },
);

export const likePostAction = createAsyncThunk(
  'post/likePost',
  async ({ post, userInfo, refresh_token }) => {
    const newPost = { ...post, likes: [...post.likes, userInfo] };
    const res = await axiosClient.patch(`${URL}/api/post/${post._id}/like`, {}, {
      headers: { Authorization: refresh_token }
    });
    console.log({ res });
    return newPost;
  },
);

export const unlikePostAction = createAsyncThunk(
  'post/unlikePost',
  async ({ post, userInfo, refresh_token }) => {
    const newPost = { ...post, likes: post.likes.filter(like => like._id !== userInfo._id) };
    const res = await axiosClient.patch(`${URL}/api/post/${post._id}/unlike`, {}, {
      headers: { Authorization: refresh_token }
    });
    return newPost;
  },
);

const postSlice = createSlice({
  name: 'post',
  initialState: {
    loading: false,
    posts: [],
    result: 0,
    page: 2
  },
  reducers: {
    setPosts(state, action) {
      state.posts = action.payload;
    }
  },
  extraReducers: {
    [createPost.fulfilled]: (state, action) => {
      state.posts.unshift(action.payload);
    },
    [likePostAction.fulfilled]: (state, action) => {
      state.posts = state.posts.map(post => (post._id === action.payload._id ? action.payload : post));
    },
    [unlikePostAction.fulfilled]: (state, action) => {
      state.posts = state.posts.map(post => (post._id === action.payload._id ? action.payload : post));
    },
  },
});

const { reducer, actions } = postSlice;
export const { setPosts } = actions;
export default reducer;
