import sentenceApi from 'apis/sentenceApi';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMessage } from 'redux/slices/message.slice';
import SentenceContribution from './index';

function SentenceContributionData() {
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();
  const { _id } = useSelector((state) => state.userInfo);
  const { refresh_token } = useSelector((state) => state.token);
  const handleSubmit = async (formData) => {
    const { sentence, mean, note, topics } = formData;
    try {
      setSubmitting(true);

      const apiRes = await sentenceApi.postRequestSentence(
        sentence,
        mean,
        note,
        topics,
        _id,
        refresh_token
      );
      if (apiRes.status === 200) {
        dispatch(
          setMessage({
            type: 'success',
            message:
              'Thêm thành công, đang chờ xét duyệt. Cảm ơn sự đóng góp của bạn ❤',
            duration: 5000,
          }),
        );
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Thêm câu mới không thành công, thử lại';
      dispatch(
        setMessage({
          type: 'error',
          message,
        }),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SentenceContribution submitting={submitting} onSubmitForm={handleSubmit} />
  );
}

export default SentenceContributionData;
