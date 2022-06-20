const highscoreApi = require('express').Router();
const highscoreController = require('../controllers/highscore.controller');

highscoreApi.put('/update', highscoreController.putUpdateHighScore);

highscoreApi.get('/leaderboard', highscoreController.getLeaderboard);

highscoreApi.get('/leaderboardByAdmin', highscoreController.getLeaderboardByAdmin);


module.exports = highscoreApi;
