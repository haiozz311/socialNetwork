import axiosClient from './axiosClient';

const URL = process.env.REACT_APP_API_LOCAL_BASE_URL;

const highscoreApi = {
  putUpdateHighscore(name = '', score = 0, token) {
    return axiosClient.put(`${URL}/api/update`, { name, score }, {
      headers: { Authorization: token }
    });
  },

  getLeaderboard(name = '') {
    return axiosClient.get(`${URL}/api/leaderboard`, { params: { name } });
  },

  getLeaderboardByAdmin(name = '') {
    return axiosClient.get(`${URL}/api/leaderboardByAdmin`, { params: { name } });
  },
};

export default highscoreApi;
