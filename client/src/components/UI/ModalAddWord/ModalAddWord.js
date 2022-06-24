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
import WordContributionData from 'components/Contribution/Word/data';
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
function ModalAddWord({ open, onClose }) {
  const classes = useStyle();
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
        <span>Thêm từ vựng</span>
        <CloseIcon className="cur-pointer" onClick={onClose} />
      </div>

      <DialogContent classes={{ root: classes.content }}>
        <WordContributionData />
      </DialogContent>
    </Dialog>
  );
}

ModalAddWord.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};

ModalAddWord.defaultProps = {
  onClose: function () { },
  open: false,
};

export default ModalAddWord;
