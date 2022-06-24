/* eslint-disable react/jsx-key */
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import CloseIcon from '@material-ui/icons/Close';
import Avatar from '@material-ui/core/Avatar';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import LoopIcon from '@material-ui/icons/Loop';
import InputCustom from 'components/UI/InputCustom';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import useStyle from './style';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { MAX, MIN, REGEX } from 'constant';
import * as yup from 'yup';


import AccountCircleIcon from '@material-ui/icons/AccountCircle';

const schema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .required('Nhập email')
    .email('Email không hợp lệ')
    .max(MAX.EMAIL_LEN, `Email tối đa ${MAX.EMAIL_LEN}`),
  name: yup
    .string()
    .trim()
    .required('Nhập họ tên')
    .max(MAX.NAME_LEN, `Họ tên tối đa ${MAX.NAME_LEN} ký tự`)
    .matches(REGEX.NAME, 'Họ tên không chứ số và ký tự đặc biệt'),
  password: yup
    .string()
    .trim()
    .required('Nhập mật khẩu')
    .min(MIN.PASSWORD_LEN, `Mật khẩu ít nhất ${MIN.PASSWORD_LEN} ký tự`)
    .max(MAX.PASSWORD_LEN, `Mật khẩu tối đa ${MAX.PASSWORD_LEN}`),
});
function AddUser({ open, onClose, onRegister, loading }) {
  const classes = useStyle();
  const [visiblePw, setVisiblePw] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
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
        <span>Tạo tài khoản</span>
        <CloseIcon className="cur-pointer" onClick={onClose} />
      </div>

      <DialogContent classes={{ root: classes.content }}>
        <form
          className={`${classes.root} flex-col`}
          onSubmit={handleSubmit(onRegister)}
          autoComplete="off">
          <div className="flex-col mb-4">
            <InputCustom
              label="Email"
              size="small"
              placeholder="Nhập email"
              error={Boolean(errors.email)}
              inputProps={{
                name: 'email',
                maxLength: MAX.EMAIL_LEN,
                autoFocus: true,
                ...register('email'),
              }}
            />
            {errors.email && <p className="text-error">{errors.email?.message}</p>}
          </div>

          <div className="flex-col mb-4">
            <InputCustom
              label="Họ tên"
              size="small"
              placeholder="Nhập họ tên"
              error={Boolean(errors.name)}
              inputProps={{
                name: 'name',
                maxLength: MAX.NAME_LEN,
                ...register('name'),
              }}
            />
            {errors.name && <p className="text-error">{errors.name?.message}</p>}
          </div>

          <div className="flex-col mb-4">
            <InputCustom
              label="Mật khẩu"
              size="small"
              placeholder="Nhập mật khẩu"
              error={Boolean(errors.password)}
              inputProps={{
                name: 'password',
                maxLength: MAX.PASSWORD_LEN,
                type: visiblePw ? 'text' : 'password',
                ...register('password'),
              }}
              endAdornment={
                visiblePw ? (
                  <VisibilityIcon
                    className={`${classes.icon} ${classes.visiblePw}`}
                    onClick={() => setVisiblePw(false)}
                  />
                ) : (
                  <VisibilityOffIcon
                    className={classes.icon}
                    onClick={() => setVisiblePw(true)}
                  />
                )
              }
            />
            {errors.password && (
              <p className="text-error">{errors.password?.message}</p>
            )}
          </div>

          <Button
            className="_btn _btn-primary"
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            endIcon={loading && <LoopIcon className="ani-spin" />}
            size="large">
            Đăng ký
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

AddUser.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  onRegister: PropTypes.func,
  loading: PropTypes.bool,
};

AddUser.defaultProps = {
  onClose: function () { },
  open: false,
};

export default AddUser;
