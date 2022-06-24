import axiosClient from './axiosClient';

const URL = process.env.REACT_APP_API_LOCAL_BASE_URL;

const blogApi = {
  getBlogList: () => {
    return axiosClient.get(`${URL}/api/blog-list`);
  },

  getBlogHtml: (_id) => {
    return axiosClient.get(`${URL}/api/blog-html`, { params: { _id } });
  },

  addBlog: () => {
    return axiosClient.post(`${URL}/api/add-blog-html`);
  },
};

export default blogApi;
