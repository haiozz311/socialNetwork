import axiosClient from './axiosClient';

const URL = process.env.REACT_APP_API_LOCAL_BASE_URL;

const wordApi = {
  postContributeWord: (wordInfor) => {
    return axiosClient.post(`${URL}/api/contribute/add-word`, { ...wordInfor });
  },

  updateWordByAdmin: (
    mean,
    type,
    level,
    specialty,
    note,
    topics,
    picture,
    examples,
    synonyms,
    antonyms,
    word,
    phonetic,
    refresh_token, _id) => {
    return axiosClient.patch(`${URL}/api/updateWord/${_id}`, {
      mean,
      type,
      level,
      specialty,
      note,
      topics,
      picture,
      examples,
      synonyms,
      antonyms,
      word,
      phonetic
    }, {
      headers: { Authorization: refresh_token }
    });
  },

  getCheckWordExistence: (word, type) => {
    return axiosClient.get(`${URL}/api/exist`, { params: { word, type } });
  },

  getSearchUser: (name, token) => {
    return axiosClient.get(`${URL}/user/search`,
      {
        params: { name },
        headers: { Authorization: token }
      });
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
  deleteWord: (id, token) => {
    return axiosClient.delete(`${URL}/api/deleteWord/${id}`, {
      headers: { Authorization: token }
    });
  },
};

export default wordApi;
