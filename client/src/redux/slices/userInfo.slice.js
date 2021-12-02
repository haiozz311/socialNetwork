import { createSlice } from '@reduxjs/toolkit';

const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState: {
    isAuth: false,
    isAdmin: false,
    authType: '',
    role: 0,
    name: '',
    avatar: '',
    favoriteList: [],
    coin: 0,
    user: [],
    createdDate: '',
    _id: '',
    followers: [],
    following: [],
  },
  reducers: {

    setDataUser(state, action) {
      console.log('setDataUser', action);
      const { authType, name, avatar, coin, favoriteList, email, role, createdAt, _id, followers, following } = action.payload;
      if (!name || name === '') {
        state.isAuth = false;
        return;
      }
      return { authType, isAuth: true, isAdmin: role === 1 ? true : false, name, email, coin, avatar, favoriteList, createdDate: createdAt, _id, followers, following };
    },

    setUserAvatar(state, action) {
      state.avatar = action.payload;
    },

    setAddFavorites(state, action) {
      const { word, isAdd = true } = action.payload;

      if (isAdd) {
        state.favoriteList.push(word);
      } else {
        state.favoriteList = state.favoriteList.filter((i) => i !== word);
      }
    },

    setUserCoin(state, action) {
      state.coin = action.payload;
    },

    setUserAvt(state, action) {
      state.avt = action.payload;
    },

    FollowAuth(state, action) {
      const { user, auth } = action.payload;
      const newUser = { ...user, following: [...user.following, auth] };
      state.following.push(newUser);
    },

    UnFollowAuth(state, action) {
      const { users, user, auth } = action.payload;
      console.log({ users, user, auth })
      // const newUser = { ...user, following: user.following.filter(item => item._id !== auth._id) };
      // const data = users.map(item => (item._id !== newUser._id ? newUser : item));
      // console.log({ data })
      const data = users.filter(item => (item._id !== user._id));
      console.log({ data });
      state.following = data;
      // return state.following;
    },

    setLogout(state, action) {
      state.isAuth = false;
    },

    setLogin(state, action) {
      state.isAuth = true;
    },
  },
});

const { reducer, actions } = userInfoSlice;
export const { setAddFavorites, setUserCoin, setUserAvt, setDataUser, setUserAvatar, FollowAuth, UnFollowAuth, setLogout, setLogin } = actions;
export default reducer;
