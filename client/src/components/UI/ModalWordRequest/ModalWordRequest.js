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
import Tag from 'components/UI/Tag';


function ModalWordRequest({ open, onClose, item, onRemove, onUpdate, renderHead }) {
  const classes = useStyle();
  const customerTableHead = [
    'Từ vựng',
    'Phiên âm',
    'Cấp bật từ',
    'Loại từ',
    'Hình ảnh',
    'Nghĩa của từ',
    'Chuyên ngành',
    'Ví dụ',
    'Từ đồng nghĩa',
    'Từ trái nghĩa',
    'chủ đề',
    'chú thích',
  ];
  function sliceTopics(topics) {
    let res = [];
    topics.forEach((topic) => {
      res.push(TOPICS.find((i) => i.key === topic));
    });
    return res;
  }
  const renderBody = (item, index) => (
    <tr key={index}>
      <td>{item?.word}</td>
      <td>{item?.phonetic}</td>
      <td>{item?.level === '0' ? 'Chưa Xác Định' : item.level}</td>
      <td>{item?.type ? item.type : 'Chưa Xác Định'}</td>
      <td>{item?.picture ? <Avatar src={item.picture} /> : ''}</td>
      <td>{item?.mean.length < 20 ? item.mean : item.mean.slice(0, 20) + '...'}</td>
      <td>{WORD_SPECIALTY.find((i) => i.value === item.specialty)?.label ||
        'Chưa Xác Định'}</td>
      <td>{item?.examples}</td>
      <td>{item?.synonyms ? item?.synonyms.join(', ') : ''}</td>
      <td>{item?.antonyms ? item?.antonyms.join(', ') : ''}</td>
      <td>{item.topics && sliceTopics(item.topics).map((topic, index) => (
        <Tag key={index} title={topic.title} iconSrc={topic.icon} />
      ))}</td>
      <td>{item.note}</td>
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
        <span>Word</span>
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

ModalWordRequest.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  onRemove: PropTypes.func,
  onUpdate: PropTypes.func,
  renderHead: PropTypes.any,
  renderBody: PropTypes.any,
};

ModalWordRequest.defaultProps = {
  onClose: function () { },
  open: false,
};

export default ModalWordRequest;
