import { ThemeProvider } from '@material-ui/core/styles';
import Navigation from 'components/Navigation';
import SpeedDials from 'components/SpeedDial';
import GlobalLoading from 'components/UI/GlobalLoading';
import Message from 'components/UI/Message';
import routerConfig from 'configs/routerConfig';
import theme from 'configs/theme';
import useTheme from 'hooks/useTheme';
import useVoice from 'hooks/useVoice';
import NotFoundPage from 'pages/NotFound';
import React, { Suspense, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { Element } from 'react-scroll';
import { setDataUser } from 'redux/slices/userInfo.slice';
import { setToken } from 'redux/slices/token.slice';
import { setSocket } from 'redux/slices/socket.slice';
import { setNotify } from 'redux/slices/notify.slice';
import accountApi from 'apis/accountApi';
import io from 'socket.io-client';
import SocketClient from './SocketClient';
import CallModal from 'components/UI/CallModal/CallModal';
import Peer from 'peerjs';
import { setPeer } from 'redux/slices/peer.slice';
// import Dictaphone from 'components/UI/Dictaphone/Dictaphone';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const { routes, renderRoutes } = routerConfig;

function App() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { isAuth } = useSelector((state) => state.userInfo);
  const { call } = useSelector((state) => state.call);
  const { refresh_token } = useSelector((state) => state.token);
  const notify = useSelector((state) => state.notify);

  // get and set theme
  useTheme();

  // get window voice and set custom voice
  useVoice();

  useEffect(() => {
    if (isAuth) {
      const getToken = async () => {
        const res = await accountApi.refresh_token();
        dispatch(setToken(res.data.access_token));
      };
      getToken();
    }
  }, [isAuth, dispatch]);

  useEffect(() => {
    if (refresh_token) {
      const getUser = async () => {
        const res = await accountApi.fetchUser(refresh_token);
        dispatch(setDataUser(res.data));
      };
      getUser();
    }
    const socket = io();
    dispatch(setSocket(socket));
    return () => socket.close();
  }, [refresh_token]);

  useEffect(() => {
    if (refresh_token) {
      const getNotify = async () => {
        const res = await accountApi.getNotify(refresh_token);
        dispatch(setNotify(res.data.notifies));
      };
      getNotify();
    }
  }, [refresh_token,dispatch]);

  useEffect(() => {
    const newPeer = new Peer(undefined, {
      host: '/',
      port: '3001',
    });
    console.log({ newPeer });
    dispatch(setPeer(newPeer));
  }, [dispatch]);

  return (
    <>
      {loading ? (
        <GlobalLoading />
      ) : (
        <ThemeProvider theme={theme}>
          <Router>
            <div className="dynonary-app">
                <Element name="scrollTop" />
              <Navigation />
                {/* <Dictaphone /> */}
                {refresh_token && <SocketClient />}
                {Object.keys(call).length > 0 && <CallModal />}
              {/* routes */}
              <Suspense fallback={<GlobalLoading />}>
                <Switch>
                    {renderRoutes(routes, isAuth)}
                  <Route>
                    <NotFoundPage />
                  </Route>
                </Switch>
              </Suspense>

              {/* common component */}
              <div id="_overlay"></div>
              <Message />
                <SpeedDials />
            </div>
          </Router>
        </ThemeProvider>
      )}
    </>
  );
}

export default App;
