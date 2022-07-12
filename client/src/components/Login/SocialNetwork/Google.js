// import accountApi from 'apis/accountApi';
// import ggIcon from 'assets/icons/gg-icon.png';
import { UX } from 'constant';
import React, { useEffect } from 'react';
// import GoogleLogin from 'react-google-login';
import jwt_decode from "jwt-decode";
import { useDispatch } from 'react-redux';
import { setMessage } from 'redux/slices/message.slice';
import { setLogin } from 'redux/slices/userInfo.slice';
import useStyle from './style';
import axios from 'axios';

function LoginGoogle() {
  const classes = useStyle();
  const dispatch = useDispatch();

  const onLoginWithGoogle = async (response) => {
    // let user = jwt_decode(response.credential);
    try {
      const res = await axios.post('/user/google_login', { tokenId: response.credential });
      dispatch(setLogin());
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
  }

  useEffect(() => {
    google.accounts.id.initialize({
      client_id: '750897321524-8ne7bt9nu0rsi3lgkj3uirku0clasef2.apps.googleusercontent.com',
      callback: onLoginWithGoogle
    });
    google.accounts.id.renderButton(
      document.getElementById('signInDiv'),
      { type: 'icon', size: 'large'}
    );
  }, []);

  return (
    <div id="signInDiv"></div>
  );
}

export default LoginGoogle;
