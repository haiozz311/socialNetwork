import { configureStore } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import messageReducer from './slices/message.slice';
import userInfoReducer from './slices/userInfo.slice';
import voiceReducer from './slices/voice.slice';
import todosReducer from './slices/todo.slice';
import tokensReducer from './slices/token.slice';
import profileSlice from './slices/profile.slice';
import postSlice from './slices/post.slice';
import statusSlice from './slices/status.slice';
import suggestionSlice from './slices/suggestion.slice';
import socketSlice from './slices/socket.slice';
import notifySlice from './slices/notify.slice';
import messengerSlice from './slices/messenger';
import onlineSlice from './slices/online.slice';
import callSlice from './slices/call.slice';
import peerSlice from './slices/peer.slice';

const reducer = combineReducers({
  message: messageReducer,
  userInfo: userInfoReducer,
  voice: voiceReducer,
  todos: todosReducer,
  token: tokensReducer,
  profile: profileSlice,
  post: postSlice,
  status: statusSlice,
  suggestion: suggestionSlice,
  socket: socketSlice,
  notify: notifySlice,
  messenger: messengerSlice,
  online: onlineSlice,
  call: callSlice,
  peer: peerSlice,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['userInfo'],
};

const persistedReducer = persistReducer(persistConfig, reducer);

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
