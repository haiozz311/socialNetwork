import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { setStatus } from 'redux/slices/status.slice';
import { useDispatch, useSelector } from 'react-redux';
import { setMessage } from 'redux/slices/message.slice';
import ComfirmModal from 'components/UI/ComfirmModal';

const BASE_URL = process.env.REACT_APP_LOCALHOST;



export default function IconHeader({ post }) {
  const userInfo = useSelector((state) => state.userInfo);

  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditPost = () => {
    dispatch(setStatus({ ...post, onEdit: true }));
    setAnchorEl(null);
  };

  const handleDeletePost = () => {
    setOpenModal(true);
    setAnchorEl(null);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${BASE_URL}/post/${post._id}`);
    setAnchorEl(null);
    dispatch(
      setMessage({ type: 'success', message: 'Link đã được sao chép' }),
    );
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <div>
      <Button
        onClick={handleClick}
      >
        <MoreHorizIcon />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {
          userInfo._id === post.user._id &&
          <>
            <MenuItem onClick={handleEditPost}>Chỉnh sửa</MenuItem>
            <MenuItem onClick={handleDeletePost}>Xóa Post</MenuItem>
          </>
        }

        <MenuItem onClick={handleCopyLink}>copy link</MenuItem>
      </Menu>
      <ComfirmModal post={post} open={openModal} onclose={handleCloseModal} />
    </div>
  );
}
