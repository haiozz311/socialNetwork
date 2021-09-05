const router = require('express').Router();
const commonController = require('../controllers/common.controller');

router.get('/word-pack/total', commonController.getTotalWordPack);

module.exports = router;
