/* eslint-disable no-const-assign */
import React, { useEffect, useState, useRef } from 'react';

import Table from '../components/DashBoard/table/Table';
import { Link } from 'react-router-dom';
import GlobalLoading from 'components/UI/GlobalLoading';
import ModalWord from 'components/UI/ModalWord/ModalWord';
import commonApi from 'apis/commonApi';
import Button from '@material-ui/core/Button';
import wordApi from 'apis/wordApi';
import Avatar from '@material-ui/core/Avatar';
import AddIcon from '@material-ui/icons/Add';


const perPage = 2795;
const Words = () => {
  const [user, setUser] = useState([]);
  const [item, setItem] = useState([]);

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [isAddUser, setIsAddUser] = useState(false);
  const [sortType, setSortType] = useState('rand');
  const [packInfo, setPackInfo] = useState(() => ({
    type: '-1',
    level: '-1',
    specialty: '-1',
    topics: [],
  }));
  const totalPage = useRef(0);
  const preSearchList = useRef([]);

  // get total word pack
  useEffect(() => {
    let isSub = true;

    (async function () {
      try {
        const apiRes = await commonApi.getWordPackTotal(packInfo);
        if (apiRes.status === 200 && isSub) {
          const { total = 0 } = apiRes.data;
          totalPage.current = Math.ceil(total / 20);
        }
      } catch (error) {}
    })();

    return () => (isSub = false);
  }, [packInfo]);

  // get word pack
  useEffect(() => {
    let isSub = true;

    (async function () {
      try {
        setLoading(true);
        const apiRes = await wordApi.getWordList(
          page,
          perPage,
          packInfo,
          sortType,
        );
        if (apiRes.status === 200 && isSub) {
          const { packList = [] } = apiRes.data;
          const newList = [...list, ...packList];
          preSearchList.current = newList;
          setList(newList);
        }
      } catch (error) {
      } finally {
        if (isSub) {
          setLoading(false);
        }
      }
    })();

    return () => (isSub = false);
  }, [page, packInfo, sortType]);
  const customerTableHead = [
    '',
    'word',
    'phonetic',
    'type',
    'picture',
    'mean',
  ];

   const handleClose = () => {
    setOpen(false);
    setIsAddUser(false);
    setIsUpdate(false);
  };

const renderHead = (item, index) => <th key={index}>{item}</th>;

const renderBody = (item, index) => (
    <tr key={index} onClick={() => {
    setOpen(true);
    setItem(item);
    }}>
        <td>{index+1}</td>
        <td>{item.word}</td>
        <td>{item.phonetic}</td>
        <td>{item.type ? item.type : '?'}</td>
        <td>{item.picture ? <Avatar src={item.picture} /> : ''}</td>
        <td>{item.mean}</td>
    </tr>
);
    return (
      <div>
        {
          loading ? <GlobalLoading title="Đang hiển thị dữ liệu..." /> : <>
                      <div className='d-flex jus-content-between align-i-center'>
              <h2 className="page-header">
                Word
              </h2>
              <Button
                // className={`${classes.btn} ${classes.btnReset}`}
                color="primary"
                endIcon={<AddIcon />}
                variant="contained"
                // disabled={submitting}
                // onClick={handleAddUser}
              >
                Tạo từ vựng
              </Button>
            </div>
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
        {open && <ModalWord open={open} item={item}
          onClose={() => handleClose()}
          // onRemove={() => handleRemoveItem()}
          // onUpdate={() => handleUpdate()}
          // isUpdate={isUpdate}
          // handleConfirmUpdate={handleConfirmUpdate}
          renderHead={renderHead}
          // token={refresh_token}
        />
        }
        </div>
    );
};

export default Words;
