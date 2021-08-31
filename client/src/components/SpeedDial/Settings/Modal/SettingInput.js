import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import useStyle from './style';
import accountApi from 'apis/accountApi';
import { isEmail } from 'helper/index';
import LoopIcon from '@material-ui/icons/Loop';
import { setMessage } from 'redux/slices/message.slice';

const initialState = {
  email: ''
};

function SettingInput({ open, onClose }) {
  const [loading, setLoading] = useState(false);
  const classes = useStyle();
  const [data, setData] = useState(initialState);
  const dispatch = useDispatch();

  const { email } = data;

  const handleChangeInput = e => {
    const { name, value } = e.target;
    console.log({ name, value });
    setData({ ...data, [name]: value });
  };

  const forgotPassword = async () => {
    if (!isEmail(email)) {
      dispatch(
        setMessage({ message: 'Định dạng email chưa đúng', type: 'error' }),
      );
      return setData({ ...data });
    }

    try {
      setLoading(true);
      const res = await accountApi.forgotPassword(email);
      if (res.status = 200) {
        dispatch(
          setMessage({ message: res.data.msg, type: 'success' }),
        );
      }
      setLoading(false);
    } catch (err) {
      dispatch(
        setMessage({ message: 'Email này chưa tồn tại !', type: 'error' }),
      );
      setLoading(false);
    }
  };

  return (
    <Dialog
      classes={{
        paper: classes.rootPaper,
      }}
      onClose={onClose}
      aria-labelledby="setting dialog"
      disableBackdropClick={true}
      maxWidth="md"
      open={open}>
      <div className={`${classes.title} flex-center-between`}>
        <span>Quên mật khẩu</span>
        <CloseIcon className="cur-pointer" onClick={onClose} />
      </div>

      <DialogContent classes={{ root: classes.content }}>
        <div className={classes.contentItem}>
          <h2 className={classes.contentLabel}>Nhập email của bạn</h2>
          <TextField id="outlined-basic" type="email" name="email" value={email} onChange={handleChangeInput} label="Email" fullWidth />
          <Button
            className="_btn _btn-primary mt-8"
            onClick={forgotPassword}
            color="primary"
            size="small"
            disabled={loading}
            endIcon={loading && <LoopIcon className="ani-spin" />}
            variant="contained">
            verify email
          </Button>
        </div>
      </DialogContent>

      <DialogActions className={classes.actions}>
        <Button
          className="_btn _btn-primary"
          onClick={onClose}
          color="primary"
          size="small"
          variant="contained">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}

SettingInput.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};

SettingInput.defaultProps = {
  onClose: function () { },
  open: false,
};

export default SettingInput;
