import { configureStore } from '@reduxjs/toolkit';
import messageReducer from './slices/message.slice';
import userInfoReducer from './slices/userInfo.slice';
import voiceReducer from './slices/voice.slice';
import todosReducer from './slices/todo.slice';
import tokensReducer from './slices/token.slice';
import profileSlice from './slices/profile.slice';
import postSlice from './slices/post.slice';
import statusSlice from './slices/status.slice';

const store = configureStore({
  reducer: {
    message: messageReducer,
    userInfo: userInfoReducer,
    voice: voiceReducer,
    todos: todosReducer,
    token: tokensReducer,
    profile: profileSlice,
    post: postSlice,
    status: statusSlice,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
