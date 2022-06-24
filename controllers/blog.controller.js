const {
  getBlogListService,
  getBlogHtmlService,
} = require('../services/blog.service');
const BlogModel = require('../models/blog.model');


exports.getBlogList = async (req, res, next) => {
  try {
    const blogList = await getBlogListService();
    return res.status(200).json({ blogList });
  } catch (error) {
    console.error('GET BLOG LIST ERROR: ', error);
    return res.status(500).json({ message: 'Lỗi dịch vụ, thử lại sau' });
  }
};

exports.getBlogHtml = async (req, res, next) => {
  try {
    const { _id } = req.query;
    if (!Boolean(_id)) {
      return res.status(400).json({ message: 'id không hợp lệ' });
    }

    const blogHtml = await getBlogHtmlService(_id);
    return res.status(200).json({ blogHtml });
  } catch (error) {
    console.error(' ERROR: ', error);
    return res.status(500).json({ message: 'Lỗi dịch vụ, thử lại sau' });
  }
};

exports.addBlog = async (req, res, next) => {
  try {
    const { title, desc, html } = req.body;
    const newBlog = new BlogModel({
      title, desc, html
    })
    console.log("newBlog", newBlog);
    await newBlog.save()

    res.json({
      msg: 'Created blogs!'
    })
  } catch (err) {
    return res.status(500).json({ msg: err.message })
  }
};