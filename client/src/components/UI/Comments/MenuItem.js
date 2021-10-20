import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { setStatus } from 'redux/slices/status.slice';
import { useDispatch, useSelector } from 'react-redux';
import { deleteComment } from 'redux/slices/post.slice';


const MenuItemComment = ({ post, myComment, setOnEdit, comment }) => {
  const userInfo = useSelector(state => state.userInfo);
  const { refresh_token } = useSelector(state => state.token);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditPost = () => {
    setOnEdit(true);
    console.log("setOnEdit 123 123");
    // dispatch(setStatus({ ...post, onEdit: true }));
    setAnchorEl(null);
  };

  const handleRemove = () => {
    if (post.user._id === userInfo._id || comment.user._id === userInfo._id) {
      dispatch(deleteComment({ post, comment, refresh_token }));
    }
  };

  return (
    <div>
      <Button
        onClick={handleClick}
      >
        <MoreVertIcon />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={() => {
          handleEditPost()
        }}>Chỉnh sửa</MenuItem>
        <MenuItem onClick={handleRemove}>Xóa comment</MenuItem>
      </Menu>
    </div>
  );
}
export default MenuItemComment;