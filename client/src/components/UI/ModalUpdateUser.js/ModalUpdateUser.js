/* eslint-disable react/jsx-key */
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import LoopIcon from '@material-ui/icons/Loop';
import InputCustom from 'components/UI/InputCustom';
import useStyle from './style';
import SelectCustom from 'components/UI/SelectCustom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { MAX, ROLE_TYPES } from 'constant';
import * as yup from 'yup';



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
    .max(MAX.NAME_LEN, `Họ tên tối đa ${MAX.NAME_LEN} ký tự`),
  coin: yup
    .number()
    .required('Nhập coin cho người dùng')
    .max(MAX.COIN, `Số coin tối đa ${MAX.COIN}`),
});
function AddUser({ open, item, onClose, onRegister, loading }) {
  const classes = useStyle();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  console.log('role', item.role);
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
        <span>Cập nhật tài khoản</span>
        <CloseIcon className="cur-pointer" onClick={onClose} />
      </div>

      <DialogContent classes={{ root: classes.content }}>
        <form
          className={`${classes.root} flex-col`}
          onSubmit={handleSubmit(onRegister)}
          autoComplete="off">
          <div className="flex-col mb-4">
            <InputCustom
              label="Họ tên"
              size="small"
              placeholder="Nhập tên"
              error={Boolean(errors.name)}
              defaultValue={item?.name}
              inputProps={{
                name: 'name',
                autoFocus: true,
                ...register('name'),
              }}

            />
            {errors.name && <p className="text-error">{errors?.name?.message}</p>}
          </div>
          <div className="flex-col mb-4">
            <InputCustom
              label="Email"
              size="small"
              placeholder="Email"
              error={Boolean(errors.email)}
              inputProps={{
                name: 'email',
                maxLength: MAX.EMAIL_LEN,
                autoFocus: true,
                ...register('email'),
              }}
              defaultValue={item?.email}
            />
            {errors.email && <p className="text-error">{errors?.email?.message}</p>}
          </div>

          <div className="flex-col mb-4">
            <InputCustom
              label="coin"
              size="small"
              placeholder="coin"
              error={Boolean(errors.coin)}
              inputProps={{
                name: 'coin',
                autoFocus: true,
                ...register('coin'),
              }}
              defaultValue={item?.coin}
            />
            {errors.coin && <p className="text-error">{errors?.coin?.message}</p>}
          </div>

          <SelectCustom
            className="w-100"
            label="Quyền truy cập (*)"
            options={ROLE_TYPES}
            error={Boolean(errors.role)}
            defaultValue={item?.role}
            tabindex={item?.role}
            inputProps={{
              name: 'role',
              ...register('role'),
            }}
          // onChange={(e) => handleCheckWordExistence(null, e)}
          />
          {errors.role && (
            <p className="text-error">{errors.role?.message}</p>
          )}
          <Button
            className="_btn _btn-primary"
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            endIcon={loading && <LoopIcon className="ani-spin" />}
            size="large">
            Cập nhật thông tin
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

AddUser.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  item: PropTypes.any,
  onRegister: PropTypes.func,
  loading: PropTypes.bool,
};

AddUser.defaultProps = {
  onClose: function () { },
  open: false,
};

export default AddUser;
