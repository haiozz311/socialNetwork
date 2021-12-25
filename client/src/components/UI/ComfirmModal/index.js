import * as React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { deletePost } from 'redux/slices/post.slice';
import { setMessage } from 'redux/slices/message.slice';


export default function ComfirmModal({ post, open, onclose }) {
  const { refresh_token } = useSelector((state) => state.token);
  const { socket } = useSelector((state) => state.socket);
  const dispatch = useDispatch();
  let history = useHistory();
  const { id } = useParams();
  const handleRemovePost = () => {
    dispatch(deletePost({ post, refresh_token, socket }));
    dispatch(
      setMessage({ type: 'success', message: 'Xóa bài viết thành công' }),
    );
    if (id) {
      history.goBack();
    }
    onclose();
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={onclose}
        maxWidth="md"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          My post
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn muốn xóa bài post này ?
            Nếu bạn xóa sẽ không thể khôi phục lại như ban đầu !
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onclose}>Disagree</Button>
          <Button onClick={handleRemovePost} classNam="_btn _btn-primary" >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
