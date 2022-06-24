/* eslint-disable react/jsx-key */
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import CloseIcon from '@material-ui/icons/Close';
import Avatar from '@material-ui/core/Avatar';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Table from 'components/DashBoard/table/Table';
import useStyle from './style';
import { TOPICS } from 'constant/topics';
import { WORD_SPECIALTY } from 'constant';
import AvatarGroup from '@material-ui/lab/AvatarGroup';

import Tag from 'components/UI/Tag';


function ModalComment({ open, onClose, item, onRemove, onUpdate, renderHead }) {
  const classes = useStyle();
  const customerTableHead = [
    'Nội Dung',
    'Hình Ảnh',
    'Người Thích Bài Viết',
    'Lượt Bình Luận',
  ];
  const renderBody = (item, index) => (
    <tr key={index}>
      <td>{item.content}</td>
      <td className='d-flex'>
        {
          item.images.map(item =>
            <Avatar variant="square" className='mx-2'>
              <img style={{ width: '50px', marginRight: '10px' }} src={`https://res.cloudinary.com/dsvko7lfg/image/upload/${item.public_id}`} />
            </Avatar>)
        }
      </td>
      <td>
        <AvatarGroup total={24}>
          {item.likes && item.likes.map(item => (
            <Avatar alt="Remy Sharp" src={item?.avatar} />
          ))}
        </AvatarGroup>
      </td>
      <td>
        <AvatarGroup total={24}>
          {item.comments && item.comments.map(item => (
            <Avatar alt="Remy Sharp" src={item?.user?.avatar} />
          ))}
        </AvatarGroup>
      </td>
    </tr>
  );

  return (
    <Dialog
      classes={{
        paper: classes.rootPaper,
      }}
      onClose={onClose}
      aria-labelledby="setting dialog"
      disableBackdropClick={true}
      maxWidth="xl"
      open={open}>
      <div className={`${classes.title} flex-center-between`}>
        <span>Chi tiết bài viết</span>
        <CloseIcon className="cur-pointer" onClick={onClose} />
      </div>

      <DialogContent classes={{ root: classes.content }}>
        <Table
          headData={customerTableHead}
          renderHead={(item, index) => renderHead(item, index)}
          bodyData={[item]}
          renderBody={(item, index) => renderBody(item, index)}
        />
      </DialogContent>
      <div className="d-flex jus-content-end">
        <DialogActions className={classes.actions}>
          <Button
            onClick={onUpdate}
            color="primary"
            size="small"
            variant="contained">
            Chỉnh sữa
          </Button>
        </DialogActions>
        <DialogActions className={classes.actions}>
          <Button
            onClick={onRemove}
            color="secondary"
            size="small"
            variant="contained">
            Xóa
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
}

ModalComment.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  onRemove: PropTypes.func,
  onUpdate: PropTypes.func,
  renderHead: PropTypes.any,
  renderBody: PropTypes.any,
};

ModalComment.defaultProps = {
  onClose: function () { },
  open: false,
};

export default ModalComment;
