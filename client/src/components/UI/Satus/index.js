import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import useStyle from './style';
import FormStatus from '../FormStatus';
import more from 'assets/icons/message/more.png';


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
    <div className={`${classes.status} form-social`} >
      <div className="social-infor">
        <Avatar className="mr-4" src={userInfor.avatar} size="big-avatar" />
        <p>What`s new, {userInfor.name}</p>
      </div>
      <button className='btn-create'
        onClick={() => setModalStatus(true)}>
        Post it!
      </button>

      {
        modalStatus && <FormStatus open={modalStatus} setModalStatus={setModalStatus} userInfor={userInfor} />
      }
    </div >
  );
};

export default Status;
