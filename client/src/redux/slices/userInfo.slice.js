import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import accountApi from 'apis/accountApi';

export const getUserInfo = createAsyncThunk(
  'userInfo/getUserInfo',
  async () => {
    try {
      const apiRes = await accountApi.fetchUser();
      if (apiRes && apiRes.status === 200) {
        return apiRes.data.user;
      }
      return {};
    } catch (error) {
      throw error;
    }
  },
);



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
  },
  reducers: {

    setDataUser(state, action) {
      const { authType, name, avatar, coin, favoriteList, email, role, createdAt } = action.payload;
      if (!name || name === '') {
        state.isAuth = false;
        return;
      }
      return { authType, isAuth: true, isAdmin: role === 1 ? true : false, name, email, coin, avatar, favoriteList, createdDate: createdAt };
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
  },
  extraReducers: {
    [getUserInfo.fulfilled]: (state, action) => {
      const { username, name, avt, coin, favoriteList } = action.payload;
      if (!username || username === '') {
        state.isAuth = false;
        return;
      }
      return { isAuth: true, username, name, avt, coin, favoriteList };
    },
  },
});

const { reducer, actions } = userInfoSlice;
export const { setAddFavorites, setUserCoin, setUserAvt, setDataUser, setUserAvatar } = actions;
export default reducer;
