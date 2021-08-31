import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import LoopIcon from '@material-ui/icons/Loop';
import { useDispatch } from 'react-redux';
import { setMessage } from 'redux/slices/message.slice';
import { isLength, isMatch } from 'helper/index';
import accountApi from 'apis/accountApi';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { UX } from 'constant';

const useStyles = makeStyles(() => ({
  title: {
    textTransform: 'uppercase',
    fontSize: '3rem',
  },

  contain: {
    marginTop: '8rem',
    maxWidth: '60rem',
    textAlign: 'center',
    margin: '0 auto',
  },

  coverBlock: {
    position: 'relative'
  },

  coverItem: {
    position: 'absolute',
    top: '1.5rem',
    right: 0,
  }

}));


const initialState = {
  password: '',
  cf_password: ''
}
const ResetPassword = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState(initialState);
  const { token } = useParams();
  const { password, cf_password } = data;
  const [loading, setLoading] = useState(false);
  const [visiblePw, setVisiblePw] = useState(false);
  const [visiblePwcf, setVisiblePwcf] = useState(false);
  const classes = useStyles();

  const handleChangeInput = e => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleResetPass = async () => {
    if (isLength(password)) {
      dispatch(
        setMessage({ message: 'Mật khẩu phải ít nhất 6 kí tự', type: 'error' }),
      );
      return setData({ ...data });
    }


    if (!isMatch(password, cf_password)) {
      dispatch(
        setMessage({ message: 'Mật khẩu không giống nhau', type: 'error' }),
      );
      return setData({ ...data });
    }


    try {
      setLoading(true);
      const res = await accountApi.resetPassword(password, token);
      if (res.status = 200) {
        dispatch(
          setMessage({ message: res.data.msg, type: 'success' }),
        );
      }
      setTimeout(() => {
        window.location.href = '/';
      }, UX.DELAY_TIME);


    } catch (err) {
      dispatch(
        setMessage({ message: 'thất bại, thử lại !', type: 'error' }),
      );
    }

  }
  return (
    <div className="container">
      <div className={`${classes.contain}`}>
        <h2 className={`${classes.title}`}>Cập nhật mật khẩu của bạn</h2>
        <div className={`${classes.coverBlock} mt-8`}>
          <TextField inputProps={{
            type: visiblePw ? 'text' : 'password',
          }}
            name="password" id="password" value={password} onChange={handleChangeInput} label="Mật Khẩu" fullWidth />
          {visiblePw ? <VisibilityIcon onClick={() => setVisiblePw(!visiblePw)} className={`${classes.coverItem}`} />
            : <VisibilityOffIcon onClick={() => setVisiblePw(!visiblePw)} className={`${classes.coverItem}`} />}
        </div>

        <div className={`${classes.coverBlock} mt-8`}>
          <TextField inputProps={{
            type: visiblePw ? 'text' : 'password',
          }} name="cf_password" id="cf_password" value={cf_password} onChange={handleChangeInput} label="Nhập lại mật khẩu" fullWidth />
          {visiblePwcf ? <VisibilityIcon onClick={() => setVisiblePwcf(!visiblePwcf)} className={`${classes.coverItem}`} />
            : <VisibilityOffIcon onClick={() => setVisiblePwcf(!visiblePwcf)} className={`${classes.coverItem}`} />}
        </div>


        <Button
          className="_btn _btn-primary mt-8"
          onClick={handleResetPass}
          color="primary"
          size="small"
          disabled={loading}
          endIcon={loading && <LoopIcon className="ani-spin" />}
          variant="contained">
          Cập nhật
        </Button>
      </div>
    </div>
  )
}

export default ResetPassword;
