import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HelpIcon from '@material-ui/icons/Help';
import SettingsIcon from '@material-ui/icons/Settings';
import SettingModal from 'components/SpeedDial/Settings/Modal';
import { LINKS, ROUTES } from 'constant';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import useStyle from './style';
import accountApi from 'apis/accountApi';
import { useDispatch, useSelector } from 'react-redux';
import { setMessage } from 'redux/slices/message.slice';
import { UX } from 'constant';

function SettingMenu({ anchorEl, onClose }) {
  const classes = useStyle();
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { _id } = useSelector((state) => state.userInfo);
  const history = useHistory();
  const handleLogout = async () => {
    try {
      const res = await accountApi.userLogout();
      if (res.status = 200) {
        localStorage.removeItem('firstLogin');
        onClose(null);
        dispatch(
          setMessage({ message: res.data.msg, type: 'success' }),
        );
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      }
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (err) {
      window.location.href = '/';
    }
  };
  const handleClickProfile = (_id) => {
    history.push(`/profile/${_id}`);
    onClose();
  };
  return (
    <Menu
      classes={{ paper: classes.root }}
      anchorEl={anchorEl}
      disableScrollLock={true}
      getContentAnchorEl={null}
      onClose={onClose}
      open={Boolean(anchorEl)}
      anchorOrigin={{
        horizontal: 'right',
        vertical: 'bottom',
      }}>
      <Link onClick={() => handleClickProfile(_id)}>
        <MenuItem className={classes.menuItem}>
          <AccountCircleIcon className={classes.icon} fontSize="small" />
          <p className={classes.text}>Thông tin cá nhân</p>
        </MenuItem>
      </Link>

      <MenuItem onClick={() => setOpen(true)} className={classes.menuItem}>
        <SettingsIcon className={classes.icon} fontSize="small" />
        <p className={classes.text}>Cài đặt</p>
      </MenuItem>

      <a href={LINKS.FB} target="_blank" rel="noreferrer">
        <MenuItem className={classes.menuItem}>
          <HelpIcon className={classes.icon} fontSize="small" />
          <p className={classes.text}>Liên hệ - Giúp đỡ</p>
        </MenuItem>
      </a>

      <Link to={ROUTES.LOGOUT}>
        <MenuItem className={classes.menuItem} onClick={handleLogout} >
          <ExitToAppIcon className={classes.icon} fontSize="small" />
          <p className={classes.text}>Đăng xuất</p>
        </MenuItem>
      </Link>

      {open && <SettingModal open={open} onClose={() => setOpen(false)} />}
    </Menu>
  );
}

SettingMenu.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
};

SettingMenu.defaultProps = {
  anchorEl: null,
  onClose: function () { },
};

export default SettingMenu;
