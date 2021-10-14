import React, { useEffect, useState } from 'react';
import { CardContent, Typography, Card, CardActions, IconButton } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import IconHeader from '../IconHeader';
import Carousel from '../Carousel';
import { likePostAction, unlikePostAction } from 'redux/slices/post.slice';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import SendIcon from '@material-ui/icons/Send';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import LikePost from '../LikePost';
import { Link } from 'react-router-dom'
import PostContent from './PostContent';
import Comments from '../Comments';
import InputCustom from '../InputCustom';
import InputComment from '../Comments/InputComment';

const PostItem = ({ post, refresh_token, userInfo }) => {
  const dispatch = useDispatch();
  const [isLike, setIsLike] = useState(false);
  const [readMore, setReadMore] = useState(false);
  const handleLike = async () => {
    dispatch(likePostAction({ post, userInfo, refresh_token }));
  };

  const handleUnLike = async () => {
    dispatch(unlikePostAction({ post, userInfo, refresh_token }));
  };

  useEffect(() => {
    if (post.likes.find(like => like._id === userInfo._id)) {
      setIsLike(true);
    } else {
      setIsLike(false);
    }
  }, [post.likes, userInfo._id]);
  return (
    <>
      <Card className="mb-8">
        <div className='d-flex jus-content-between'>
          <Link to={`/profile/${post.user._id}`}>
            <div className="d-flex mt-4">
              <Avatar className='mx-8' src={post?.user?.avatar} />
              <div >
                <p className='pb-4'>{post.user.name}</p>
                <p>{moment(post?.createdAt).fromNow()}</p>
              </div>
            </div>
          </Link>
          <IconHeader post={post} />
        </div>
        <PostContent post={post} readMore={readMore} setReadMore={setReadMore} />

        {
          post?.images?.length > 0 && <Carousel images={post.images} id={post._id} />
        }
        <CardActions disableSpacing className="d-flex jus-content-between">
          <div>
            <IconButton aria-label="add to favorites">
              <LikePost
                like={isLike}
                handleLike={handleLike}
                handleUnLike={handleUnLike}
              />
            </IconButton>
            {post.likes.length} likes
            <IconButton aria-label="ChatBubbleOutlineIcon">
              <ChatBubbleOutlineIcon />
            </IconButton>
            {post.comments.length} comments
            <IconButton aria-label="ChatBubbleOutlineIcon">
              <SendIcon />
            </IconButton>
            <span>send</span>
          </div>
          <div>
            <IconButton aria-label="BookmarkBorderIcon">
              <BookmarkBorderIcon />
            </IconButton>
          </div>
        </CardActions>
        <Comments post={post} />
        <InputComment post={post} />
      </Card>
    </>
  );
};

export default PostItem;
