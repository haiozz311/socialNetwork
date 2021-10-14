import React, { useState } from 'react';
import MenuItemComment from './MenuItem';
import { useDispatch, useSelector } from 'react-redux';

const CommentMenu = ({ post, comment, setOnEdit }) => {
  const userInfo = useSelector((state) => state.userInfo);
  const [myComment, setMyComment] = useState(false);
  return (
    <div className="menu">
      {
        (post.user._id === userInfo._id || comment.user._id === userInfo._id) &&
        <div className="nav-item dropdown">


          <div className="dropdown-menu" aria-labelledby="moreLink">
            {
              post.user._id === userInfo._id // my post
                ? comment.user._id === userInfo._id
                  ? <MenuItemComment post={post} myComment={!myComment} setOnEdit={setOnEdit} comment={comment} /> // my comment
                  : <MenuItemComment post={post} myComment={myComment} setOnEdit={setOnEdit} comment={comment} />
                : comment.user._id === userInfo._id && <MenuItemComment post={post} myComment={myComment} setOnEdit={setOnEdit} comment={comment} /> // # my post
            }
          </div>

        </div>
      }

    </div>
  );
};

export default CommentMenu;
