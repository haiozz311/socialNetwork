/* eslint-disable react/jsx-key */
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import useStyle from './style';



import SentenceContributionData from 'components/Contribution/Sentence/data';


function ModalAddCentence({ open, onClose }) {
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
        <span>Tạo câu</span>
        <CloseIcon className="cur-pointer" onClick={onClose} />
      </div>

      <DialogContent classes={{ root: classes.content }}>
        <SentenceContributionData />
      </DialogContent>
    </Dialog>
  );
}

ModalAddCentence.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};

ModalAddCentence.defaultProps = {
  onClose: function () { },
  open: false,
};

export default ModalAddCentence;
