const router = require('express').Router();
const wordController = require('../controllers/word.controller');
const auth = require('../middleware/auth');

router.post('/contribute/add-word', wordController.postContributeWord);

router.get('/exist', wordController.getCheckWordExistence);
router.get('/pack', wordController.getWordPack);
router.get('/search-word', wordController.getSearchWord);
router.get('/word-details', wordController.getWordDetails);
router.get(
  '/favorite-list',
  auth,
  wordController.getUserFavoriteList,
);
router.get('/getTotalWordRequest', wordController.getWordRequest)

router.patch(
  '/updateWord/:id', auth,
  wordController.updateWord,
);
router.post(
  '/requestWord/:id', auth,
  wordController.requestWord,
);
router.post(
  '/deleteWordRequest',
  wordController.deleteWordRequest,
);
router.post(
  '/confirmWord',
  wordController.confirmWord,
);
router.delete('/deleteWord/:id', auth, wordController.deleteWord)


module.exports = router;
