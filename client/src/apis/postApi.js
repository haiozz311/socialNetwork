import axiosClient from './axiosClient';

const URL = process.env.REACT_APP_API_LOCAL_BASE_URL;

const postApi = {
  getPost: (token) => {
    return axiosClient.get(`${URL}/api/posts`, {
      headers: { Authorization: token }
    });
  },
  getTotalPost: () => {
    return axiosClient.get(`${URL}/api/getTotalPost`);
  },
   getAllPost: () => {
    return axiosClient.get(`${URL}/api/getAllPost`);
  },
};

export default postApi;
