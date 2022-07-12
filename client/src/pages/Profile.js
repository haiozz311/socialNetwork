/* eslint-disable no-const-assign */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './styles/profile.scss';
import UserAccount from 'components/UserAccount';
import accountApi from 'apis/accountApi';
import { setMessage } from 'redux/slices/message.slice';



const Profile = () => {
  const userInfo = useSelector((state) => state.userInfo);
  const { refresh_token } = useSelector(state => state.token);
  const [userData, setUserData] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    const getUserById = async () => {
      const res = await accountApi.fetchUserById(userInfo._id, refresh_token);
      setUserData(res.data.user);
    };
    getUserById();
  }, [userInfo._id, userInfo.avatar]);

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
    <div className="profile">
      <UserAccount
        onUpdateProfile={handleUpdateProfile}
        userData={userData}
        id={userInfo._id}
      />
    </div>
  );
};

export default Profile;
