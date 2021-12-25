import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import wordApi from 'apis/wordApi';
import Avatar from '@material-ui/core/Avatar';
import { useHistory } from 'react-router-dom';
import { addUser,getConversations, checkUserOnlineOffline } from 'redux/slices/messenger';
import imgNotification from 'assets/icons/message/notification.png';

const LeftSide = () => {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const pageEnd = useRef();
  const [page, setPage] = useState(0);

  const userInfor = useSelector((state) => state.userInfo);
  const { refresh_token } = useSelector((state) => state.token);
  const { online } = useSelector((state) => state.online);
  const message = useSelector((state) => state.messenger);
  const [searchUsers, setSearchUsers] = useState([]);
  const history = useHistory();
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');

  const dispatch = useDispatch();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search) return;
    const apiRes = await wordApi.getSearchUser(search, refresh_token);
    const dataSearch = apiRes.data.users.filter(item => item._id !== userInfor._id);
    setSearchUsers(dataSearch);
  };

  const handleAddUser = (user) => {
    console.log('user', user);
    setSearch('');
    setSearchUsers([]);
    dispatch(addUser({ ...user, text: '', media: [] }));
    dispatch(checkUserOnlineOffline(online));
    return history.push(`/message?id=${user._id}`);
  };

  const isActive = (user) => {
    if (id === user._id) return 'active';
    return '';
  };
  useEffect(() => {
    if (message.firstLoad) return;
    dispatch(getConversations({ userInfor,refresh_token }));
  }, [dispatch, userInfor, message.firstLoad]);

      // Check User Online - Offline
  useEffect(() => {
    if (message.firstLoad) {
      dispatch(checkUserOnlineOffline(online));
    }
  }, [online, message.firstLoad, dispatch]);

  return (
    <>
    <div className="cover-top">
      <div className="cover-infor">
        <Avatar src={userInfor.avatar} />
        <div className="infor">
          <p className="name">{userInfor.name}</p>
          <p className="email">{userInfor.email}</p>
        </div>
      </div>
      <div className="notification">
        <img className="icon-notification" src={imgNotification} alt="notification" />
      </div>
      </div>
    <div className="content-left">
    <form className="message_header" onSubmit={handleSearch} >
      <input type="text" value={search}
      placeholder="Enter to Search..."
      onChange={e => setSearch(e.target.value)} />
        <button type="submit" style={{display: 'none'}}>Search</button>
      </form>
      <div className="message_chat_list">
        {
          searchUsers.length !== 0 ? (
            searchUsers.map((user,index) => (
              <div className="message_user" key={index} onClick={() => handleAddUser(user)}>
                <Avatar src={user.avatar} />
                <div className="infor_user">
                  <p className="name">{user.name}</p>
                </div>
              </div>
            ))
          ) : (
            message.users.map(user => (
              <div key={user._id}
                className={`message_user ${isActive(user)}`}
                onClick={() => handleAddUser(user)}>
                  {/* <UserCard user={user} msg={true}>
                      {
                          user.online
                          ? <i className="fas fa-circle text-success" />
                          : auth.user.following.find(item =>
                              item._id === user._id
                          ) && <i className="fas fa-circle" />

                      }
                  </UserCard> */}
                <Avatar src={user.avatar} />
                <div className="infor_user">
                  <p className="name">{user.name}</p>
                </div>
                {
                  user.online ? (
                    <div className='online'></div>
                  ): (
                    <div className="offline"></div>
                  )
                }
              </div>
          ))
          )
        }
        <button ref={pageEnd} style={{opacity: 0}} >Load More</button>
        </div>
      </div>
    </>
  );
};

export default LeftSide;
