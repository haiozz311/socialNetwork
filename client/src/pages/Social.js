import Status from 'components/UI/Satus';
import Post from 'components/UI/Post';
import useTitle from 'hooks/useTitle';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import postApi from 'apis/postApi';
import { setPosts } from 'redux/slices/post.slice';
import GlobalLoading from 'components/UI/GlobalLoading';
import RightSideBar from 'components/UI/RightSideBar/RightSideBar';
import './styles/social.scss';




function Social() {
  useTitle('Mạng xã hội - Cộng đồng dynonary');
  const [loading, setLoading] = useState(false);
  const { refresh_token } = useSelector(state => state.token);
  const userInfo = useSelector(state => state.userInfo);
  const { posts } = useSelector(state => state.post);
  const dispatch = useDispatch();
  useEffect(() => {
    if (refresh_token) {
      const getPosts = async () => {
        setLoading(true);
        const res = await postApi.getPost(refresh_token);
        if (res) {
          dispatch(setPosts(res.data.posts));
          setLoading(false);
        }

      };
      getPosts();
    }
  }, [refresh_token, dispatch]);

  return (
    <div className="social">
      <Grid container className="container">
        <Grid item xs={8}>
          <Status />
          <Post />
        </Grid>
        <Grid item xs={4}>
          <RightSideBar />
        </Grid>
      </Grid>
      {loading && <GlobalLoading />}
    </div>
  );
}

export default Social;

