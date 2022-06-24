/* eslint-disable no-const-assign */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './styles/profile.scss';
import Button from '@material-ui/core/Button';
import Table from '../components/DashBoard/table/Table';
import Avatar from '@material-ui/core/Avatar';

const Profile = () => {
  const [isUpdate, setIsUpdate] = useState(false);
  const userInfo = useSelector((state) => state.userInfo);
    return (
      <div className="profile">
        <div className='imgBx'>
          <img src={userInfo.avatar} alt="" />
        </div>
        <div className='content'>
          <div className='details'>
            <h2>{userInfo.name} <br /><span>{userInfo.email}</span> </h2>
          </div>
        </div>

        </div>
    );
};

export default Profile;
