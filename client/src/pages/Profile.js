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
            <h2 className="page-header">
                Profile
            </h2>
            <div className="row">
                <div className="col-4">
                    <div className="card profile-center">
                      <div className="card__body profile-image">
                        <img src={userInfo.avatar} alt="" />
                      </div>
                    </div>
                </div>
                <div className="col-8 profile-body">
                    <div className="card">
                      <div className="card__body">
                        <p className="title">Name</p>
                        <p>{userInfo.name}</p>
                      </div>
                      <div className="card__body">
                        <p className="title">Email</p>
                        <p>{userInfo.email}</p>
                      </div>
                      <div className="card__body">
                        <p className="title">Coin</p>
                        <p>{userInfo.coin}</p>
                      </div>
                    </div>
                </div>
        </div>
        <div className="row">
          <div className="col-4">
            {
              !isUpdate ? <Button onClick={() => setIsUpdate(prev => !prev)} className="_btn _btn-primary">
              EDIT PROFILE
              </Button> : <>
                <Button onClick={() => setIsUpdate(prev => !prev)} className="_btn _btn-primary">
                  SAVE
                </Button>
                <Button onClick={() => setIsUpdate(prev => !prev)} className="_btn _btn-accent">
                  CANCEL
                </Button>
              </>
            }

          </div>
        </div>

        </div>
    );
};

export default Profile;
