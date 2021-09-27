import React, { useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import useStyle from './style';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import Fab from "@material-ui/core/Fab";
import { setMessage } from 'redux/slices/message.slice';
import CancelIcon from '@material-ui/icons/Cancel';
import { useSelector, useDispatch } from 'react-redux';
import { createPost } from 'redux/slices/post.slice';
import GlobalLoading from '../GlobalLoading';
import { setStatus, updatePost } from 'redux/slices/status.slice';
import postApi from 'apis/postApi';
import { setPosts } from 'redux/slices/post.slice';

const FormStatus = ({ open, setModalStatus, userInfor }) => {
  const classes = useStyle();
  const { refresh_token } = useSelector(state => state.token);
  const { statusPost } = useSelector((state) => state.status);
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

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

  const handleSubmit = async () => {
    setLoading(true);
    if (images.length === 0 && content === '') {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
      return (
        setTimeout(() => {
          dispatch(
            setMessage({ type: 'error', message: 'Bạn phải đăng ảnh hoặc nội dung bài đăng' }),
          );
        }, 3000)
      );
    } else {

      if (statusPost.onEdit) {
        await dispatch(updatePost({ content, images, refresh_token, statusPost }));
        const res = await postApi.getPost(refresh_token);
        if (res) {
          dispatch(setPosts(res.data.posts));
        }
      } else {
        dispatch(createPost({ content, images, refresh_token }));
      }
      setContent('');
      setImages([]);
      dispatch(setStatus(false));
      setTimeout(() => {
        setLoading(false);
      }, 500);
      setTimeout(() => {
        setModalStatus(false);
      }, 1000);
      return (
        setTimeout(() => {
          dispatch(
            setMessage({ type: 'success', message: 'Đăng bài thành Công' }),
          );
        }, 1500)
      );
    }
  };

  useEffect(() => {
    if (statusPost.onEdit) {
      setContent(statusPost.content);
      setImages(statusPost.images);
    }
  }, [statusPost.onEdit]);

  const handleClose = () => {
    setModalStatus(false);
    dispatch(setStatus(false));
  };

  return (
    <div>
      <Dialog
        classes={{
          paper: classes.rootPaper,
        }}
        aria-labelledby="setting dialog"
        disableBackdropClick={true}
        maxWidth="md"
        open={open}
      >
        <div className={`${classes.title} flex-center-between`}>
          <span>Tạo bài viết</span>
          <CloseIcon
            onClick={handleClose}
            className="cur-pointer" />
        </div>

        <DialogContent classes={{ root: classes.content }}>
          <div className="d-flex align-i-center">
            <Avatar src={userInfor?.avatar} />
            <h4 className="ml-3">{userInfor?.name}</h4>
          </div>
          <textarea className={`${classes.content_status}`} value={content} name="content"
            placeholder={`${userInfor.name} ơi, Bạn đang nghĩ gì thế?`}
            onChange={e => setContent(e.target.value)}
          />
          <div>
            <input
              accept="image/*,video/*"
              className={classes.input}
              id="contained-button-file"
              multiple
              type="file"
              onChange={handleChangeImages}
            />
            <label htmlFor="contained-button-file">
              <Fab component="span" variant="extended" className={`${classes.extended}`}>
                <ImageIcon className="mr-2" />Ảnh/Video
              </Fab>
            </label>
          </div>
          <div className={`${classes.show_images}`}>
            {
              images.map((img, index) => (
                <div key={index} id="file_img" className={`${classes.cover_img} d-flex`}>
                  <img src={img.url ? img.url : URL.createObjectURL(img)} className={`${classes.show_images_img}`} alt="images" />
                  <CancelIcon className={`${classes.btn_close}`} onClick={() => deleteImages(index)} />
                </div>
              ))
            }
          </div>
        </DialogContent>

        <DialogActions className={classes.actions}>
          <Button
            className="_btn _btn-primary w-100"
            onClick={() => {
              handleSubmit();
            }}
            color="primary"
            size="small"
            variant="contained">
            Đăng bài
          </Button>
        </DialogActions>
      </Dialog>
      {
        loading && <GlobalLoading />
      }
    </div>
  );
};

export default FormStatus;
