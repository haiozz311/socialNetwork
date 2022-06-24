const router = require('express').Router();
const blogController = require('../controllers/blog.controller');

router.get('/blog-list', blogController.getBlogList);

router.get('/blog-html', blogController.getBlogHtml);

router.post('/add-blog-html', blogController.addBlog);

module.exports = router;
