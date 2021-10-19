import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosClient from 'apis/axiosClient';
import { imageUpload } from 'helper/imageUpload';

const URL = process.env.REACT_APP_API_LOCAL_BASE_URL;

export const createPost = createAsyncThunk(
  'post/createPost',
  async ({ content, images, refresh_token }) => {
    let media = [];
    if (images.length > 0) {
      media = await imageUpload(images);
    }
    const res = await axiosClient.post(`${URL}/api/posts`, { content, images: media }, {
      headers: { Authorization: refresh_token }
    });
    return res.data.newPost;
  },
);

export const likePostAction = createAsyncThunk(
  'post/likePost',
  async ({ post, userInfo, refresh_token }) => {
    const newPost = { ...post, likes: [...post.likes, userInfo] };
    await axiosClient.patch(`${URL}/api/post/${post._id}/like`, {}, {
      headers: { Authorization: refresh_token }
    });
    return newPost;
  },
);

export const unlikePostAction = createAsyncThunk(
  'post/unlikePost',
  async ({ post, userInfo, refresh_token }) => {
    const newPost = { ...post, likes: post.likes.filter(like => like._id !== userInfo._id) };
    await axiosClient.patch(`${URL}/api/post/${post._id}/unlike`, {}, {
      headers: { Authorization: refresh_token }
    });
    return newPost;
  },
);

export const comment = createAsyncThunk(
  'post/comment',
  async ({ post, newComment, userInfo, refresh_token }) => {
    const data = { ...newComment, postId: post._id, postUserId: post.user._id };

    const res = await axiosClient.post(`${URL}/api/comment`, data, {
      headers: { Authorization: refresh_token }
    });
    const newData = { ...res.data.newComment, user: userInfo };
    const newPostData = { ...post, comments: [...post.comments, newData] };
    return newPostData;
  },
);

export const updateComment = createAsyncThunk(
  'post/updateComment',
  async ({ comment, post, content, refresh_token }) => {
    const newComments = post.comments.map(cm => cm._id === comment._id ? { ...comment, content } : cm);
    const newPost = { ...post, comments: newComments };
    const res = await axiosClient.patch(`${URL}/api/comment/${comment._id}`, { content }, {
      headers: { Authorization: refresh_token }
    });

    return newPost;
  },
);

export const deleteDataAPI = async (url, token) => {
  const res = await axiosClient.delete(`/api/${url}`, {
    headers: { Authorization: token }
  });
  return res;
}

export const deleteComment = createAsyncThunk(
  'post/deleteComment',
  async ({ post, comment, refresh_token }) => {
    const deleteArr = [...post.comments.filter(cm => cm.reply === comment._id), comment];
    const newPost = {
      ...post,
      comments: post.comments.filter(cm => !deleteArr.find(da => cm._id === da._id))
    };
    deleteArr.forEach(item => {
      deleteDataAPI(`comment/${item._id}`, refresh_token);
    });
    // const msg = {
    //   id: item._id,
    //   text: comment.reply ? 'mentioned you in a comment.' : 'has commented on your post.',
    //   recipients: comment.reply ? [comment.tag._id] : [post.user._id],
    //   url: `/post/${post._id}`,
    // }

    // dispatch(removeNotify({ msg, auth, socket }))

    // const newComments = post.comments.map(cm => cm._id === comment._id ? { ...comment, content } : cm);
    // const newPost = { ...post, comments: newComments };
    // const res = await axiosClient.patch(`${URL}/api/comment/${comment._id}`, { content }, {
    //   headers: { Authorization: refresh_token }
    // });

    return newPost;
  },
);

export const likeComment = createAsyncThunk(
  'post/likeComment',
  async ({ comment, post, userInfo, refresh_token }) => {
    const newComment = { ...comment, likes: [...comment.likes, userInfo] };
    const newComments = post.comments.map(cm => cm._id === comment._id ? newComment : cm);

    const newPost = { ...post, comments: newComments };
    await axiosClient.patch(`${URL}/api/comment/${comment._id}/like`, {}, {
      headers: { Authorization: refresh_token }
    });
    return newPost;
  },
);

export const unLikeComment = createAsyncThunk(
  'post/unLikeComment',
  async ({ comment, post, userInfo, refresh_token }) => {
    const newComment = { ...comment, likes: comment.likes.filter(item => item._id !== userInfo._id) };
    const newComments = post.comments.map(item =>
      (item._id === comment._id ? newComment : item)
    );
    console.log({ newComments });
    const newPost = { ...post, comments: newComments };
    console.log({ newPost });
    await axiosClient.patch(`${URL}/api/comment/${comment._id}/unlike`, {}, {
      headers: { Authorization: refresh_token }
    });

    return newPost;
  },
);

const postSlice = createSlice({
  name: 'post',
  initialState: {
    loading: false,
    posts: [],
    result: 0,
    page: 2
  },
  reducers: {
    setPosts(state, action) {
      state.posts = action.payload;
    }
  },
  extraReducers: {
    [createPost.fulfilled]: (state, action) => {
      state.posts.unshift(action.payload);
    },
    [likePostAction.fulfilled]: (state, action) => {
      state.posts = state.posts.map(post => (post._id === action.payload._id ? action.payload : post));
    },
    [unlikePostAction.fulfilled]: (state, action) => {
      state.posts = state.posts.map(post => (post._id === action.payload._id ? action.payload : post));
    },
    [comment.fulfilled]: (state, action) => {
      const data = state.posts.map(post => post._id === action.payload._id ? action.payload : post);
      state.posts = data;
    },
    [updateComment.fulfilled]: (state, action) => {
      const data = state.posts.map(post => post._id === action.payload._id ? action.payload : post);
      state.posts = data;
    },
    [likeComment.fulfilled]: (state, action) => {
      const data = state.posts.map(post => post._id === action.payload._id ? action.payload : post);
      state.posts = data;
    },
    [unLikeComment.fulfilled]: (state, action) => {
      const data = state.posts.map(post => post._id === action.payload._id ? action.payload : post);
      state.posts = data;
    },
    [deleteComment.fulfilled]: (state, action) => {
      const data = state.posts.map(post => post._id === action.payload._id ? action.payload : post);
      state.posts = data;
    },
  },
});

const { reducer, actions } = postSlice;
export const { setPosts } = actions;
export default reducer;

// const newData = data.map(item =>
//   (item._id === id ? post : item)
// )
// return newData;
