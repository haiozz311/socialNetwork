/* eslint-disable react/jsx-key */
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import CloseIcon from '@material-ui/icons/Close';
import Avatar from '@material-ui/core/Avatar';
import PropTypes from 'prop-types';
import React from 'react';
import useStyle from './style';

function ModalComment({ open, onClose, item }) {
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
        <span>list Comments</span>
        <CloseIcon className="cur-pointer" onClick={onClose} />
      </div>

      <DialogContent classes={{ root: classes.content }}>
        <div className={classes.contentItem}>
          <div className="d-flex jus-content-between align-i-center">
            <h2 className={classes.contentLabel}>Content</h2>
            <h2 className={classes.contentLabel}>Avatar</h2>
            <h2 className={classes.contentLabel}>Like</h2>
          </div>
          {
            item.length > 0 ? (
              <div>{item.map(item => (
            <div className="d-flex jus-content-between align-i-center">
              <p>{item.content}</p>
              <Avatar src={item?.user?.avatar} alt="icon" />
              <p>{item.likes.length} {item.likes.length > 1 ? 'likes' : 'like'}</p>
            </div>
          ))}</div>
            ) : <p>Bài viết này chưa có bình luận</p>
          }

        </div>
      </DialogContent>

      <DialogActions className={classes.actions}>
        <Button
          className="_btn _btn-primary"
          onClick={onClose}
          color="primary"
          size="small"
          variant="contained">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ModalComment.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};

ModalComment.defaultProps = {
  onClose: function () { },
  open: false,
};

export default ModalComment;
