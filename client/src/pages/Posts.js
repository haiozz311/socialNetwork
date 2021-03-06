/* eslint-disable no-console */
/* eslint-disable react/jsx-key */
/* eslint-disable no-const-assign */
import React, { useEffect, useState, useRef } from 'react';
import Button from '@material-ui/core/Button';
import Table from '../components/DashBoard/table/Table';
import GlobalLoading from 'components/UI/GlobalLoading';
import ModalComment from 'components/UI/ModalComment';
import postApi from 'apis/postApi';
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import ModalUpdatePost from 'components/UI/ModalUpdatePost.js/ModalUpdatePost';
import { updatePost } from 'redux/slices/status.slice';
import { setPosts } from 'redux/slices/post.slice';
import { useSelector, useDispatch } from 'react-redux';
import { setMessage } from 'redux/slices/message.slice';
import ConfirmBox from "react-dialog-confirm";
import { deletePostbyAdmin } from 'redux/slices/post.slice';
import '../../node_modules/react-dialog-confirm/build/index.css';
import ModalCommentList from 'components/UI/ModalCommentList/ModalCommentList';
import { deleteComment } from 'redux/slices/post.slice';


const perPage = 622;
const Posts = () => {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [item, setItem] = useState([]);
  console.log('item', item);
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [isComment, setIsComment] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [topicList, setTopicList] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const handleCloseModal = () => { setIsOpen(!isOpen) };
  const { refresh_token } = useSelector((state) => state.token);
  const { socket } = useSelector((state) => state.socket);

  const handleCancel = () => { setIsOpen(!isOpen) };
  const dispatch = useDispatch();

  const handleConfirm = async () => {
    dispatch(deletePostbyAdmin({ idPostRemove: item?.user?._id, post: item, refresh_token, socket }));
    dispatch(
      setMessage({ type: 'success', message: 'X??a b??i vi???t th??nh c??ng' }),
    );
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };
  // get total sentence
  useEffect(() => {
    let isSub = true;
    (async function () {
      try {
        const apiRes = await postApi.getAllPost();
        if (apiRes.status === 200 && isSub) {
          const { posts = [] } = apiRes.data;
          setList(posts);
        }
      } catch (error) { }
      finally {
        if (isSub) {
          setLoading(false);
        }
      }
    })();

    return () => (isSub = false);
  }, [topicList]);

  const customerTableHead = [
    '',
    'N???i dung',
    'h??nh ???nh',
    'Ng?????i th??ch b??i vi???t',
    'L?????t b??nh lu???n',
  ];

  const renderHead = (item, index) => <th key={index}>{item}</th>;

  const renderBody = (item, index) => (
    <tr key={index} onClick={() => {
      setOpen(true);
      setItem(item);
    }}>
      <td>{index + 1}</td>
      <td>{item.content}</td>
      <td className='d-flex'>
        {
          item.images.map(item =>
            <Avatar variant="square" className='mx-2'>
              <img style={{ width: '50px', marginRight: '10px' }} src={`https://res.cloudinary.com/dsvko7lfg/image/upload/${item.public_id}`} />
            </Avatar>)
        }
      </td>
      <td>
        <AvatarGroup total={24}>
          {item.likes && item.likes.map(item => (
            <Avatar alt="Remy Sharp" src={item?.avatar} />
          ))}
        </AvatarGroup>
      </td>
      <td>
        <AvatarGroup total={24}>
          {item.comments && item.comments.map(item => (
            <Avatar alt="Remy Sharp" src={item?.user?.avatar} />
          ))}
        </AvatarGroup>
      </td>
    </tr>
  );
  const handleClose = () => {
    setOpen(false);
    setIsUpdate(false);
  };
  const handleUpdate = () => {
    setIsUpdate(true);
    setOpen(false);
  };

  const handleRemoveItem = async () => {
    setIsOpen(true);
    setOpen(false);
  };

  const handleUpdatePost = async (data) => {
    console.log('handleUpdatePost', data);
    try {
      const { content, images, refresh_token, statusPost } = data;
      await dispatch(updatePost({ content, images, refresh_token, statusPost }));
      const res = await postApi.getPost(refresh_token);
      if (res) {
        dispatch(setPosts(res?.data?.posts));
      }
      dispatch(
        setMessage({ type: 'success', message: 'C???p nh???t b??i ????ng th??nh C??ng' }),
      );
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleOpenCommentModal = () => {
    setOpen(false);
    setIsComment(true);
  };

  const handleCloseComment = () => {
    setIsComment(false);
  };
  const handleRemove = data => {
    dispatch(deleteComment({ post: item, comment: data, refresh_token, socket }));
  };
  return (
    <div>
      {
        loading ? <GlobalLoading title="??ang hi???n th??? d??? li???u..." /> : <>
          <h2 className="page-header">
            B??i vi???t
          </h2>
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card__body">
                  <Table
                    limit='150'
                    headData={customerTableHead}
                    renderHead={(item, index) => renderHead(item, index)}
                    bodyData={list}
                    renderBody={(item, index) => renderBody(item, index)}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      }
      {open && <ModalComment
        open={open}
        item={item}
        onClose={() => handleClose()}
        onRemove={() => handleRemoveItem()}
        onUpdate={() => handleUpdate()}
        renderHead={renderHead}
        onOpenModalComment={handleOpenCommentModal}
      />}
      {
        isUpdate && <ModalUpdatePost
          item={item}
          open={isUpdate}
          onClose={() => handleClose()}
          onRegister={handleUpdatePost}
          loading={loading}
        />
      }
      {
        isComment && <ModalCommentList
          open={isComment}
          item={item?.comments}
          onClose={() => handleCloseComment()}
          onRemove={handleRemove}
          onUpdate={() => handleUpdate()}
          renderHead={renderHead} />
      }
      <ConfirmBox // all props are required
        options={{
          icon: "https://img.icons8.com/clouds/100/000000/vector.png",
          text: 'B???n c?? ch???c ch???n mu???n x??a b??i vi???t n??y kh??ng !', // alert text
          confirm: 'yes', // button text for cancel btn
          cancel: 'no', // button text for cancel btn
          btn: true // with or without buttons
        }}
        isOpen={isOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default Posts;
