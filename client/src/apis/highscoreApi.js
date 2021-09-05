import axiosClient from './axiosClient';

const URL = process.env.REACT_APP_API_LOCAL_BASE_URL;

const highscoreApi = {
  putUpdateHighscore(name = '', score = 0, token) {
    console.log("name, score", name, score);
    return axiosClient.put(`${URL}/api/update`, { name, score }, {
      headers: { Authorization: token }
    });
  },

  getLeaderboard(name = '') {
    return axiosClient.get(`${URL}/api/leaderboard`, { params: { name } });
  },
};

export default highscoreApi;
