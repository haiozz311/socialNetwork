import axiosClient from './axiosClient';

const URL = process.env.REACT_APP_API_LOCAL_BASE_URL;

const flashcardApi = {
  getWordPack: (page = 1, perPage = 8, packInfo) => {
    return axiosClient.get(`${URL}/api/word-pack`, {
      params: { page, perPage, packInfo: JSON.stringify(packInfo) },
    });
  },
};

export default flashcardApi;
