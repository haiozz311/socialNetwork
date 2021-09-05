const router = require('express').Router();
const flashcardController = require('../controllers/flashcard.controller');

router.get('/word-pack', flashcardController.getWordPack);

module.exports = router;
