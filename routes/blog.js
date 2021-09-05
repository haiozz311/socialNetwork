const router = require('express').Router();
const blogController = require('../controllers/blog.controller');

router.get('/blog-list', blogController.getBlogList);

router.get('/blog-html', blogController.getBlogHtml);

module.exports = router;
