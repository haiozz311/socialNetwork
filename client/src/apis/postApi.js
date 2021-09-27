import axiosClient from './axiosClient';

const URL = process.env.REACT_APP_API_LOCAL_BASE_URL;

const postApi = {
  getPost: (token) => {
    return axiosClient.get(`${URL}/api/posts`, {
      headers: { Authorization: token }
    });
  },

};

export default postApi;
