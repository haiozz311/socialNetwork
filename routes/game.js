const router = require('express').Router();
const gameController = require('../controllers/game.controller');

// ======== CORRECT WORD GAME ========
router.get('/correct-word/pack', gameController.getWordPackCWG);

// ======== WORD MATCH GAME ========
router.get('/word-match/pack', gameController.getWordPackWMG);

// ======== FAST GAME ========
router.get('/fast-game/pack', gameController.getWordPackFS);

module.exports = router;
