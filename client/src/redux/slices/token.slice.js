import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import axios from 'axios'

// export const getTodos = createAsyncThunk(
//   'todos/todosFetch',
//   async () => {
//     const response = await axios.get(
//       'https://jsonplaceholder.typicode.com/todos?_limit=5'
//     );
//     return response.data;
//   },
// );



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
