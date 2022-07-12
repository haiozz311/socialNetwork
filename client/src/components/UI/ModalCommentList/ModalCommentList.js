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


function ModalCommentList({ open, onClose, item, onRemove, onUpdate, renderHead }) {
  const classes = useStyle();
  const customerTableHead = [
    'name',
    'content',
  ];

  const handleClickRemove = data => {
    onRemove(data);
  };

  const renderBody = (item2, index) => (
    <tr key={index}>
      <td>{item2?.user?.name}</td>
      <td>{item2?.content}</td>
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
      maxWidth="md"
      open={open}>
      <div className={`${classes.title} flex-center-between`}>
        <span>Danh sách bình luận</span>
        <CloseIcon className="cur-pointer" onClick={onClose} />
      </div>

      <DialogContent classes={{ root: classes.content }}>
        <Table
          headData={customerTableHead}
          renderHead={(item, index) => renderHead(item, index)}
          bodyData={item}
          renderBody={(item, index) => renderBody(item, index)}
        />
      </DialogContent>
    </Dialog>
  );
}

ModalCommentList.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  onRemove: PropTypes.func,
  onUpdate: PropTypes.func,
  renderBody: PropTypes.any,
  renderHead: PropTypes.any,
};

ModalCommentList.defaultProps = {
  onClose: function () { },
  open: false,
};

export default ModalCommentList;
