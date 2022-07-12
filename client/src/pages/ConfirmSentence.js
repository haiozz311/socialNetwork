/* eslint-disable no-const-assign */
import React, { useEffect, useState, useRef } from 'react';
import Button from '@material-ui/core/Button';
import Table from '../components/DashBoard/table/Table';
import GlobalLoading from 'components/UI/GlobalLoading';
import sentenceApi from 'apis/sentenceApi';
import AddIcon from '@material-ui/icons/Add';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from '@material-ui/core/Avatar';
import ModalCentence from 'components/UI/ModalCentence/ModalCentence';
import ModalUpdateCentence from 'components/UI/ModalUpdateCentence.js/ModalUpdateCentence';
import ModalAddCentence from 'components/UI/ModalAddCentence/ModalAddCentence';
import { TOPICS } from 'constant/topics';
import { setMessage } from 'redux/slices/message.slice';
import ConfirmBox from "react-dialog-confirm";
import { equalArray } from 'helper';
import '../../node_modules/react-dialog-confirm/build/index.css';
import SentenceTopicSettingModal from 'components/CommunicationPhrase/SettingModal';
import Tag from 'components/UI/Tag';
import ModalCentenceRequest from 'components/UI/ModalCentenceRequest/ModalCentenceRequest';


const perPage = 622;
const ConfirmSentence = () => {
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [item, setItem] = useState([]);
  const [list, setList] = useState([]);
  const [topicList, setTopicList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const totalPage = useRef(0);
  const [isAddUser, setIsAddUser] = useState(false);
  const preSearchList = useRef([]);
  const dispatch = useDispatch();
  const { refresh_token } = useSelector((state) => state.token);
  const handleCloseModal = () => { setIsOpen(!isOpen) };
  const handleCancel = () => { setIsOpen(!isOpen) };
  const handleConfirm = async () => {
    try {
      let _id = item._id;

      await sentenceApi.deleteSentenceRequest(_id);
      setIsOpen(false);
      dispatch(
        setMessage({ message: 'Xóa câu thành công', type: 'success' }),
      );
      setOpen(false);
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } catch (err) {
      dispatch(setMessage({ message: 'Xóa câu thất bại', type: 'error' }));
    }
  };
  function sliceTopics(topics) {
    let res = [];
    topics.forEach((topic) => {
      res.push(TOPICS.find((i) => i.key === topic));
    });
    return res;
  }

  // get sentence list
  useEffect(() => {
    let isSub = true;

    (async function () {
      try {
        setLoading(true);
        const apiRes = await sentenceApi.getTotalSentencceRequest();
        console.log('apiRes', apiRes);
        if (apiRes.status === 200 && isSub) {
          const { sentenceList = [] } = apiRes.data;
          setList(apiRes.data.sentences);
        }
      } catch (error) {
      } finally {
        if (isSub) {
          setLoading(false);
        }
      }
    })();

    return () => (isSub = false);
  }, [page, topicList]);

  const customerTableHead = [
    '',
    'Người đóng góp',
    'avatar',
    'Câu',
    'Ý nghĩa',
    'Chú thích',
    'chủ đề'
  ];

  const renderHead = (item, index) => <th key={index}>{item}</th>;

  const renderBody = (item, index) => (
    <tr key={index} onClick={() => {
      setOpen(true);
      setItem(item);
    }}>
      <td>{index + 1}</td>
      <td>{item?.user?.name}</td>
      <td><Avatar src={item?.user?.avatar} /></td>
      <td>{item.sentence}</td>
      <td>{item.mean}</td>
      <td>{item.note}</td>
      <td>{item.topics && sliceTopics(item.topics).map((topic, index) => (
        <Tag key={index} title={topic.title} iconSrc={topic.icon} />
      ))}</td>
    </tr>
  );
  const handleClose = () => {
    setOpen(false);
    setIsAddUser(false);
    setIsUpdate(false);
  };
  const handleRemoveItem = async () => {
    setIsOpen(true);
    setOpen(false);
  };

  const handleAddCentence = () => {
    setIsAddUser(!isAddUser);
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      let _id = item._id;
      const apiRes = await sentenceApi.postConfirmSentence(_id)
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
  const handleConfirmUpdate = async data => {
    const { mean, sentence, note, topics } = data;
    const _id = item._id;
    try {
      await sentenceApi.updateSentenceByAdmin(mean, sentence, note, topics, refresh_token, _id);
      dispatch(
        setMessage({ message: 'Cập nhật câu thành công', type: 'success' }),
      );
      setOpen(false);
      setIsUpdate(false);
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } catch (err) {
      dispatch(setMessage({ message: 'Cập nhật câu thất bại', type: 'error' }));
    }
  };
  const onSelectTopic = (topics) => {
    if (!topics || !Array.isArray(topics) || equalArray(topics, topicList)) {
      return;
    }

    setPage(1);
    setList([]);
    setTopicList([...topics]);
    totalPage.current = 0;
  };
  return (
    <div>
      {
        loading ? <GlobalLoading title="Đang hiển thị dữ liệu..." /> : <>
          <div className='d-flex jus-content-between align-i-center'>
            <h2 className="page-header">
              Xác nhận câu đóng góp
            </h2>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card__body">
                  <div className='mb-2'>
                    <SentenceTopicSettingModal onSelectTopic={onSelectTopic} />
                  </div>
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
      {open && <ModalCentenceRequest
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
          text: 'Bạn có chắc chắn muốn xóa câu này không !', // alert text
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

export default ConfirmSentence;
