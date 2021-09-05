import axiosClient from './axiosClient';

const URL = process.env.REACT_APP_API_LOCAL_BASE_URL;

const wordApi = {
  postContributeWord: (wordInfor) => {
    return axiosClient.post(`${URL}/api/contribute/add-word`, { ...wordInfor });
  },

  getCheckWordExistence: (word, type) => {
    return axiosClient.get(`${URL}/api/exist`, { params: { word, type } });
  },

  // get word, type, phonetic, mean
  getWordList: (page = 1, perPage = 8, packInfo, sortType = 'rand') => {

    return axiosClient.get(`${URL}/api/pack`, {
      params: { page, perPage, packInfo: JSON.stringify(packInfo), sortType },
    });
  },

  getSearchWord: (word = '', isCompact = false) => {
    return axiosClient.get(`${URL}/api/search-word`, {
      params: { word, isCompact },
    });
  },

  getWordDetails: (word = '') => {
    return axiosClient.get(`${URL}/api/word-details`, { params: { word } });
  },

  getUserFavoriteList: (page = 0, perPage = 20, sortType = 'rand', token) => {
    return axiosClient.get(`${URL}/api/favorite-list`,
      {
        params: { page, perPage, sortType },
        headers: { Authorization: token }
      });
  },

};

export default wordApi;
