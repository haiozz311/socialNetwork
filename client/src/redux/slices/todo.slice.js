import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios'

export const getTodos = createAsyncThunk(
  'todos/todosFetch',
  async () => {
    const response = await axios.get(
      'https://jsonplaceholder.typicode.com/todos?_limit=5'
    );
    return response.data;
  },
);



const todoSlice = createSlice({
  name: 'todos',
  initialState: {
    todoList: []
  },
  extraReducers: {
    [getTodos.fulfilled]: (state, action) => {
      state.todoList = action.payload;
    },
  },
});

const { reducer, actions } = todoSlice;
// export const { setAddFavorites, setUserCoin, setUserAvt } = actions;
export default reducer;
