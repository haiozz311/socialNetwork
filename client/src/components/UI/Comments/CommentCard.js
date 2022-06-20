import React, { useState, useEffect } from 'react'
import Avatar from '@material-ui/core/Avatar';
import { Link } from 'react-router-dom';
import moment from 'moment';
import LikePost from '../LikePost';
import { useDispatch, useSelector } from 'react-redux';
import CommentMenu from './CommentMenu';
import { updateComment, likeComment, unLikeComment } from 'redux/slices/post.slice';
import useStyle from './style';
import InputComment from './InputComment';

const CommentCard = ({ children, comment, post, commentId }) => {

  const userInfo = useSelector((state) => state.userInfo);
  const { refresh_token } = useSelector(state => state.token);
  const dispatch = useDispatch();
  const [content, setContent] = useState('');
  const [readMore, setReadMore] = useState(false);
  const [isLike, setIsLike] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const [onReply, setOnReply] = useState(false);

  const classes = useStyle();
  useEffect(() => {
    setContent(comment.content);
    setIsLike(false);
    if (comment.likes.find(like => like._id === userInfo._id)) {
      setIsLike(true);
    }

  }, [comment, userInfo._id]);


  const handleLike = async () => {
    dispatch(likeComment({ comment, post, userInfo, refresh_token }));
    setIsLike(true);
  };

  const handleUnLike = async () => {
    dispatch(unLikeComment({ comment, post, userInfo, refresh_token }));
    setIsLike(false);
  };

  const handleUpdate = () => {
    if (comment.content !== content) {
      dispatch(updateComment({ comment, post, content, refresh_token }));
      setOnEdit(false);
    } else {
      setOnEdit(false);
    }
  };

  const handleReply = () => {
    if (onReply) {
      return setOnReply(false);
    }
    setOnReply({ ...comment, commentId });
  };
  return (

    <div >
      <Link to={`/profile/${comment.user._id}`} className="d-flex mx-8">
        <Avatar src={comment.user.avatar} />
        <h4 className={`${classes.textName} ml-4`}>{comment.user.name}</h4>
      </Link>
      <div className={`${classes.textContent} my-4`}>
        <div className="d-flex jus-content-between align-i-center mr-8">
          {
            onEdit
              ? <textarea className={`${classes.area} `} rows="5" value={content}
                onChange={e => setContent(e.target.value)} />

              : <div >
                {
                  comment.tag && comment.tag._id !== comment.user._id &&
                  <Link to={`/profile/${comment.tag._id}`} className="mr-1">
                    @{comment.tag.name}
                  </Link>
                }
                {
                  content.length < 100 ? content :
                    readMore ? content + ' ' : content.slice(0, 100) + '....'
                }
                {
                  content.length > 100 &&
                  <span className="readMore" onClick={() => setReadMore(!readMore)}>
                    {readMore ? 'Hide content' : 'Read more'}
                  </span>
                }
              </div>
          }
          <LikePost like={isLike} handleLike={handleLike} handleUnLike={handleUnLike} />
        </div>
        <div className="d-flex jus-content-between align-i-center">
          <div className="d-flex jus-content-between align-i-center">
            <small>{moment(comment.createdAt).fromNow()}</small>
            <small className="px-8">
              {comment.likes.length} likes
            </small>
            {
              onEdit
                ? <>
                  <small className={`${classes.point}`}
                    onClick={handleUpdate}
                  >
                    update
                  </small>
                  <small className={`${classes.point} px-8`}
                    onClick={() => setOnEdit(false)}>
                    cancel
                  </small>
                </>

                : <small className={`${classes.point}`}
                  onClick={handleReply}
                >
                  {onReply ? 'cancel' : 'reply'}
                </small>
            }
          </div>

          <CommentMenu post={post} comment={comment} setOnEdit={setOnEdit} />
        </div>
        {
          onReply &&
          <InputComment post={post} onReply={onReply} setOnReply={setOnReply} >
            <Link to={`/profile/${onReply.user._id}`} className="mr-4">
              @{onReply.user.name}:
            </Link>
          </InputComment>
        }
        {children}
      </div>
    </div >
  );
};

export default CommentCard;
