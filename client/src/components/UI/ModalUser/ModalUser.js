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

function ModalUser({ open, onClose, item, onRemove, onUpdate, isUpdate, handleConfirmUpdate, renderHead, token }) {
  const classes = useStyle();
  const [state, setState] = useState({
    userName: item.name,
    coin: item.coin,
    role: item.role,
  });
  console.log('state', state);
  const customerTableHead = [
    'name',
    'email',
    'status',
    'coin',
    'role',
    'avatar',
];
  const handleChange = evt => {
    const { name, value } = evt.target;
    setState((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const renderBody = (item, index) => (
    <tr key={index}>
        <td>{item.name}</td>
        <td>{item.email}</td>
        <td>{item.authType === 'gg' ? 'Gmail' : item.authType === 'fb' ? 'Facebook': 'Local'}</td>
        <td>{item.coin}</td>
        <td>{item.role === 0 ? 'User' : 'Admin'}</td>
        <Avatar src={item.avatar} />
    </tr>
);

  const renderBodyUpdate = (item, index) => (
  <tr key={index} onClick={() => {}}>
        <td><input className={classes.borderInput} type="text" placeholder={`${state.userName}`} name="userName" value={state.userName} onChange={handleChange} /></td>
        <td>{item.email}</td>
        <td>{item.authType === 'gg' ? 'Gmail' : item.authType === 'fb' ? 'Facebook': 'Local'}</td>
        <td><input type="number" className={`${classes.borderInput} ${classes.widthCoin}`} value={state.coin} name="coin" onChange={handleChange} /></td>
        <td><select name="role" className={classes.borderInput} onChange={handleChange} value={state.role}>
          <option value="0">User</option>
          <option value="1">Admin</option>
        </select></td>
        <td><Avatar src={item.avatar} /></td>
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
          renderBody={(item, index) => !isUpdate ? renderBody(item, index) : renderBodyUpdate(item, index)}
      />
      </DialogContent>
      <div className="d-flex jus-content-end">
        {
          !isUpdate ? (
            <>
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
            </>
          ) : <>
          <DialogActions className={classes.actions}>
          <Button
            onClick={() => {
              handleConfirmUpdate({id: item._id,
                name: state.userName,
                coin: state.coin,
                role: state.role,
                token: token
              });
            }}
            color="primary"
            size="small"
            variant="contained">
            Cập nhật thông tin
          </Button>
        </DialogActions>
        <DialogActions className={classes.actions}>
          <Button
            // className="_btn _btn-primary"
            onClick={onClose}
            color="secondary"
            size="small"
            variant="outlined">
            Đóng
          </Button>
        </DialogActions></>
        }

      </div>
    </Dialog>
  );
}

ModalUser.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  onRemove: PropTypes.func,
  onUpdate: PropTypes.func,
  isUpdate: PropTypes.bool,
  handleConfirmUpdate: PropTypes.func,
  renderHead: PropTypes.any,
  renderBody: PropTypes.any,
  token: PropTypes.any,
};

ModalUser.defaultProps = {
  onClose: function () { },
  open: false,
};

export default ModalUser;
