import AutoSearchInput from 'components/UI/AutoSearchInput';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import GrammarListBoxData from './ListBox/data';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Editor from "components/UI/Editor";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import useStyle from './style';
import blogApi from 'apis/blogApi';
import { useDispatch, useSelector } from 'react-redux';
import { setMessage } from 'redux/slices/message.slice';
import ModalAddBlogs from './../UI/ModalAddBlogs/ModalAddBlogs';

function Grammar({ list, loading, isAdmin }) {
  const classes = useStyle();
  const [blogList, setBlogList] = useState(list || []);
  const [isAddUser, setIsAddUser] = useState(false);
  const preSearchList = useRef(list || []);
  const dispatch = useDispatch();

  const onSearch = (keyword) => {
    if (keyword === '' && blogList.length !== preSearchList.current.length) {
      setBlogList([...preSearchList.current]);
    } else {
      const newList = preSearchList.current?.filter((blog) => {
        const str = `${blog.title} ${blog.desc}`.toLowerCase();
        return str.indexOf(keyword.toLowerCase()) !== -1;
      });
      setBlogList([...newList]);
    }
  };

  useEffect(() => {
    let isSub = true;

    if (list && list.length > 0 && isSub) {
      setBlogList([...list]);
      preSearchList.current = [...list];
    }

    return () => (isSub = false);
  }, [list]);

  const handleAddWord = () => {
    setIsAddUser(!isAddUser);
  };

  const handleClose = () => {
    // setOpen(false);
    setIsAddUser(false);
    // setIsUpdate(false);
  };

  const handleAddBlogs = async data => {
    // try {
    //   const { title, desc, html } = data;
    //   console.log('handleAddBlogs', title, desc, html)
    //   const apiRes = await blogApi.addBlog({ title, desc, html });
    //   console.log('apiRes', apiRes);
    //   // if (apiRes.status === 200 && isSub) {
    //   //   const { blogList = [] } = apiRes.data;
    //   //   setLoading(false);
    //   //   setList(blogList);
    //   // }
    // } catch (error) {
    //   const message =
    //     error?.response?.data?.message || 'Lấy tài liệu thất bại, thử lại !';
    //   dispatch(setMessage({ message, type: 'error' }));
    // }
  };

  return (
    <div className={classes.wrapper}>
      <div className="container">
        <div className={classes.root}>
          <div className='d-flex jus-content-between align-i-center'>
            <h1 className="dyno-title">Học ngữ pháp cùng Dyno</h1>
            {
              isAdmin && (
                <Button
                  // className={`${classes.btn} ${classes.btnReset}`}
                  color="primary"
                  endIcon={<AddIcon />}
                  variant="contained"
                  // disabled={submitting}
                  onClick={handleAddWord}
                >
                  Tạo blogs
                </Button>
              )
            }

          </div>
          {/* <Editor /> */}
          <div className="dyno-break"></div>

          <AutoSearchInput
            disabled={loading}
            placeholder="Nhập từ khoá ..."
            onSearch={onSearch}
          />

          {loading ? (
            Array(5)
              .fill(0)
              .map((item, index) => (
                <div className={classes.listBox} key={index}>
                  <GrammarListBoxData number={index + 1} loading={true} />
                </div>
              ))
          ) : blogList.length > 0 ? (
            blogList.map((item, index) => (
              <div className={classes.listBox} key={index}>
                <GrammarListBoxData
                  number={index + 1}
                  loading={false}
                  {...item}
                />
              </div>
            ))
          ) : (
            <h3
              className="t-center"
              style={{ fontSize: '1.8rem', color: 'var(--label-color)' }}>
              Không tìm thấy bài viết nào cả 😢
            </h3>
          )}
        </div>
        {isAddUser && <ModalAddBlogs
          open={isAddUser}
          onClose={() => handleClose()}
          onRegister={handleAddBlogs}
        />
        }
      </div>
    </div>
  );
}

Grammar.propTypes = {
  list: PropTypes.array,
  loading: PropTypes.bool,
  isAdmin: PropTypes.bool,
};

Grammar.defaultProps = {
  list: [],
  loading: true,
};

export default Grammar;
