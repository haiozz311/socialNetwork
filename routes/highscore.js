const router = require('express').Router();
const highscoreController = require('../controllers/highscore.controller');
const auth = require('../middleware/auth');

router.put('/update', auth, highscoreController.putUpdateHighScore);

router.get('/leaderboard', highscoreController.getLeaderboard);
router.get('/leaderboardByAdmin', highscoreController.getLeaderboardByAdmin);

module.exports = router;
