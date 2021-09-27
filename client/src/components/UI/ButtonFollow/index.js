import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PersonAddDisabledIcon from '@material-ui/icons/PersonAddDisabled';
import { useDispatch, useSelector } from 'react-redux';
import { follow, unfollow } from 'redux/slices/profile.slice';
import { FollowAuth, UnFollowAuth } from 'redux/slices/userInfo.slice';
import { setMessage } from 'redux/slices/message.slice';
import { useLocation } from 'react-router-dom';
import accountApi from 'apis/accountApi';

const ButtonFollow = ({ user, dataFlag = false, className = '' }) => {
  const [followed, setFollowed] = useState(false);
  const userInfo = useSelector(state => state.userInfo);
  const profile = useSelector(state => state.profile);
  const { refresh_token } = useSelector((state) => state.token);
  const [flag, setFlag] = useState(dataFlag);
  const { pathname } = useLocation();
  const [idUser, setIdUser] = useState(pathname.split('/profile/')[1]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (userInfo.following.find(item => item._id === user._id)) {
      setFollowed(true);
    }
  }, [userInfo.following, user._id]);
  useEffect(() => {
    setIdUser(pathname.split('/profile/')[1]);
  }, [idUser, pathname]);

  useEffect(() => {
    if (userInfo._id === idUser) {
      setFlag(true);
    } else {
      setFlag(false);
    }
  }, [profile, idUser, pathname, userInfo._id]);

  const handleFollow = async () => {
    setFollowed(true);
    await dispatch(follow({ users: profile.users, user, auth: userInfo }));
    await dispatch(FollowAuth({ users: userInfo.following, user, auth: userInfo }));
    try {
      const apiRes = await accountApi.followUser(user._id, refresh_token);
      if (apiRes.status === 200) {
        dispatch(
          setMessage({
            type: 'success',
            message: 'Kết bạn thành công',
            duration: 500,
          }),
        );
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Kết bạn thất bại, thử lại !';
      dispatch(setMessage({ type: 'error', message }));
    }
  };

  const handleUnFollow = async () => {
    setFollowed(false);
    await dispatch(unfollow({ users: profile.users, user, auth: userInfo }));
    await dispatch(UnFollowAuth({ users: userInfo.following, user, auth: userInfo }));
    try {
      const apiRes = await accountApi.unFollowUser(user._id, refresh_token);
      if (apiRes.status === 200) {
        dispatch(
          setMessage({
            type: 'success',
            message: 'Hủy theo dõi thành công',
            duration: 500,
          }),
        );
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Kết bạn thất bại, thử lại !';
      dispatch(setMessage({ type: 'error', message }));
    }
  };
  return (
    <>
      {
        (!flag || dataFlag) ? (followed
          ? <Button className={`_btn _btn-accent ${className ? 'null' : 'w-100'}`}
            startIcon={<PersonAddDisabledIcon />}
            onClick={handleUnFollow}>
            Hủy theo dõi
          </Button>
          : <Button className={`_btn _btn-primary ${className ? 'null' : 'w-100'}`}
            startIcon={<PersonAddIcon />}
            onClick={handleFollow}>
            Theo dõi
          </Button>) : null
      }
    </>
  );
};

export default ButtonFollow;
