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
};

export default sentenceApi;
