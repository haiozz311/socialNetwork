import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateSocketPost } from 'redux/slices/post.slice';
import { setDataUser } from 'redux/slices/userInfo.slice';

const SocketClient = () => {
  const userInfor = useSelector((state) => state.userInfo);
  const { socket } = useSelector((state) => state.socket);
  const dispatch = useDispatch();
      // joinUser
  useEffect(() => {
    socket.emit('joinUser', userInfor);
  }, [socket, userInfor]);
  // Likes
  useEffect(() => {
    socket.on('likeToClient', (newPost) => {
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
  }, [socket, dispatch,userInfor]);

  return <div></div>;
};

export default SocketClient;
