import axiosClient from './axiosClient';
const URL = process.env.REACT_APP_API_LOCAL_BASE_URL;

const accountApi = {
  postRegisterAccount: (email, name, password) => {
    return axiosClient.post(`${URL}/user/register`, { email, name, password });
  },

  forgotPassword: (email) => {
    return axiosClient.post(`${URL}/user/forgot`, { email });
  },

  fetchUser: (token) => {
    return axiosClient.get(`${URL}/user/infor`, {
      headers: { Authorization: token }
      // token
    });
  },

  getNotify: (token) => {
    return axiosClient.get(`${URL}/api/notifies`, {
      headers: { Authorization: token }
      // token
    });
  },

  fetchUserById: (id, token) => {
    return axiosClient.get(`${URL}/user/getUser/${id}`, {
      headers: { Authorization: token }
      // token
    });
  },

  followUser: (id, token) => {
    return axiosClient.patch(`${URL}/user/${id}/follow`, {}, {
      headers: { Authorization: token }
    });
  },

  unFollowUser: (id, token) => {
    return axiosClient.patch(`${URL}/user/${id}/unfollow`, {}, {
      headers: { Authorization: token }
    });
  },

  putUpdateProfile: (name = '', token) => {
    return axiosClient.patch(`${URL}/user/update`, { name }, {
      headers: { Authorization: token }
    });
  },

  putUpdateProfileByAdmin: (name = '', coin, role , email, refresh_token, _id) => {
    return axiosClient.patch(`${URL}/user/updateInforUser/${_id}`, { name, coin, role, email }, {
      headers: { Authorization: refresh_token }
    });
  },

  resetPassword: (password, token) => {
    return axiosClient.post(`${URL}/user/reset`, { password }, {
      headers: { Authorization: token }
    });
  },

  userLogout: () => {
    return axiosClient.get(`${URL}/user/logout`);
  },

  activeToken: (activation_token) => {
    return axiosClient.post(`${URL}/user/activation`, { activation_token });
  },

  refresh_token: () => {
    return axiosClient.post(`${URL}/user/refresh_token`, {});
  },

  postLogin: (email, password) => {
    return axiosClient.post(`${URL}/user/login`, { email, password });
  },


  postLoginWithGoogle: (tokenId) => {
    return axiosClient.post(`${URL}/user/google_login`, { tokenId });
  },

  putToggleWordFavorite: (name, word, isAdd) => {
    return axiosClient.put(`${URL}/user/toggle-favorite`, { name, word, isAdd });
  },

  putUpdateUserCoin: (newCoin, token) => {
    return axiosClient.put(`${URL}/user/update-coin`, { newCoin },
      {
        headers: { Authorization: token }
      });
  },

  putUpdateAvt: (formData, refresh_token) => {
    return axiosClient.post(`${URL}/api/upload_avatar`, { formData },
      {
        headers: { 'content-type': 'multipart/form-data', Authorization: refresh_token }
      }
    );
  },


  getUserInfo: () => {
    return axiosClient.get(`${URL}/user/user-info`);
  },

  getTotalUser: () => {
    return axiosClient.get(`${URL}/user/getTotalUser`);
  },

  deleteUser: (id, token) => {
    return axiosClient.delete(`${URL}/user/delete/${id}`, {
        headers: { Authorization: token }
      });
  },

};

export default accountApi;
