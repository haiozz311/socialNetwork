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

  putUpdateProfile: (name = '',token) => {
    return axiosClient.patch(`${URL}/user/update`, { name }, {
      headers: { Authorization: token }
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
    return axiosClient.post(`${URL}/user/refresh_token`, null);
  },

  postLogin: (email, password) => {
    return axiosClient.post(`${URL}/user/login`, { email, password });
  },


  postLoginWithGoogle: (tokenId) => {
    return axiosClient.post(`${URL}/user/google_login`, { tokenId });
  },

  postLoginWithFacebook: (access_token) => {
    return axiosClient.post(`${URL}/login-fb`, { access_token });
  },

  // postLogout: () => {
  //   return axiosClient.post(`${URL}/logout`);
  // },

  // postResetPassword: (email, password, verifyCode) => {
  //   return axiosClient.post(`${URL}/reset-password`, {
  //     email,
  //     password,
  //     verifyCode,
  //   });
  // },

  putToggleWordFavorite: (username, word, isAdd) => {
    return axiosClient.put(`${URL}/toggle-favorite`, { username, word, isAdd });
  },

  putUpdateUserCoin: (newCoin) => {
    return axiosClient.put(`${URL}/update-coin`, { newCoin });
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

  getSendVerifyCode: (email) => {
    return axiosClient.get(`${URL}/send-verify-code`, {
      params: { email },
    });
  },

  getUserProfile: () => {
    return axiosClient.get(`${URL}/user-profile`);
  },
};

export default accountApi;
