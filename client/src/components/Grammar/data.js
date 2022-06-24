import blogApi from 'apis/blogApi';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setMessage } from 'redux/slices/message.slice';
import PropTypes from 'prop-types';
import Grammar from '.';

function GrammarData({ isAdmin }) {
  const dispatch = useDispatch();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isSub = true;

    (async function () {
      try {
        const apiRes = await blogApi.getBlogList();
        if (apiRes.status === 200 && isSub) {
          const { blogList = [] } = apiRes.data;
          setLoading(false);
          setList(blogList);
        }
      } catch (error) {
        const message =
          error.response?.data?.message || 'Lấy tài liệu thất bại, thử lại !';
        dispatch(setMessage({ message, type: 'error' }));
      }
    })();

    return () => {
      isSub = false;
    };
  }, []);

  return <Grammar loading={loading} list={list} isAdmin={isAdmin} />;
}

GrammarData.propTypes = {
  isAdmin: PropTypes.bool,
};

GrammarData.defaultProps = {
  isAdmin: false,
};

export default GrammarData;
