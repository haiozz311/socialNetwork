import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import deleteIcon from 'assets/icons/message/delete.png';
import phoneErr from 'assets/icons/message/phone-call-err.png';
import { useSelector, useDispatch } from 'react-redux';
import { deleteMessages } from 'redux/slices/messenger';
import Times from './Times';
import ConfirmBox from "react-dialog-confirm";
import '../../../node_modules/react-dialog-confirm/build/index.css';


const MsgDisplay = ({ user, msg }) => {
  const { refresh_token } = useSelector((state) => state.token);
  const message = useSelector((state) => state.messenger);
  const [isOpen, setIsOpen] = useState(false);
  const handleCancel = () => { setIsOpen(!isOpen) };

  const dispatch = useDispatch();

  const handleDeleteMessages = () => {

  };
  const handleCloseModal = () => { setIsOpen(!isOpen) };
  const handleConfirm = async () => {
    if (!message.data) return;
    const data = message.data;
    dispatch(deleteMessages({ msg, data, refresh_token }));
  };
  return (
    <div className="display-message">
      <div className="cover-display">
        <Avatar src={user.avatar} />
        {(msg?.text || msg.media.length > 0) && <p className="content">
          <div className='cover-text-icon-delete'>
            <p className='title'>{msg.text}</p>
            <img className='icon-delete' src={deleteIcon} onClick={handleDeleteMessages} />
          </div>
          {
            msg.media.map((item, index) => (
              <div key={index} className='message-display-content'>
                {
                  item.url.match(/video/i)
                    ? <video controls src={src.url} alt="images" className="img-thumbnail" />
                    : <img src={item.url} alt="images" className="img-thumbnail" />
                }
              </div>
            ))
          }
        </p>}
        {
          msg.call &&
          <button className="btn d-flex align-items-center py-3"
            style={{ background: '#eee', borderRadius: '10px', padding: '10px', borderColor: 'transparent', margin: '0 5px' }}>

            {
              msg.call.times === 0 && (
                <img src={phoneErr} />
              )
            }

            <div className="text-left">
              <h6>{msg.call.video ? 'Video Call' : 'Audio Call'}</h6>
              <small>
                {
                  msg.call.times > 0
                    ? <Times total={msg.call.times} />
                    : new Date(msg.createdAt).toLocaleTimeString()
                }
              </small>
            </div>

          </button>
        }
      </div>
      <ConfirmBox // all props are required
        options={{
          icon: "https://img.icons8.com/clouds/100/000000/vector.png",
          text: 'Bạn có chắc chắn muốn xóa không !', // alert text
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

export default MsgDisplay;
