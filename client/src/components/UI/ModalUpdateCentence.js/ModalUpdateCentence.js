/* eslint-disable react/jsx-key */
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';
import React, { useState, useRef } from 'react';
import LoopIcon from '@material-ui/icons/Loop';
import InputCustom from 'components/UI/InputCustom';
import useStyle from './style';
import SelectCustom from 'components/UI/SelectCustom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { MAX, ROLE_TYPES } from 'constant';
import TopicSelect from 'components/UI/TopicSelect';
import * as yup from 'yup';



const schema = yup.object().shape({
  mean: yup
    .string()
    .trim()
    .required('Nhập họ tên')
    .max(MAX.NAME_LEN, `Họ tên tối đa ${MAX.NAME_LEN} ký tự`),
  sentence: yup
    .string()
    .trim()
    .required('Nhập họ tên')
    .max(MAX.NAME_LEN, `Họ tên tối đa ${MAX.NAME_LEN} ký tự`),
});
function ModalUpdateCentence({ open, item, onClose, onRegister, loading }) {
  console.log('item', item);
  const classes = useStyle();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const topics = useRef([]);
  const onSubmit = (data) => {
    onRegister({ ...data, topics: topics.current });
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
        <span>Cập nhật câu</span>
        <CloseIcon className="cur-pointer" onClick={onClose} />
      </div>

      <DialogContent classes={{ root: classes.content }}>
        <form
          className={`${classes.root} flex-col`}
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off">
          <div className="flex-col mb-4">
            <InputCustom
              label="Câu"
              size="small"
              placeholder="Nhập câu"
              error={Boolean(errors.sentence)}
              defaultValue={item?.sentence}
              inputProps={{
                name: 'sentence',
                autoFocus: true,
                ...register('sentence'),
              }}

            />
            {errors.sentence && <p className="text-error">{errors?.sentence?.message}</p>}
          </div>
          <div className="flex-col mb-4">
            <InputCustom
              label="Nghĩa"
              size="small"
              placeholder="Nhập nghĩa"
              error={Boolean(errors.mean)}
              inputProps={{
                name: 'mean',
                maxLength: MAX.EMAIL_LEN,
                autoFocus: true,
                ...register('mean'),
              }}
              defaultValue={item?.mean}
            />
            {errors.mean && <p className="text-error">{errors?.mean?.message}</p>}
          </div>
          <div className="flex-col mb-4">
            <InputCustom
              label="Chú thích"
              size="small"
              placeholder="Nhập chú thích"
              error={Boolean(errors.note)}
              inputProps={{
                name: 'note',
                maxLength: MAX.note_LEN,
                autoFocus: true,
                ...register('note'),
              }}
              defaultValue={item?.note}
            />
            {errors.note && <p className="text-error">{errors?.note?.message}</p>}
          </div>

          <TopicSelect
            onChange={(topicList) => (topics.current = topicList)}
            buttonTitle="Thêm chủ đề"
          />

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

ModalUpdateCentence.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  item: PropTypes.any,
  onRegister: PropTypes.func,
  loading: PropTypes.bool,
};

ModalUpdateCentence.defaultProps = {
  onClose: function () { },
  open: false,
};

export default ModalUpdateCentence;
