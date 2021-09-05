const router = require('express').Router();
const sentenceController = require('../controllers/sentence.controller');

router.post(
  '/contribute/add-sentence',
  sentenceController.postContributeSentence,
);

router.get('/total', sentenceController.getTotalSentences);

router.get('/list', sentenceController.getSentenceList);

module.exports = router;
