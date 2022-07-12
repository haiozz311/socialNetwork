/* eslint-disable no-const-assign */
import React, { useEffect, useState, useRef } from 'react';

import Table from '../components/DashBoard/table/Table';
import { Link } from 'react-router-dom';
import SettingsIcon from '@material-ui/icons/Settings';
import GlobalLoading from 'components/UI/GlobalLoading';
import ModalWord from 'components/UI/ModalWord/ModalWord';
import commonApi from 'apis/commonApi';
import Button from '@material-ui/core/Button';
import wordApi from 'apis/wordApi';
import Avatar from '@material-ui/core/Avatar';
import AddIcon from '@material-ui/icons/Add';
import ModalUpdateWord from 'components/UI/ModalUpdateWord.js/ModalUpdateWord';
import ModalAddWord from 'components/UI/ModalAddWord/ModalAddWord';
import { WORD_SPECIALTY } from 'constant';
import { useDispatch, useSelector } from 'react-redux';
import { setMessage } from 'redux/slices/message.slice';
import ConfirmBox from "react-dialog-confirm";
import WordSortModal from 'components/UI/WordSortModal';
import AutoSearchInput from 'components/UI/AutoSearchInput';
import '../../node_modules/react-dialog-confirm/build/index.css';
import WordPack from 'components/UI/WordPack';
import { equalArray } from 'helper';
import ModalWordRequest from 'components/UI/ModalWordRequest/ModalWordRequest';

const perPage = 2795;
const ConfirmWord = () => {
  const [user, setUser] = useState([]);
  const [item, setItem] = useState([]);
  console.log('item', item);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [list, setList] = useState([]);
  console.log('list', list);
  const [isOpen, setIsOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [openWordPack, setOpenWordPack] = useState(false);
  const handleCloseModal = () => { setIsOpen(!isOpen) };
  const handleConfirm = async () => {
    try {
      let _id = item._id;
      await wordApi.deleteWordRequest(_id);
      setIsOpen(false);
      dispatch(
        setMessage({ message: 'Xóa từ vựng thành công', type: 'success' }),
      );
      setOpen(false);
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } catch (err) {
      dispatch(setMessage({ message: 'Xóa từ vựng thất bại', type: 'error' }));
    }
  };
  const handleCancel = () => { setIsOpen(!isOpen) };
  const [open, setOpen] = useState(false);
  const { refresh_token } = useSelector((state) => state.token);

  const [isAddUser, setIsAddUser] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [sortType, setSortType] = useState('rand');
  const [submitting, setSubmitting] = useState(false);

  const settingWordPack = (info) => {
    // check old pack vs new pack
    let isEqual = true;
    for (let k in packInfo) {
      if (k !== 'topics' && packInfo[k] !== info[k]) {
        isEqual = false;
        break;
      }
    }
    if (isEqual) isEqual = equalArray(packInfo.topics, info.topics);

    totalPage.current = 0;
    preSearchList.current = [];
    // setMore(true);
    setList([]);
    setPackInfo(info);
    setPage(1);
  };

  const onSelect = (v) => {
    settingWordPack(v);
    setOpenWordPack(false);
  };

  const dispatch = useDispatch();

  const [packInfo, setPackInfo] = useState(() => ({
    type: '-1',
    level: '-1',
    specialty: '-1',
    topics: [],
  }));
  const onSortTypeChange = (type = 'rand') => {
    if (type === sortType) return;
    preSearchList.current = [];
    setSortType(type);
    setPage(1);
    setList([]);
  };
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
      } catch (error) { }
    })();

    return () => (isSub = false);
  }, [packInfo, refresh]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      let _id = item._id;
      const apiRes = await wordApi.postConfirmWord(_id);
      if (apiRes.state === 200) {
        dispatch(
          setMessage({ message: apiRes.data.message, type: 'success' }),
        );
      }
      setOpen(false);
      setLoading(false);
      setTimeout(() => {
        window.location.reload();
      }, 0);
    } catch (error) {
    }
  };

  // get word pack
  useEffect(() => {
    let isSub = true;

    (async function () {
      try {
        setLoading(true);
        const apiRes = await wordApi.getTotalWordRequest();
        console.log('apiRes?.data?.words', apiRes?.data?.words)
        if (apiRes.status === 200 && isSub) {
          setList(apiRes?.data?.words);
        }
      } catch (error) {
      } finally {
        if (isSub) {
          setLoading(false);
        }
      }
    })();

    return () => (isSub = false);
  }, [page, packInfo, sortType, refresh]);

  useEffect(() => {
    setList(list);
  }, [list]);

  const customerTableHead = [
    '',
    'Người đóng góp',
    'avatar',
    'Từ vựng',
    'Phiên âm',
    'Hình ảnh',
    'Nghĩa của từ',
    'Chuyên ngành'
  ];

  const handleClose = () => {
    setOpen(false);
    setIsAddUser(false);
    setIsUpdate(false);
  };

  const handleUpdateWord = async (data) => {
    const { mean,
      type,
      level,
      specialty,
      note,
      topics,
      picture,
      examples,
      synonyms,
      antonyms,
      word,
      phonetic } = data;
    const _id = item._id;
    try {
      await wordApi.updateWordByAdmin(
        mean,
        type,
        level,
        specialty,
        note,
        topics,
        picture,
        examples,
        synonyms,
        antonyms,
        word,
        phonetic,
        refresh_token,
        _id
      );
      setOpen(false);
      setIsUpdate(false);
      // setRefresh(!refresh);
      dispatch(
        setMessage({ message: 'Cập nhật tự vựng thành công', type: 'success' }),
      );
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } catch (err) {
      dispatch(setMessage({ message: 'Cập nhật từ vựng thất bại', type: 'error' }));
    }
  };

  const handleRemoveItem = async () => {
    setIsOpen(true);
    setOpen(false);
  };

  const renderHead = (item, index) => <th key={index}>{item}</th>;

  const renderBody = (item, index) => (
    <tr key={index} onClick={() => {
      setOpen(true);
      setItem(item);
    }}>
      <td>{index + 1}</td>
      <td>{item?.user?.name}</td>
      <td><Avatar src={item?.user?.avatar} /></td>
      <td>{item.word}</td>
      <td>{item.phonetic}</td>
      <td>{item.picture ? <Avatar src={item.picture} /> : ''}</td>
      <td>{item.mean.length < 20 ? item.mean : item.mean.slice(0, 20) + '...'}</td>
      <td>{WORD_SPECIALTY.find((i) => i.value === item.specialty)?.label ||
        'Chưa Xác Định'}</td>
    </tr>
  );
  const onSearchWord = async (word) => {
    try {
      if (word === '') {
        setList(preSearchList.current);
        return;
      }

      const apiRes = await wordApi.getSearchWord(word);
      if (apiRes.status === 200) {
        const { packList = [] } = apiRes.data;
        setList(packList);
      }
    } catch (error) { }
  };
  return (
    <div>
      {
        loading ? <GlobalLoading title="Đang hiển thị dữ liệu..." /> : <>
          <div className='d-flex jus-content-between align-i-center'>
            <h2 className="page-header">
              Xác nhận từ vựng đóng góp
            </h2>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card__body">
                  <WordSortModal
                    onSelect={onSortTypeChange}
                    classNameIcon="dyno-setting-icon mr-5"
                  />
                  <SettingsIcon
                    // className={classNameIcon}
                    onClick={() => setOpenWordPack(true)}
                  />
                  {/* setting modal */}
                  {openWordPack && (
                    <WordPack
                      open={openWordPack}
                      onCancel={() => setOpenWordPack(false)}
                      onChoose={onSelect}
                    />
                  )}
                  <AutoSearchInput disabled={loading} onSearch={onSearchWord} />
                  <Table
                    limit='100'
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
      {open && <ModalWordRequest
        open={open}
        item={item}
        onClose={() => handleClose()}
        onRemove={() => handleRemoveItem()}
        onUpdate={() => handleUpdate()}
        renderHead={renderHead}
      />
      }
      <ConfirmBox // all props are required
        options={{
          icon: "https://img.icons8.com/clouds/100/000000/vector.png",
          text: 'Bạn có chắc chắn muốn xóa từ này không !', // alert text
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

export default ConfirmWord;
