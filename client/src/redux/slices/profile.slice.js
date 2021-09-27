import { createSlice } from '@reduxjs/toolkit';

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
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
  },
});

const { reducer, actions } = profileSlice;
export const { setUserProfile, follow, unfollow } = actions;
export default reducer;
