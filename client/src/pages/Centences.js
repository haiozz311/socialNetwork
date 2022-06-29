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


const perPage = 622;
const Centences = () => {
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
      await sentenceApi.deleteSentence(item._id, refresh_token);
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
  // get total sentence
  useEffect(() => {
    let isSub = true;
    // const getTotal = async () => {
    //   const apiRes = await sentenceApi.getTotalSentences(topicList);
    //   console.log({ apiRes });
    //   if (apiRes.status === 200 && isSub) {
    //     const { total = 0 } = apiRes.data;
    //     totalPage.current = Math.ceil(total / perPage);
    //   }
    // }
    // getTotal();
    (async function () {
      try {
        const apiRes = await sentenceApi.getTotalSentences(topicList);
        if (apiRes.status === 200 && isSub) {
          const { total = 0 } = apiRes.data;
          totalPage.current = Math.ceil(total / 20);
        }
      } catch (error) { }
    })();

    return () => (isSub = false);
  }, [topicList]);

  // get sentence list
  useEffect(() => {
    let isSub = true;

    (async function () {
      try {
        setLoading(true);
        const apiRes = await sentenceApi.getSentenceList(
          page,
          perPage,
          topicList,
        );

        if (apiRes.status === 200 && isSub) {
          const { sentenceList = [] } = apiRes.data;
          setList([...list, ...sentenceList]);
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

  const handleUpdate = () => {
    setIsUpdate(true);
    setOpen(false);
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
              Câu
            </h2>
            <Button
              // className={`${classes.btn} ${classes.btnReset}`}
              color="primary"
              endIcon={<AddIcon />}
              variant="contained"
              // disabled={submitting}
              onClick={handleAddCentence}
            >
              Tạo câu
            </Button>
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
      {open && <ModalCentence
        open={open}
        item={item}
        onClose={() => handleClose()}
        onRemove={() => handleRemoveItem()}
        onUpdate={() => handleUpdate()}
        renderHead={renderHead}
      />
      }
      {
        isUpdate && <ModalUpdateCentence
          item={item}
          open={isUpdate}
          onClose={() => handleClose()}
          onRegister={handleConfirmUpdate}
          loading={loading}
        />
      }
      {isAddUser && <ModalAddCentence
        open={isAddUser}
        onClose={() => handleClose()}
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

export default Centences;
