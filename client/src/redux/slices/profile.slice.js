import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosClient from 'apis/axiosClient';
const URL = process.env.REACT_APP_API_LOCAL_BASE_URL;
import { createPost } from './post.slice';


export const getProfileUsers = createAsyncThunk(
  'profile/getProfileUsers',
  async ({ id, refresh_token }) => {
    const users = await axiosClient.get(`${URL}/user/getUser/${id}`, {
      headers: { Authorization: refresh_token }
    });
    const posts = await axiosClient.get(`${URL}/api/user_posts/${id}`, {
      headers: { Authorization: refresh_token }
    });

    const data = {
      id,
      users: users.data,
      posts: { ...posts.data, _id: id }
    };
    return data;

  },
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    ids: [],
    users: [],
    posts: []
  },
  reducers: {
    setUserProfile(state, action) {
      const { users, id } = action.payload;
      if (state.users.every(user => user._id !== id)) {
        state.users.push(users);
      }
    },
    follow(state, action) {
      const { users, user, auth } = action.payload;
      const newUser = { ...user, followers: [...user.followers, auth] };
      state.users = state.users.map(user => (user._id === newUser._id ? newUser : user));
    },
    unfollow(state, action) {
      const { users, user, auth } = action.payload;
      const newUser = { ...user, followers: user.followers.filter(item => item._id !== auth._id) };
      const data = users.map(user => (user._id === newUser._id ? newUser : user));
      state.users = data;
    },
    setIds(state, action) {
      state.ids.push(action.payload);
    },
  },
  extraReducers: {
    [getProfileUsers.fulfilled]: (state, action) => {
      state.ids.push(action.payload.id);
      state.users.push(action.payload.users.user);
      state.posts.push(action.payload.posts);
    },
    [createPost.fulfilled]: (state, action) => {
      state.posts.unshift(action.payload);
    },
  }
});

const { reducer, actions } = profileSlice;
export const { setUserProfile, follow, unfollow, setIds } = actions;
export default reducer;

