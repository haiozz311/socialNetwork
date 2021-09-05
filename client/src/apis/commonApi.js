import axiosClient from './axiosClient';

const URL = process.env.REACT_APP_API_LOCAL_BASE_URL;

const commonApi = {
  getWordPackTotal: (packInfo) => {
    return axiosClient.get(`${URL}/api/word-pack/total`, {
      params: { packInfo: JSON.stringify(packInfo) },
    });
  },
};

export default commonApi;
