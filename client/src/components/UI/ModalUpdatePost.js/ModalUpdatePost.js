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
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { yupResolver } from '@hookform/resolvers/yup';
import { MAX, ROLE_TYPES, WORD_TYPES, WORD_LEVELS, WORD_SPECIALTY } from 'constant';
import PhoneticInput from 'components/Contribution/Word/PhoneticInput';
import * as yup from 'yup';

import ImageList from '@material-ui/core/ImageList';
import InformationTooltip from 'components/Contribution/Word/InformationTooltip';
import UploadButton from 'components/UI/UploadButton';
import TopicSelect from 'components/UI/TopicSelect';
import { debounce } from 'helper';
import { useDispatch, useSelector } from 'react-redux';
import { setMessage } from 'redux/slices/message.slice';
import CancelIcon from '@material-ui/icons/Cancel';
import ImageListItem from '@material-ui/core/ImageListItem';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';

let delayTimer = null;

const schema = yup.object().shape({
  content: yup
    .string()
    .trim()
    .required('Hãy nhập một từ vào đây')
    .lowercase()
    .max(MAX.WORD_LEN, `Từ dài tối đã ${MAX.WORD_LEN} ký tự`),
});
function ModalUpdatePost({ open, item, onClose, onRegister, loading }) {
  const { refresh_token } = useSelector((state) => state.token);
  const [images, setImages] = useState(item?.images || []);
  const classes = useStyle();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    onRegister({ ...data, images: images, refresh_token, statusPost : item  });
  };
  const deleteImages = (index) => {
    const newArr = [...images];
    newArr.splice(index, 1);
    setImages(newArr);
  };
  const handleChangeImages = e => {
    const files = [...e.target.files];
    let err = '';
    let newImages = [];
    files.forEach(file => {
      if (!file) return err = 'Bạn chưa thêm file';
      if (file.size > 1024 * 1024 * 5) {
        return err = 'hình ảnh/Video lớn nhất là 5mb!';
      }
      return newImages.push(file);
    });
    if (err) dispatch(
      setMessage({ type: 'error', message: 'Đăng bài thất bại! kiểm tra lại' }),
    );
    setImages([...images, ...newImages]);
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
        <span>Cập nhật từ vựng</span>
        <CloseIcon className="cur-pointer" onClick={onClose} />
      </div>

      <DialogContent classes={{ root: classes.content }}>
        <form
          className={`${classes.root} flex-col`}
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off">
          <Grid className={classes.grid} container spacing={3}>
            <Grid item xs={12} md={12} lg={12}>
              <InputCustom
                label="Nội dung"
                className="w-100"
                size="small"
                multiline
                placeholder="Nhập nội dung"
                error={Boolean(errors.content)}
                defaultValue={item?.content}
                inputProps={{
                  name: 'content',
                  autoFocus: true,
                  ...register('content'),
                }}
              />
              {errors.content && <p className="text-error">{errors?.content?.message}</p>}
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <>
                <input
                  className={classes.hidden}
                  accept="image/*"
                  id="button-file"
                  htmlFor="contained-button-file"
                  type="file"
                  onChange={handleChangeImages}
                />
                <label htmlFor="button-file">
                  <Button
                    style={{ marginLeft: 0 }}
                    className={`${classes.btn} w-100 h-100`}
                    variant="contained"
                    color="primary"
                    component="span"
                    endIcon={<CloudUploadIcon />}>
                    Ảnh minh hoạ
                  </Button>
                </label>
              </>
            </Grid>

            <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
              {images.map((item, index) => (
                <ImageListItem key={index}>
                  <img
                    src={item.url ? item.url : URL.createObjectURL(item)}
                    srcSet={item.url ? item.url : URL.createObjectURL(item)}
                    alt="image"
                    loading="lazy"
                  />
                  <CancelIcon className={`${classes.btn_close}`} onClick={() => deleteImages(index)} />
                </ImageListItem>
              ))}
            </ImageList>
          </Grid>
          <Button
            className="_btn _btn-primary mt-8"
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

ModalUpdatePost.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  item: PropTypes.any,
  onRegister: PropTypes.func,
  loading: PropTypes.bool,
};

ModalUpdatePost.defaultProps = {
  onClose: function () { },
  open: false,
};

export default ModalUpdatePost;
