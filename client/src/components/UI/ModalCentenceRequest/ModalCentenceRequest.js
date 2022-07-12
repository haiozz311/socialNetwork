/* eslint-disable react/jsx-key */
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import CloseIcon from '@material-ui/icons/Close';
import Avatar from '@material-ui/core/Avatar';
import PropTypes from 'prop-types';
import React from 'react';
import Table from 'components/DashBoard/table/Table';
import useStyle from './style';
import { TOPICS } from 'constant/topics';
import Tag from 'components/UI/Tag';

function ModalCentenceRequest({ open, onClose, item, onRemove, onUpdate, renderHead }) {
  const classes = useStyle();
  function sliceTopics(topics) {
    let res = [];
    topics.forEach((topic) => {
      res.push(TOPICS.find((i) => i.key === topic));
    });
    return res;
  }
  const customerTableHead = [
    'câu',
    'ý nghĩa',
    'chú thích',
    'Chủ đề',
  ];

  const renderBody = (item, index) => (
    <tr key={index}>
      <td>{item.sentence}</td>
      <td>{item.mean}</td>
      <td>{item.note}</td>
      <td>{item.topics && sliceTopics(item.topics).map((topic, index) => (
        <Tag key={index} title={topic.title} iconSrc={topic.icon} />
      ))}</td>
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
        <span>Thông tin cá nhân</span>
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
            Xác nhận
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

ModalCentenceRequest.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  onRemove: PropTypes.func,
  onUpdate: PropTypes.func,
  renderBody: PropTypes.any,
  renderHead: PropTypes.any,
};

ModalCentenceRequest.defaultProps = {
  onClose: function () { },
  open: false,
};

export default ModalCentenceRequest;
