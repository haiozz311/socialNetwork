import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './index.scss';
import telephone from 'assets/icons/message/telephone.png';
import phoneCall from 'assets/icons/message/phone-call.png';
import videoCall from 'assets/icons/message/video-call.png';
import { setCall } from 'redux/slices/call.slice';
import { setMessage } from 'redux/slices/message.slice';
import { addMessage } from 'redux/slices/messenger';



const CallModal = () => {
  const { call } = useSelector(state => state.call);
  const { peer } = useSelector(state => state.peer);
  const { socket } = useSelector(state => state.socket);
  const userInfor = useSelector(state => state.userInfo);
  const { refresh_token } = useSelector(state => state.token);
  const [hours, setHours] = useState(0);
  const [mins, setMins] = useState(0);
  const [second, setSecond] = useState(0);
  const [total, setTotal] = useState(0);
  const [answer, setAnswer] = useState(false);
  const [tracks, setTracks] = useState(null)
  const [newCall, setNewCall] = useState(null)

  const youVideo = useRef()
  const otherVideo = useRef()


  const dispatch = useDispatch();


  // Set Time
  useEffect(() => {
    const setTime = () => {
      setTotal(t => t + 1);
      setTimeout(setTime, 1000);
    };
    setTime();

    return () => setTotal(0);
  }, []);

  useEffect(() => {
    setSecond(total % 60);
    setMins(parseInt(total / 60));
    setHours(parseInt(total / 3600));
  }, [total]);

  useEffect(() => {
    if (answer) {
      setTotal(0);
    } else {
      const timer = setTimeout(() => {
        dispatch(setCall([]));
      }, 15000);

      return () => clearTimeout(timer);
    };
  }, [dispatch, answer]);

  const addCallMessage = useCallback((call, times, disconnect) => {
    if (call.recipient !== userInfor._id || disconnect) {
      const msg = {
        sender: call.sender,
        recipient: call.recipient,
        text: '',
        media: [],
        call: { video: call.video, times },
        createdAt: new Date().toISOString()
      };
      console.log('msg', msg);
      dispatch(addMessage({ msg, userInfor, refresh_token, socket }));
    }
  }, [userInfor, dispatch, socket]);

  const handleEndCall = () => {
    // if(newCall) newCall.close()
    let times = answer ? total : 0;
    socket.emit('endCall', { ...call, times });
    addCallMessage(call, times)
    dispatch(setCall([]));
  };

  // Stream Media
  const openStream = (video) => {
    const config = { audio: true, video };
    console.log('config', config);
    return navigator.mediaDevices.getUserMedia(config);
  };

  const playStream = (tag, stream) => {
    let video = tag;
    video.srcObject = stream;
    video.play()
  };

  // Answer Call
  const handleAnswer = () => {
    console.log('call video', call.video);
    openStream(call.video).then(stream => {
      playStream(youVideo.current, stream);
      console.log('youVideo.current', youVideo.current);
      console.log('stream', stream);
      const track = stream.getTracks()
      setTracks(track)

      const newCall = peer.call(call.peerId, stream);
      newCall.on('stream', function (remoteStream) {
        playStream(otherVideo.current, remoteStream)
      });
      setAnswer(true);
      // setNewCall(newCall);
    });
    // openStream(call.video).then(stream => {
    //   const newCall = peer.call(call.peerId, stream);
    //   setAnswer(true);
    //   setNewCall(newCall);
    // });
    // setAnswer(true);
  };

  useEffect(() => {
    socket.on('endCallToClient', data => {
      // tracks && tracks.forEach(track => track.stop())
      // if(newCall) newCall.close()
      addCallMessage(data, data.times);
      console.log('endCallToClient', data);
      dispatch(setCall([]));
    });

    return () => socket.off('endCallToClient');
  }, [socket, dispatch]);

  //     // Disconnect
  // useEffect(() => {
  //   socket.on('callerDisconnect', () => {
  //     // tracks && tracks.forEach(track => track.stop());
  //     if (newCall) newCall.close();
  //     let times = answer ? total : 0;
  //     // addCallMessage(call, times, true);
  //     dispatch(setCall([]));
  //     dispatch(setMessage({ type: 'error', message: `${call.name} disconnect` }));
  //   });

  //   return () => socket.off('callerDisconnect')
  // }, [socket, tracks, dispatch, call, , answer, total, newCall]);

  // End Call
  // const addCallMessage = useCallback((call, times, disconnect) => {
  //   if (call.recipient !== userInfor._id || disconnect) {
  //     const msg = {
  //       sender: call.sender,
  //       recipient: call.recipient,
  //       text: '',
  //       media: [],
  //       call: { video: call.video, times },
  //       createdAt: new Date().toISOString()
  //     }
  //     dispatch(addMessage({ msg, userInfor, refresh_token, socket }));
  //   }
  // }, [userInfor,refresh_token, dispatch, socket]);

  useEffect(() => {
    peer.on('call', newCall => {
      openStream(call.video).then(stream => {
        if (youVideo.current) {
          playStream(youVideo.current, stream)
        }
        const track = stream.getTracks()
        setTracks(track)

        newCall.answer(stream)
        newCall.on('stream', function (remoteStream) {
          if (otherVideo.current) {
            playStream(otherVideo.current, remoteStream)
          }
        });
        setAnswer(true)
        setNewCall(newCall)
      })
    })
    return () => peer.removeListener('call');
  }, [peer, call.video]);

  return (
    <div className='call_modal'>
      <div className='call_box'>
        <div>
          <div className='cover-image'>
            <img className='img-avatar' src={call.avatar} />
          </div>
          <p className='name'>{call.name}</p>

          {
            call.video
              ? <span>calling video...</span>
              : <span>calling audio...</span>
          }

          {
            answer
              ? <div>
                <span>{mins.toString().length < 2 ? '0' + mins : mins}</span>
                <span>:</span>
                <span>{second.toString().length < 2 ? '0' + second : second}</span>
              </div>
              : <div>
                {
                  call.video
                    ? <span>calling video...</span>
                    : <span>calling audio...</span>
                }
              </div>
          }
        </div>
        {
          !answer &&
          <div className="timer">
            <small>{mins.toString().length < 2 ? '0' + mins : mins}</small>
            <small>:</small>
            <small>{second.toString().length < 2 ? '0' + second : second}</small>
          </div>
        }

        <div className="call_menu">
          <img onClick={handleEndCall} className='turn_off' src={phoneCall} />
          {
            (call.recipient === userInfor._id && !answer) &&
            <>
              {
                call.video
                  ? <img onClick={handleAnswer} src={videoCall} />
                  : <img onClick={handleAnswer} src={telephone} />
              }
            </>
          }
        </div>
      </div>
      <div className="show_video" style={{
        opacity: (answer && call.video) ? '1' : '0',
      }} >

        <video ref={youVideo} className="you_video" playsInline muted />
        <video ref={otherVideo} className="other_video" playsInline />

        <div className="time_video">
          <span>{hours.toString().length < 2 ? '0' + hours : hours}</span>
          <span>:</span>
          <span>{mins.toString().length < 2 ? '0' + mins : mins}</span>
          <span>:</span>
          <span>{second.toString().length < 2 ? '0' + second : second}</span>
        </div>

        <button className="material-icons text-danger end_call"
          onClick={handleEndCall}>
          call_end
        </button>

      </div>
    </div>
  )
}

export default CallModal
