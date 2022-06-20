import { createSlice } from '@reduxjs/toolkit';

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    color:'',
    mode: '',
  },
  reducers: {
    settMode(state, action) {
      console.log('settMode');
      return { ...state,mode: action.payload };
    },
    setColor(state, action) {
      console.log('setColor');
      return { ...state,color: action.payload };
    },
  },
});

const { reducer, actions } = themeSlice;
export const { setColor, settMode } = actions;
export default reducer;
