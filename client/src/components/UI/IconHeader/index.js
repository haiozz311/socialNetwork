import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { setStatus } from 'redux/slices/status.slice';
import { useDispatch, useSelector } from 'react-redux';


export default function IconHeader({ post }) {
  const userInfo = useSelector((state) => state.userInfo);
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
    dispatch(setStatus({ ...post, onEdit: true }));
    setAnchorEl(null);
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
            <MenuItem onClick={handleClose}>Xóa</MenuItem>
          </>
        }

        <MenuItem onClick={handleClose}>copy link</MenuItem>
      </Menu>
    </div>
  );
}
