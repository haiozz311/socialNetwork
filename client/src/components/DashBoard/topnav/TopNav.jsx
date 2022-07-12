import React, { useState } from 'react';

import './topnav.css';
import { useDispatch, useSelector } from 'react-redux';

import { Link, useLocation } from 'react-router-dom';

import Dropdown from '../dropdown/Dropdown';
import { useTheme } from '@material-ui/core/styles';

import ThemeMenu from '../thememenu/ThemeMenu';
import Search from '@material-ui/icons/Search';
import accountApi from 'apis/accountApi';

import notifications from 'assets/JsonData/notification.json';
import { setLogout } from 'redux/slices/userInfo.slice';
import { setMessage } from 'redux/slices/message.slice';

import user_image from 'assets/images/tuat.png';
import SearchInputCustom from 'components/UI/SearchInputCustom';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const Topnav = () => {
  const { pathname = {} } = useLocation();
  const theme = useTheme();
  const isXsDevice = useMediaQuery(theme.breakpoints.up('xs'));
  const [showInput, setShowInput] = useState(isXsDevice);
  const dispatch = useDispatch();

  const userInfor = useSelector((state) => state.userInfo);
  const handleLogout = async () => {
    window.localStorage.clear();
    try {
      const res = await accountApi.userLogout();
      if (res.status = 200) {
        dispatch(setLogout());
        // onClose(null);
        dispatch(
          setMessage({ message: res.data.msg, type: 'success' }),
        );
        setTimeout(() => {
          window.location.href = '/';
        }, 0);
      }
    } catch (err) {
    }
  };
  return (
    <div className='topnav'>
      {/* <input type="text" placeholder='Search here...' />
        <i className='bx bx-search'></i> */}
      <SearchInputCustom
        placeholder={pathname !== '/social' ? 'Nhập từ khoá ...' : 'Nhập tên bạn muốn tìm...'}
        showInput={isXsDevice || showInput}
        prefixIcon={
          <Search
            onClick={() => setShowInput(true)}
          />
        }
      />

      <div className="topnav__right">
        <div className="topnav__right-item">
          <Link to={`/profile/${userInfor._id}`} className="topnav__right-user">
            <div className="topnav__right-user__image">
              <img src={userInfor.avatar} alt="" />
            </div>
            <div className="topnav__right-user__name">
              {userInfor.name}
            </div>
          </Link>
        </div>
        <div className="topnav__right-item">
          <ThemeMenu />
        </div>
        <div className="topnav__right-item">
          <button className="dropdown__toggle" onClick={handleLogout}>
            <i className='bx bx-log-out'></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Topnav;
