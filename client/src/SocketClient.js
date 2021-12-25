import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateSocketPost } from 'redux/slices/post.slice';
import { setDataUser } from 'redux/slices/userInfo.slice';
import { AddNotify, RemoveNotify } from 'redux/slices/notify.slice';
import { addMessageSocket, addUser } from 'redux/slices/messenger';
import { setOnline,setOffline } from 'redux/slices/online.slice';
import { setCall } from 'redux/slices/call.slice';
import { setMessage } from 'redux/slices/message.slice';

const SocketClient = () => {
  const userInfor = useSelector((state) => state.userInfo);
  const { socket } = useSelector((state) => state.socket);
  const { online } = useSelector((state) => state.online);
  const { call } = useSelector((state) => state.call);
  const dispatch = useDispatch();
      // joinUser
  useEffect(() => {
    socket.emit('joinUser', userInfor);
  }, [socket, userInfor]);
  // Likes
  useEffect(() => {
    socket.on('likeToClient', (newPost) => {
      console.log('likeToClient');
      dispatch(updateSocketPost(newPost));
    });

    return () => socket.off('likeToClient');
  }, [socket, dispatch]);

  useEffect(() => {
    socket.on('unLikeToClient', (newPost) => {
      dispatch(updateSocketPost(newPost));

    });

    return () => socket.off('unLikeToClient');
  }, [socket, dispatch]);

      // Comments
  useEffect(() => {
    socket.on('createCommentToClient', newPost => {
      dispatch(updateSocketPost(newPost));
    });

    return () => socket.off('createCommentToClient');
  }, [socket, dispatch]);

  useEffect(() => {
    socket.on('deleteCommentToClient', newPost => {
      dispatch(updateSocketPost(newPost));
    });

    return () => socket.off('deleteCommentToClient');
  }, [socket, dispatch]);

      // Follow
  useEffect(() => {
    socket.on('followToClient', newUser => {
      console.log("client", newUser);
      dispatch(setDataUser(newUser));
    });

    return () => socket.off('followToClient');
  }, [socket, dispatch, userInfor]);

  useEffect(() => {
    socket.on('unfollowToClient', newUser => {
      console.log("client", newUser);
      dispatch(setDataUser(newUser));
    });

    return () => socket.off('unfollowToClient');
  }, [socket, dispatch, userInfor]);

        // Notifycation
    useEffect(() => {
      socket.on('createNotify', newUser => {
        console.log("notify test", newUser);
        dispatch(AddNotify(newUser));
      });

      return () => socket.off('createNotify');
    }, [socket, dispatch, userInfor]);

  useEffect(() => {
    socket.on('removeNotifyToClient', msg => {
      console.log('client', msg);
      dispatch(RemoveNotify(msg));
    });

    return () => socket.off('removeNotifyToClient');
  }, [socket, dispatch]);

      // Message
  useEffect(() => {
    socket.on('addMessageToClient', msg => {
      console.log('addMessageToClient', msg);
      dispatch(addMessageSocket(msg));
      dispatch(addUser({
        ...msg.user,
        text: msg.text,
        media: msg.media
      }));

    });

    return () => socket.off('addMessageToClient');
  }, [socket, dispatch]);

      // Check User Online / Offline
  useEffect(() => {
    console.log('checkUserOnline');
    socket.emit('checkUserOnline', userInfor);
  }, [socket, userInfor]);

  useEffect(() => {
    socket.on('checkUserOnlineToMe', data => {
      data.forEach(item => {
        if (!online.includes(item.id)) {
          dispatch(setOnline(item.id));
        }
      });
    });

    return () => socket.off('checkUserOnlineToMe');
  }, [socket, dispatch, online]);

  useEffect(() => {
    socket.on('checkUserOnlineToClient', id => {
      if (!online.includes(id)) {
        dispatch(setOnline(id));
      }
    });

    return () => socket.off('checkUserOnlineToClient');
  }, [socket, dispatch, online]);

  useEffect(() => {
    socket.on('CheckUserOffline', id => {
      console.log('off',id)
      dispatch(setOffline(id));
    });

    return () => socket.off('CheckUserOffline');
  }, [socket, dispatch]);

    // Call User
  useEffect(() => {
    socket.on('callUserToClient', data => {
      console.log('callUserToClient', data);
      dispatch(setCall(data));
    });

    return () => socket.off('callUserToClient');
  }, [socket, dispatch]);

  useEffect(() => {
    socket.on('userBusy', data => {
      dispatch(
        setMessage({ type: 'warning', message: `${call.name} đang bận !` }),
      );
    });

    return () => socket.off('userBusy');
  }, [socket, dispatch, call]);

  return <div></div>;
};

export default SocketClient;
