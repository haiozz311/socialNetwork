import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const tokenSlice = createSlice({
  name: 'token',
  initialState: {
    refresh_token: ''
  },
  reducers: {
    setToken(state, action) {
      state.refresh_token = action.payload;
    }
  }
  // extraReducers: {
  //   [getTodos.fulfilled]: (state, action) => {
  //     state.todoList = action.payload;
  //   },
  // },
});

const { reducer, actions } = tokenSlice;
export const { setToken } = actions;
export default reducer;
