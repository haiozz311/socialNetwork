
import useTitle from 'hooks/useTitle';
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
// import { getPost } from 'redux/slices/postDetail';
import PostItem from 'components/UI/Post/PostItem';
import postApi from 'apis/postApi';
import { setPosts } from 'redux/slices/post.slice';

const Post = () => {
  useTitle('Bài viết');
  const { id } = useParams();
  const { refresh_token } = useSelector(state => state.token);
  const userInfo = useSelector(state => state.userInfo);
  const { posts } = useSelector(state => state.post);
  const dispatch = useDispatch();
  const [post, setPost] = useState([]);

  useEffect(() => {
    if (refresh_token) {
      const getPosts = async () => {
        const res = await postApi.getPost(refresh_token);
        if (res) {
          dispatch(setPosts(res.data.posts));
        }

      };
      getPosts();
    }
  }, [refresh_token, dispatch]);

  useEffect(() => {
    // if (posts.every(post => post._id !== id)) {
    //   dispatch(getPost({ id, refresh_token }));
    // }

    if (posts.length > 0) {
      const newArr = posts?.filter(post => post._id === id);
      setPost(newArr);
    }
  }, [id, refresh_token, posts]);


  return (
    <>
      {
        post.map(post => (
          <>
            <PostItem post={post} refresh_token={refresh_token} userInfo={userInfo} />
          </>
        ))
      }
    </>
  )
}

export default Post;
