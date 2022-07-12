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
import alanBtn from '@alan-ai/alan-sdk-web';
import { THEME_KEYS } from 'constant';
import Layout from 'components/DashBoard/layout/Layout';
import 'assets/boxicons-2.0.7/css/boxicons.min.css';
import 'assets/css/grid.css';
import 'assets/css/theme.css';
import 'assets/css/index.css';

const { routes, renderRoutes } = routerConfig;

function App() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { isAuth, isAdmin } = useSelector((state) => state.userInfo);
  console.log('isAdmin', isAdmin);
  const { call } = useSelector((state) => state.call);
  const { refresh_token } = useSelector((state) => state.token);
  const notify = useSelector((state) => state.notify);

  // get and set theme
  useTheme();

  // get window voice and set custom voice
  useVoice();

  // alan AI
  useEffect(() => {
    if (!isAdmin) {
      alanBtn({
        key: '45dd0e731210d7283ec88a47d81cf40a2e956eca572e1d8b807a3e2338fdd0dc/stage',
        onCommand: ({ command }) => {
          // if (commandData.command === 'go:back') {
          //   // Call the client code that will react to the received command
          // }
          if (command === 'register') {
            window.location.href = 'http://localhost:3000/register';
          }
          if (command === '1000-communication-phrase') {
            window.location.href = 'http://localhost:3000/1000-communication-phrase';
          }
          if (command === 'login') {
            window.location.href = 'http://localhost:3000/login';
          }
          if (command === 'home') {
            window.location.href = 'http://localhost:3000';
          }
          if (command === 'flashcard') {
            window.location.href = 'http://localhost:3000/flashcard';
          }
          if (command === 'learn-IPA') {
            window.location.href = 'http://localhost:3000/IPA';
          }
          if (command === 'dictionary') {
            window.location.href = 'http://localhost:3000/dyno-dictionary';
          }
          if (command === 'favorite') {
            window.location.href = 'http://localhost:3000/favorite-vocab';
          }
          if (command === 'grammar') {
            window.location.href = 'http://localhost:3000/grammar';
          }
          if (command === 'games') {
            window.location.href = 'http://localhost:3000/games';
          }
          if (command === 'games/correct-word') {
            window.location.href = 'http://localhost:3000/games/correct-word';
          }
          if (command === 'leaderboard') {
            window.location.href = 'http://localhost:3000/leaderboard';
          }
          if (command === 'games/word-match') {
            window.location.href = 'http://localhost:3000/games/word-match';
          }
          if (command === 'games/fast-game') {
            window.location.href = 'http://localhost:3000/games/fast-game';
          }
          if (command === 'irregular-verbs') {
            window.location.href = 'http://localhost:3000/irregular-verbs';
          }
          if (command === 'contribution') {
            window.location.href = 'http://localhost:3000/contribution';
          }
          if (command === 'social') {
            window.location.href = 'http://localhost:3000/social';
          }
          if (command === 'dark-mode') {
            localStorage.setItem(THEME_KEYS.LS_KEY, THEME_KEYS.DARK);
            window.location.reload();
          }
          if (command === 'light-mode') {
            localStorage.setItem(THEME_KEYS.LS_KEY, THEME_KEYS.LIGHT);
            window.location.reload();
          }
          if (command === 'FB-login') {
            window.location.href = 'http://localhost:3000/login';
            document.getElementById('login-facebook').click();
          }
        }
      });
    }
  }, []);

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
  }, [refresh_token, dispatch]);

  useEffect(() => {
    const newPeer = new Peer(undefined, {
      host: '/',
      port: '3001',
    });
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
                {!isAdmin && <Navigation />}
              {/* <Dictaphone /> */}
              {refresh_token && <SocketClient />}
              {Object.keys(call).length > 0 && <CallModal />}
              {/* routes */}
              <Suspense fallback={<GlobalLoading />}>
                  <Switch>
                    {
                      isAdmin ? <Layout /> : renderRoutes(routes, isAuth)
                    }
                  <Route>
                    <NotFoundPage />
                  </Route>
                </Switch>
              </Suspense>

              {/* common component */}
              <div id="_overlay"></div>
                <Message />
                {
                  !isAdmin && <SpeedDials />
                }

            </div>
          </Router>
        </ThemeProvider>
      )}
    </>
  );
}

export default App;
