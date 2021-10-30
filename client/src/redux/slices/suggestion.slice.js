import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosClient from 'apis/axiosClient';

const URL = process.env.REACT_APP_API_LOCAL_BASE_URL;

export const getSuggestions = createAsyncThunk(
  'suggestion/getSuggestions',
  async ({ refresh_token }) => {
    const res = await axiosClient.get(`${URL}/user/suggestionsUser`, {
      headers: { Authorization: refresh_token }
    });
    return res.data.users;
  },
);

const suggestionSlice = createSlice({
  name: 'suggestion',
  initialState: {
    users: [],
  },
  extraReducers: {
    [getSuggestions.fulfilled]: (state, action) => {
      state.users = action.payload;
    },
  },
});


const { reducer, actions } = suggestionSlice;
export default reducer;
