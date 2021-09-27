import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import useStyle from './style';
import FormStatus from '../FormStatus';

const Status = () => {
  const classes = useStyle();
  const dispatch = useDispatch();
  const [modalStatus, setModalStatus] = useState(false);
  const userInfor = useSelector((state) => state.userInfo);
  const { statusPost } = useSelector((state) => state.status);
  useEffect(() => {
    if (statusPost.onEdit) {
      setModalStatus(true);
    }
  }, [statusPost.onEdit]);
  return (
    <div className={`${classes.status} my-3 d-flex`} >
      <Avatar className="mr-4" src={userInfor.avatar} size="big-avatar" />

      <button className={`${classes.statusBtn}`}
        onClick={() => setModalStatus(true)}>
        {userInfor.name} ơi, Bạn đang nghĩ gì thế?
      </button>

      {
        modalStatus && <FormStatus open={modalStatus} setModalStatus={setModalStatus} userInfor={userInfor} />
      }
    </div >
  );
};

export default Status;
