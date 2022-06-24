const router = require('express').Router();
const sentenceController = require('../controllers/sentence.controller');
const auth = require('../middleware/auth');

router.post(
  '/contribute/add-sentence',
  sentenceController.postContributeSentence,
);

router.get('/total', sentenceController.getTotalSentences);

router.get('/list', sentenceController.getSentenceList);
router.patch(
  '/updateSentence/:id', auth,
  sentenceController.updateSentence,
);

router.delete('/deleteSentence/:id', auth, sentenceController.deleteSentencce)


module.exports = router;
