import accountApi from 'apis/accountApi';
import { formatDate } from 'helper';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMessage } from 'redux/slices/message.slice';
import { setUserAvt } from 'redux/slices/userInfo.slice';
import UserAccount from '.';

function UserAccountData() {
  const [userInfo, setUserInfo] = useState({ email: null, createdDate: null });
  const { refresh_token } = useSelector(state => state.token);
  const dispatch = useDispatch();

  useEffect(() => {
    let isSub = true;

    (async function () {
      try {
        const apiRes = await accountApi.fetchUser(refresh_token);
        console.log({ apiRes });
        if (apiRes.status === 200 && isSub) {
          const { email, createdAt } = apiRes.data;
          console.log("test1", { email, createdAt });
          setUserInfo({ email, createdDate: formatDate(createdAt) });
        }
      } catch (error) { }
    })();

    return () => (isSub = false);
  }, []);

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
      email={userInfo.email}
      createdDate={userInfo.createdDate}
      onUpdateProfile={handleUpdateProfile}
    />
  );
}

export default UserAccountData;
