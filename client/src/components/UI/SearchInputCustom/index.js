import { Grow } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import InputBase from '@material-ui/core/InputBase';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import wordApi from 'apis/wordApi';
import { MAX } from 'constant';
import NAV_SEARCH_DATA from 'constant/nav-search-data';
import { debounce } from 'helper';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import React, { useRef, useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import WordDetailModal from '../WordDetailModal';
import useStyle from './style';
let timer = null;

function SearchInputCustom({ placeholder, showInput, prefixIcon }) {
  const classes = useStyle();
  const [anchorEl, setAnchorEl] = useState(null);
  const searchBarRef = useRef(null);
  const [resultList, setResultList] = useState([]);
  const [userFlag, setUserFlag] = useState(false);
  const [resultUser, setResultUser] = useState([]);
  const [wordDetails, setWordDetails] = useState(null);
  const [social, setSocail] = useState(false);
  const [showPlaceholder, setshowPlaceholder] = useState(placeholder);
  const history = useHistory();
  const { pathname } = useLocation();
  const { refresh_token } = useSelector(state => state.token);
  useEffect(() => {
    if (pathname === '/social' || pathname.includes('profile')) {
      setSocail(true);
      setshowPlaceholder('Nhập tên bạn muốn tìm...');
    } else {
      setSocail(false);
    }
  }, [pathname]);

  const handleCloseModal = () => {
    console.log("close");
    setAnchorEl(null);
  };

  const handleOpenWordDetails = async (word, to) => {
    setAnchorEl(null);
    if (Boolean(to)) {
      history.push(to);
      return;
    }

    const apiRes = await wordApi.getWordDetails(word);
    setWordDetails(apiRes?.data);
  };

  const handleSearch = (e) => {
    if (!social) {
      timer = debounce(
        timer,
        async function () {
          const word = e.target?.value;
          if (!Boolean(word)) {
            return;
          }
          let navSearchList =
            NAV_SEARCH_DATA.filter(
              (i) =>
                `${i.title} ${i.searchKey}`.indexOf(word.toLowerCase()) !== -1,
            ).map((i) => ({ title: i.title, to: i.to })) || [];

          const apiRes = await wordApi.getSearchWord(word, true);
          if (apiRes.data?.packList) {
            navSearchList = [
              ...navSearchList,
              ...apiRes.data.packList.map((i) => ({ title: i.word, to: null })),
            ];
          }

          setResultList(navSearchList?.slice(0, 20) || []);
          setAnchorEl(searchBarRef.current);
        },
        350,
      );
    } else {
      timer = debounce(
        timer,
        async function () {
          const word = e.target?.value;
          if (!Boolean(word)) {
            return;
          }
          let navSearchList = [];
          const apiRes = await wordApi.getSearchUser(word, refresh_token);
          if (apiRes.data?.users) {
            navSearchList = [
              ...navSearchList,
              ...apiRes.data.users.map((i) => ({ avatar: i.avatar, name: i.name, _id: i._id })),
            ];
          }

          setResultUser(navSearchList?.slice(0, 20) || []);
          setAnchorEl(searchBarRef.current);
          setUserFlag(true);
        },
        350,
      );
    }
  };

  const handleProfileUser = (id) => {
    history.push(`/profile/${id}`);
    setAnchorEl(null);
  };

  return (
    <div className={classes.nativeInput}>
      <div
        ref={searchBarRef}
        className={`${classes.icon} flex-center ${showInput ? 'show-input' : 'cur-pointer'
          }`}>
        {prefixIcon}
      </div>
      {showInput && (
        <Grow in={true}>
          <InputBase
            onChange={handleSearch}
            autoFocus
            placeholder={showPlaceholder}
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ 'aria-label': 'search', maxLength: MAX.SEARCH_LEN }}
          />
        </Grow>
      )}
      {/* Grow => transition => tuần tự */}

      {/* result menu */}
      {!userFlag ? <Menu
        classes={{
          paper: classes.resMenu,
        }}
        keepMounted
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={Boolean(anchorEl)}
        onClose={handleCloseModal}>
        {resultList?.length > 0 ? (
          resultList.map((item, index) => (
            <MenuItem
              key={index}
              onClick={() => handleOpenWordDetails(item.title, item.to)}>{item.title}
            </MenuItem>
          ))
        ) : (
          <MenuItem className={classes.resMenuItem} onClick={handleCloseModal}>
            Không tìm thấy kết quả nào
          </MenuItem>
        )}
      </Menu> :
        <Menu
          classes={{
            paper: classes.resMenu,
          }}
          keepMounted
          anchorEl={anchorEl}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={Boolean(anchorEl)}
          onClick={handleCloseModal}>
          {resultUser?.length > 0 ? (
            resultUser.map((item) => (
              <MenuItem
                key={item._id}
                onClick={() => handleProfileUser(item._id)}>
                <Avatar
                  className="mr-4"
                  alt="Username"
                  src={item.avatar}
                />
                {item.name}
              </MenuItem>
            ))
          ) : (
            <MenuItem className={classes.resMenuItem} onClick={handleCloseModal}>
              Không tìm thấy kết quả nào
            </MenuItem>
          )}
        </Menu>
      }


      {/* word detail modal */}
      {wordDetails && (
        <WordDetailModal
          open={true}
          loading={false}
          {...wordDetails}
          onClose={() => setWordDetails(null)}
        />
      )}
    </div>
  );
}

SearchInputCustom.propTypes = {
  placeholder: PropTypes.string,
  prefixIcon: PropTypes.any,
  showInput: PropTypes.bool,
};

SearchInputCustom.defaultProps = {
  placeholder: '',
  prefixIcon: null,
  showInput: false,
};

export default SearchInputCustom;
