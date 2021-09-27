import accountApi from 'apis/accountApi';
import { formatDate } from 'helper';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setMessage } from 'redux/slices/message.slice';
import { setUserAvt } from 'redux/slices/userInfo.slice';
import { setUserProfile } from 'redux/slices/profile.slice';
import UserAccount from '.';

function UserAccountData() {
  // const [userInfo, setUserInfo] = useState({ email: null, createdDate: null });
  const { refresh_token } = useSelector(state => state.token);
  const profile = useSelector(state => state.profile);

  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const [idUser, setIdUser] = useState(pathname.split('/profile/')[1]);
  const dataUserInfor = useSelector((state) => state.userInfo);
  const [userData, setUserData] = useState([]);
  useEffect(() => {
    if (idUser !== dataUserInfor._id) {
      const getUserById = async () => {
        const res = await accountApi.fetchUserById(idUser, refresh_token);
        dispatch(setUserProfile({ users: res.data.user, id: idUser }));
      };
      getUserById();
    }
  }, [idUser, pathname, dataUserInfor._id]);

  useEffect(() => {
    setIdUser(pathname.split('/profile/')[1]);
  }, [idUser, pathname]);

  useEffect(() => {
    if (dataUserInfor._id === idUser) {
      setUserData([dataUserInfor]);
    } else {
      const newData = profile.users.filter(user => user._id === idUser);
      setUserData(newData);
    }
  }, [profile, idUser, pathname, dataUserInfor._id]);

  const handleUpdateProfile = async (name) => {
    try {
      const apiRes = await accountApi.putUpdateProfile(name, refresh_token);
      if (apiRes.status === 200) {
        dispatch(
          setMessage({
            type: 'success',
            message: 'Cập nhật thông tin thành công',
            duration: 500,
          }),
        );

        setTimeout(() => {
          location.reload();
        }, 750);
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Chỉnh sửa thông tin thất bại, thử lại !';
      dispatch(setMessage({ type: 'error', message }));
    }
  };

  return (
    <UserAccount
      onUpdateProfile={handleUpdateProfile}
      userData={userData}
    />
  );
}

export default UserAccountData;
