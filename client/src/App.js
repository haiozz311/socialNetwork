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
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Element } from 'react-scroll';
import { getUserInfo, setDataUser } from 'redux/slices/userInfo.slice';
import { getTodos } from 'redux/slices/todo.slice';
import { setToken } from 'redux/slices/token.slice';
import accountApi from 'apis/accountApi';

const { routes, renderRoutes } = routerConfig;

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { isAuth } = useSelector((state) => state.userInfo);
  const { refresh_token } = useSelector(state => state.token);

  // get and set theme
  useTheme();

  // get window voice and set custom voice
  useVoice();

  useEffect(() => {
    const firstLogin = localStorage.getItem('firstLogin');
    if (firstLogin) {
      const getToken = async () => {
        const res = await accountApi.refresh_token();
        dispatch(setToken(res.data.access_token));
      };
      getToken();
    }
  }, [isAuth, dispatch]);

  useEffect(() => {
    console.log("refresh_token", refresh_token)
    if (refresh_token) {
      const getUser = async () => {

        const res = await accountApi.fetchUser(refresh_token);
        dispatch(setDataUser(res.data));
      };
      getUser();
    }
  }, [refresh_token, dispatch]);

  // get user info
  useEffect(() => {
    dispatch(getTodos());
    // dispatch(getUserInfo());
    setLoading(false);
    return () => { };
  }, []);

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
