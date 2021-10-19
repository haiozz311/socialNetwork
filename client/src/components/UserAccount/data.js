import accountApi from 'apis/accountApi';
import { formatDate } from 'helper';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setMessage } from 'redux/slices/message.slice';
import { setUserProfile } from 'redux/slices/profile.slice';
import UserAccount from './index';

function UserAccountData() {
  // const [userInfo, setUserInfo] = useState({ email: null, createdDate: null });
  const { refresh_token } = useSelector(state => state.token);
  const profile = useSelector(state => state.profile);

  const dispatch = useDispatch();
  const { id } = useParams();;
  const [idUser, setIdUser] = useState(id);
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
  }, [idUser, dataUserInfor._id]);

  useEffect(() => {
    setIdUser(id);
  }, [id]);

  useEffect(() => {
    if (dataUserInfor._id === idUser) {
      setUserData([dataUserInfor]);
    } else {
      const newData = profile.users.filter(user => user._id === idUser);
      setUserData(newData);
    }
  }, [profile, idUser, dataUserInfor._id, dataUserInfor.avatar]);

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
      id={id}
    />
  );
}

export default UserAccountData;
