import React from 'react';
import { useSelector } from 'react-redux';
import PostItem from './PostItem';



const Post = () => {
  const { posts } = useSelector(state => state.post);
  const { refresh_token } = useSelector(state => state.token);
  const userInfo = useSelector(state => state.userInfo);

  // useEffect(() => {
  // setContent(comment.content);
  // setIsLike(false)
  // setOnReply(false)
  // if (posts.likes.find(like => like._id === userInfo._id)) {
  // setIsLike(true);
  // }
  // }, [posts.likes, userInfo._id]);
  return (
    <div>
      {posts?.map(post => (
        <>
          <PostItem key={post._id} post={post} refresh_token={refresh_token} userInfo={userInfo} />
        </>
      ))}
    </div>

  );
};

export default Post;
