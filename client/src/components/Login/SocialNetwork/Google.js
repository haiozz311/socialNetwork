// import accountApi from 'apis/accountApi';
import ggIcon from 'assets/icons/gg-icon.png';
import { UX } from 'constant';
import React from 'react';
import GoogleLogin from 'react-google-login';
import { useDispatch } from 'react-redux';
import { setMessage } from 'redux/slices/message.slice';
import useStyle from './style';
import axios from 'axios';

function LoginGoogle() {
  const classes = useStyle();
  const dispatch = useDispatch();


  const onLoginWithGoogle = async (response) => {
    try {
      const res = await axios.post('/user/google_login', { tokenId: response.tokenId });
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
    <GoogleLogin
      clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
      autoLoad={false}
      render={(renderProps) => (
        <div
          onClick={renderProps.onClick}
          disabled={renderProps.disabled}
          className={classes.socialBtn}>
          <img className={classes.socialImg} src={ggIcon} alt="GG" />
          <span className={classes.socialName}>Google</span>
        </div>
      )}
      onSuccess={onLoginWithGoogle}
      onFailure={onLoginWithGoogle}
      cookiePolicy={'single_host_origin'}
    />
  );
}

export default LoginGoogle;
