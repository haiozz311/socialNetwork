import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import MsgDisplay from './MsgDisplay';
import smartphone from 'assets/icons/message/smartphone.png';
import videoRecorder from 'assets/icons/message/video-recorder.png';
import remove from 'assets/icons/message/remove.png';
import sendmessage from 'assets/icons/message/send-message.png';
import upload from 'assets/icons/message/upload.png';
import animal from 'assets/icons/message/animal.png';
import { imageUpload } from 'helper/imageUpload';
import { addMessage, getMessages, deleteConversation } from 'redux/slices/messenger';
import { setCall } from 'redux/slices/call.slice';



const RightSide = () => {
  const [media, setMedia] = useState([]);
  const [user, setUser] = useState([]);
  const [text, setText] = useState('');
  const [data, setData] = useState([]);
  const history = useHistory();
  const [isLoadMore, setIsLoadMore] = useState(0);
  const [loadMedia, setLoadMedia] = useState(false);
  const [result, setResult] = useState(9);
  const [page, setPage] = useState(0);
  const refDisplay = useRef();
  const pageEnd = useRef();
  const messagesEndRef = useRef(null);
  const userInfor = useSelector((state) => state.userInfo);
  const { socket } = useSelector((state) => state.socket);
  const { peer } = useSelector((state) => state.peer);
  const { refresh_token } = useSelector((state) => state.token);
  const message = useSelector((state) => state.messenger);
  const dispatch = useDispatch();
  const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
  useEffect(() => {
    const newUser = message.users.find(user => user._id === id);
    if (newUser) {
      setUser(newUser);
      setResult(newUser.result);
      setPage(newUser.page);
    }
  }, [message.users, id]);

  useEffect(() => {
    const newData = message.data.filter(item => item.sender === userInfor._id || item.sender === id);
    setData(newData);
  }, [message.data, userInfor._id, id]);

  const handleChangeMedia = (e) => {
    const files = [...e.target.files];
    let err = '';
    let newMedia = [];

    files.forEach(file => {
      if (!file) return err = 'File does not exist.';

      if (file.size > 1024 * 1024 * 5) {
        return err = 'The image/video largest is 5mb.';
      }

      return newMedia.push(file);
    });

    // if (err) dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err } });
    setMedia([...media, ...newMedia]);
  };

  const handleDeleteMedia = (index) => {
    const newArr = [...media];
    newArr.splice(index, 1);
    setMedia(newArr);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && media.length === 0) return;
    setText('');
    setMedia([]);
    setLoadMedia(true);

    let newArr = [];
    if (media.length > 0) newArr = await imageUpload(media);

    const msg = {
      sender: userInfor._id,
      recipient: id,
      text,
      media: newArr,
      createdAt: new Date().toISOString()
    };
    setLoadMedia(false);
    await dispatch(addMessage({ msg, userInfor,refresh_token ,socket }));
    if (refDisplay.current) {
      refDisplay.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };


  useEffect(() => {
    if (refDisplay) {
      refDisplay?.current?.addEventListener('DOMNodeInserted', event => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
      });
    }
  }, [text]);

  useEffect(() => {
      const getMessagesData = async () => {
        if (message.data.every(item => item._id !== id)) {
          await dispatch(getMessages({ refresh_token, id }));
          setTimeout(() => {
            refDisplay?.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
          }, 50);
        }
      };
      getMessagesData();
  }, [id]);

  useEffect(() => {
    setData(message.data);
  }, [message.data]);

  const handleDeleteConversation = () => {
    if (window.confirm('Do you want to delete?')) {
      dispatch(deleteConversation({ refresh_token, id }));
      return history.push('/message');
    }
  };

     // Call
  const caller = ({ video }) => {
    const newUser = message.users.find(user => user._id === id);
    const { _id, avatar, name } = newUser;

    const msg = {
      sender: userInfor._id,
      recipient: _id,
      avatar, name, video
    };
    dispatch(setCall(msg));
  };

  const callUser = ({ video }) => {
    const newUser = message.users.find(user => user._id === id);
    const { _id, avatar, name } = userInfor;
    const msg = {
      sender: _id,
      recipient: newUser._id,
      avatar, name, video
    };

    if (peer.open) msg.peerId = peer._id;
    socket.emit('callUser', msg);
  };

  const handleAudioCall = () => {
    caller({ video: false });
    callUser({ video: false });
  };

  const handleVideoCall = () => {
    caller({ video: true });
    callUser({ video: true });
  };

  return (
    <div className="message-detail">
      {
        id ? (
          <div className="inner">
      <div className="message-header">
        <div className="message-top">
          <div className="header-infor">
            <Avatar src={user.avatar} />
            <p className="name">{user?.name}</p>
          </div>
          <div className="icon">
            <img className="icon-image" onClick={handleVideoCall} src={videoRecorder} alt="" />
            <img style={{margin:'0 25px'}}  onClick={handleAudioCall} className="icon-image" src={smartphone} alt="" />
            <img onClick={handleDeleteConversation} className="icon-image" src={remove} alt="" />
          </div>
        </div>
        </div>
        <div className='cover-content' ref={refDisplay}>
        {
          data.map((msg, index) => (
            <div key={index}>
                {
                    msg.sender !== userInfor._id &&
                    <div className="message-user">
                        <MsgDisplay user={user} msg={msg} />
                    </div>
                }

                {
                    msg.sender === userInfor._id &&
                    <div className="my-message">
                        <MsgDisplay user={userInfor} msg={msg}/>
                    </div>
                }
            </div>
          ))
          }
        <button style={{marginTop: '-25px', opacity: 0}} ref={pageEnd}>
          Load more
          </button>
          <div style={{opacity: 0}} ref={messagesEndRef} />
          {
            loadMedia && <p>loading...</p>
          }
          <div className='show-media'>
          {
            media.map((item, index) => (
              <div key={index} className="file_media">
              {
                  item.type.match(/video/i)
                  ? <video controls src={URL.createObjectURL(item)} alt="images" className="img-thumbnail" />
                  :  <img src={URL.createObjectURL(item)} alt="images" className="img-thumbnail" />
              }
              <span onClick={() => handleDeleteMedia(index)} >&times;</span>
            </div>
            ))
          }
        </div>
        </div>
        <form className="chat_input"
            onSubmit={handleSubmit}
          >
            <input type="text" placeholder="Enter you message..."
                value={text} onChange={e => setText(e.target.value)} />
            <div className="file_upload" onChange={handleChangeMedia}>
              <label htmlFor="file">
                <img src={upload} alt='' />
              </label>
                <input style={{display:'none'}} type="file" name="file" id="file"
                multiple accept="image/*,video/*" />
            </div>
            <button type="submit" className="material-icons"
            disabled={(text || media.length > 0) ? false : true}>
                <img className="icon-image" src={sendmessage} alt="" />
            </button>
          </form>
      </div>
        ) : (
            <>
              <p className='mess'>Nhắn tin cho mọi người xung quanh</p>
              <img className='animal' src={animal} />
            </>
        )
      }
    </div>
  );
};

export default RightSide;
