import axiosClient from './axiosClient';

const URL = process.env.REACT_APP_API_LOCAL_BASE_URL;

const sentenceApi = {
  postContributeSentence: (sentence, mean, note, topics) => {
    return axiosClient.post(`${URL}/api/contribute/add-sentence`, {
      sentence,
      mean,
      note,
      topics,
    });
  },

  getTotalSentencceRequest: () => {
    return axiosClient.get(`${URL}/api/getTotalSentenceRequest`);
  },

  deleteSentenceRequest: (_id) => {
    return axiosClient.post(`${URL}/api/deleteSentenceRequest`, { _id });
  },

  postConfirmSentence: (_id) => {
    return axiosClient.post(`${URL}/api/confirmSentence`, { _id });
  },

  postRequestSentence: (sentence, mean, note, topics, _id, refresh_token) => {
    return axiosClient.post(`${URL}/api/requestSentence/${_id}`, { sentence, mean, note, topics }, {
      headers: { Authorization: refresh_token }
    });
  },

  updateSentenceByAdmin: (
    mean, sentence, note, topics,
    refresh_token, _id) => {
    return axiosClient.patch(`${URL}/api/updateSentence/${_id}`, {
      mean, sentence, note, topics,
    }, {
      headers: { Authorization: refresh_token }
    });
  },

  getTotalSentences: (topics = []) => {
    console.log({ topics });
    return axiosClient.get(`${URL}/api/total`, {
      params: { topics: JSON.stringify(topics) },
    });
  },

  getSentenceList: (page = 1, perPage = 20, topics = []) => {
    console.log({ page, perPage, topics });
    return axiosClient.get(`${URL}/api/list`, {
      params: {
        page,
        perPage,
        topics: JSON.stringify(topics),
      },
    });
  },

  deleteSentence: (id, token) => {
    return axiosClient.delete(`${URL}/api/deleteSentence/${id}`, {
      headers: { Authorization: token }
    });
  },
};

export default sentenceApi;
