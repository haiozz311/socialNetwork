import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import { useSelector, useDispatch } from 'react-redux';
import Avatar from '@material-ui/core/Avatar';
import notify from '../../../../pages/Message';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { isReadNotify, deleteAllNotify } from 'redux/slices/notify.slice';





const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});

export default function NotifyModal() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { data } = useSelector((state) => state.notify);
  const { refresh_token } = useSelector((state) => state.token);

  const [dataNotify, setdataNotify] = useState([]);

  const handleIsRead = (msg) => {
    dispatch(isReadNotify({ msg, refresh_token }));
  };

  const handleDeleteAll = () => {
    const newArr = data.filter(item => item.isRead === false);
    if (newArr.length === 0) return dispatch(deleteAllNotify({ refresh_token }));

    if (window.confirm(`You have ${newArr.length} unread notices. Are you sure you want to delete all?`)) {
      return dispatch(deleteAllNotify({ refresh_token }));
    }
  };

  useEffect(() => {
    setdataNotify(data);
  }, [data]);

  const [state, setState] = React.useState({
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {['Thông báo'].map((text, index) => (
          <ListItem key={text}>
            <ListItemIcon>{index % 2 === 0 ? <NotificationsNoneIcon /> : <NotificationsNoneIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      {
        dataNotify.length === 0 ? (
          <Link>
            <List>
              <ListItemText primary="Chưa có thông báo mới" style={{ textAlign: 'center' }} />
            </List>
            <Divider />
          </Link>
        ) : (
          <>
            <List>
              {dataNotify?.map((notify, index) => (
                <Link to={`${notify.url}`} key={index}>
                  <ListItem button onClick={() => handleIsRead(notify)}>
                    <ListItemIcon><Avatar src={notify?.user?.avatar} /> </ListItemIcon>
                    <ListItemText primary={notify?.user?.name + ' ' + notify.text} />
                  </ListItem>
                  <small className="text-muted d-flex jus-content-around px-2">
                    {moment(notify.createdAt).fromNow()}
                    {
                      notify.isRead && <p>đã xem</p>
                    }
                  </small>
                </Link>
              ))}
            </List>
            <Divider />
            <List>
              <ListItem button onClick={handleDeleteAll}>
                <ListItemText primary="Xóa tất cả thông báo" style={{ textAlign: 'center' }} />
              </ListItem>
            </List>
          </>
        )
      }
    </div>
  );

  return (

    <div>
      {['right'].map((anchor) => (
        <React.Fragment key={anchor}>
          <div className="notify" onClick={toggleDrawer(anchor, true)}>
            <NotificationsNoneIcon />
            {dataNotify.length > 0 && <p className="notify-number">{dataNotify.length}</p>}
          </div>
          {/* <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button> */}
          <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
