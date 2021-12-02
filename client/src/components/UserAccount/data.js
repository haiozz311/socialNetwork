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
  // const [id, setid] = useState(id);
  const dataUserInfor = useSelector((state) => state.userInfo);
  const [userData, setUserData] = useState([]);
  useEffect(() => {
    if (id !== dataUserInfor._id) {
      const getUserById = async () => {
        const res = await accountApi.fetchUserById(id, refresh_token);
        dispatch(setUserProfile({ users: res.data.user, id: id }));
      };
      getUserById();
    }
  }, [id, dataUserInfor._id]);

  // useEffect(() => {
  //   setid(id);
  // }, [id]);

  useEffect(() => {
    if (dataUserInfor._id === id) {
      setUserData(dataUserInfor);
      console.log("mydata1", dataUserInfor);
    } else {
      const newData = profile.users.find(user => user._id === id);
      console.log("mydata2",newData);
      if (newData) {
        setUserData(newData);
      }
    }
  }, [profile, id, dataUserInfor._id, dataUserInfor.avatar]);

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
