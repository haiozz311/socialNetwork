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

const perPage = 622;
const Posts = () => {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [item, setItem] = useState([]);
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [topicList, setTopicList] = useState([]);
  const totalPage = useRef(0);
  const preSearchList = useRef([]);

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
    'content',
    'images',
    'likes',
    'create at',
    'update at',
    'list comment',
];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const renderBody = (item, index) => (
    <tr key={index}>
        <td>{index+1}</td>
        <td>{item.content}</td>
        <td className='d-flex mb-2'>
          {
            item.images.map(item => <img style={{width: '50px', marginRight:'10px'}} src={`https://res.cloudinary.com/dsvko7lfg/image/upload/${item.public_id}`} />)
          }
        </td>
        <td className='mb-2'>
          {
            item.likes?.map(item => <img style={{width: '50px', marginRight:'10px'}} src={`${item.avatar}`} />)
          }
        </td>
        <td>{new Date(item.createdAt).toLocaleTimeString()}</td>
        <td>{new Date(item.updatedAt).toLocaleTimeString()}</td>
    <td><button onClick={() => {
      setOpen(true);
      setItem(item.comments);
        }} style={{padding: '10px 12px', background:'black', color:'white', borderRadius:'5px'}}>Comments</button></td>
    </tr>
);
    return (
      <div>
        {
          loading ? <GlobalLoading title="Đang hiển thị dữ liệu..." /> : <>
                      <h2 className="page-header">
                Posts
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
        {open && <ModalComment open={open} item={item} onClose={() => setOpen(false)} />}
        </div>
    );
};

export default Posts;
