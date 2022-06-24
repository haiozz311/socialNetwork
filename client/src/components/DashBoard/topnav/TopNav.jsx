import React, { useState } from 'react';

import './topnav.css';
import { useSelector } from 'react-redux';

import { Link, useLocation } from 'react-router-dom';

import Dropdown from '../dropdown/Dropdown';
import { useTheme } from '@material-ui/core/styles';

import ThemeMenu from '../thememenu/ThemeMenu';
import Search from '@material-ui/icons/Search';

import notifications from 'assets/JsonData/notification.json';

import user_image from 'assets/images/tuat.png';
import SearchInputCustom from 'components/UI/SearchInputCustom';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import user_menu from 'assets/JsonData/user_menus.json';

const renderNotificationItem = (item, index) => (
  <div className="notification-item" key={index}>
    <i className={item.icon}></i>
    <span>{item.content}</span>
  </div>
);

const renderUserToggle = (user) => (
  <div className="topnav__right-user">
    <div className="topnav__right-user__image">
      <img src={user.avatar} alt="" />
    </div>
    <div className="topnav__right-user__name">
      {user.name}
    </div>
  </div>
);

const renderUserMenu = (item, index) => (
  <Link to={item.href} key={index}>
    <div className="notification-item">
      <i className={item.icon}></i>
      <span>{item.content}</span>
    </div>
  </Link>
);

const Topnav = () => {
  const { pathname = {} } = useLocation();
  const theme = useTheme();
  const isXsDevice = useMediaQuery(theme.breakpoints.up('xs'));
  const [showInput, setShowInput] = useState(isXsDevice);

  const userInfor = useSelector((state) => state.userInfo);
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
          {/* dropdown here */}
          <Dropdown
            customToggle={() => renderUserToggle(userInfor)}
            contentData={user_menu}
            renderItems={(item, index) => renderUserMenu(item, index)}
          />
        </div>
        <div className="topnav__right-item">
          <ThemeMenu />
        </div>
      </div>
    </div>
  );
};

export default Topnav;
