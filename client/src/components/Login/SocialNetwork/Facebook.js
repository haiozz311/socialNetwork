import accountApi from 'apis/accountApi';
import fbIcon from 'assets/icons/fb-icon.png';
import { UX } from 'constant';
import React from 'react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { useDispatch } from 'react-redux';
import { setMessage } from 'redux/slices/message.slice';
import useStyle from './style';
import axios from 'axios';

function LoginFacebook() {
  const classes = useStyle();
  const dispatch = useDispatch();

  // handle success login

  const responseFacebook = async (response) => {
    try {
      const { accessToken, userID } = response;
      const res = await axios.post('/user/facebook_login', { accessToken, userID });
      localStorage.setItem('firstLogin', true);
      if (res.status === 200) {
        dispatch(
          setMessage({
            type: 'success',
            message: 'Đăng nhập thành công',
            duration: UX.DELAY_TIME,
          }),
        );

        setTimeout(() => {
          location.href = '/';
        }, UX.DELAY_TIME);
      }
    } catch (err) {
      dispatch(
        setMessage({
          type: 'error',
          message: err.response.data.msg,
          duration: UX.DELAY_TIME,
        }),
      );
    }
  };

  return (
    <FacebookLogin
      appId={process.env.REACT_APP_FACEBOOK_CLIENT_ID}
      autoload={false}
      callback={responseFacebook}
      render={(renderProps) => (
        <div className={classes.socialBtn} onClick={renderProps.onClick}>
          <img className={classes.socialImg} src={fbIcon} alt="FB" />
          <span className={classes.socialName}>Facebook</span>
        </div>
      )}
    />
  );
}

export default LoginFacebook;
