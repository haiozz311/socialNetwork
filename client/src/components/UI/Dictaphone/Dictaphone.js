// /* eslint-disable react/no-unescaped-entities */
// import React, { useState } from 'react';
// import { Redirect } from 'react-router-dom';
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

// const Dictaphone = () => {

//   const [redirectUrl, setRedirectUrl] = useState('');
//   console.log('redirectUrl', redirectUrl);

//   const commands = [
//     {
//       commands: ['hello'],
//       callback: (RedirectPage) => {
//         console.log('say hello');
//       },
//     }
//   ];

//   const {
//     transcript,
//     listening,
//     resetTranscript,
//     browserSupportsSpeechRecognition
//   } = useSpeechRecognition({ commands });

//   const Pages = ['home', 'social'];
//   const urls = {
//     home: '/',
//     social: '/social',
//   };

//   if (!browserSupportsSpeechRecognition) {
//     return <span>Browser doesn't support speech recognition.</span>;
//   }

//   let redirect = "";
//   if (redirectUrl) {
//     if (Pages.includes(redirectUrl)) {
//       redirect = <Redirect to={urls[redirectUrl]} />
//     } else {
//       redirect = <p>Không tìm thấy page {redirectUrl}</p>
//     }
//   }

//   return (
//     <div>
//       <p>Microphone: {listening ? 'on' : 'off'}</p>
//       <button onClick={SpeechRecognition.startListening}>Start</button>
//       <button onClick={SpeechRecognition.stopListening}>Stop</button>
//       <button onClick={resetTranscript}>Reset</button>
//       <p>{transcript}</p>
//     </div>
//   );
// };
// export default Dictaphone;
import React, { useState, useEffect } from 'react';
import SpeechRecognition from 'react-speech-recognition';

// const SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
// const recognition = new SpeechRecognition();

// recognition.continous = true;
// recognition.interimResults = true;
// recognition.lang = 'en-US' ;
// nếu bạn nhập ở đây là vn-VN để chuyển qua thành tiếng việt
// thì không chính xác đâu nhé,
// lúc viết bài này, mình có tra qua bảng những ngôn ngữ hỗ trợ thì
// không thấy tiếng Việt nó có ghi trên đó
// nhưng apply vào dự án thì cũng không cần nhập dữ liệu vào
// biến này thì nó vẫn nhận dạng được
// tiếng việt và tiếng Anh (yaoming) (thatvidieu)

//------------------------COMPONENT-----------------------------

const Dictaphone = ({ transcript, startListening, stopListening }) => {
  const [content, setContent] = useState(null);

  useEffect(() => {
      setContent(transcript);
  }, [transcript])

  return (
    <div className='container'>
      <button className='button' onClick={() => startListening()}>
          Start
      </button>
      <button className='button' onClick={() => stopListening()}>
          Stop
      </button>
      <div className='content'>
          {this.state.content}
      </div>
    </div>
  )
}

SearchVoice.propTypes = {
  // Props injected by SpeechRecognition
  transcript: PropTypes.string,
  resetTranscript: PropTypes.func,
  browserSupportsSpeechRecognition: PropTypes.bool,
  startListening: PropTypes.func,
  abortListening: PropTypes.func,
  recognition: PropTypes.object,
};

const options = {
  autoStart: false
}

export default (Dictaphone)
