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
import AvatarGroup from '@material-ui/lab/AvatarGroup';


function ModalUser({ open, onClose, item, onRemove, onUpdate, renderHead }) {
  const classes = useStyle();
  const customerTableHead = [
    'name',
    'email',
    'status',
    'coin',
    'role',
    'avatar',
    'follower',
    'following',
  ];

  const renderBody = (item, index) => (
    <tr key={index}>
      <td>{item.name}</td>
      <td>{item.email}</td>
      <td>{item.authType === 'gg' ? 'Gmail' : item.authType === 'fb' ? 'Facebook' : 'Local'}</td>
      <td>{item.coin}</td>
      <td>{item.role === 0 ? 'User' : 'Admin'}</td>
      <td><Avatar src={item.avatar} /></td>
      <td>
        <AvatarGroup total={5}>
          {item.followers && item?.followers?.map(item => (
            <Avatar alt="Remy Sharp" src={item?.avatar} />
          ))}
        </AvatarGroup></td>
      <td>
        <AvatarGroup total={5}>
          {item.following && item?.following?.map(item => (
            <Avatar alt="Remy Sharp" src={item?.avatar} />
          ))}
        </AvatarGroup></td>
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

ModalUser.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  onRemove: PropTypes.func,
  onUpdate: PropTypes.func,
  renderBody: PropTypes.any,
  renderHead: PropTypes.any,
};

ModalUser.defaultProps = {
  onClose: function () { },
  open: false,
};

export default ModalUser;
