import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { comment } from 'redux/slices/post.slice';
import Icons from '../Icon/Icons';
import useStyle from './style';

const InputComment = ({ children, post, onReply, setOnReply }) => {
  const userInfo = useSelector(state => state.userInfo);
  const { refresh_token } = useSelector(state => state.token);
  const { socket } = useSelector((state) => state.socket);
  const dispatch = useDispatch();
  const classes = useStyle();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) {
      if (setOnReply) return setOnReply(false);
      return;
    }

    setContent('');

    const newComment = {
      content,
      likes: [],
      user: userInfo,
      createdAt: new Date().toISOString(),
      reply: onReply && onReply.commentId,
      tag: onReply && onReply.user
    };
    console.log("newComment", newComment)
    dispatch(comment({ post, newComment, userInfo, refresh_token, socket }));

    if (setOnReply) return setOnReply(false);
  };
  const [content, setContent] = useState('');
  return (
    <form className="d-flex align-i-center" onSubmit={handleSubmit} >
      {children}
      <input className={`${classes.comment_input}`} type="text" placeholder="Bình luận ..."
        value={content} onChange={e => setContent(e.target.value)} />

      {/* <Icons setContent={setContent} content={content} /> */}
      <button type="submit" className={`${classes.btnSubmit}`}>
        Đăng bình luận
      </button>
    </form>
  );
};

export default InputComment;
