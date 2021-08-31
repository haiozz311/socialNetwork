import useScrollTop from 'hooks/useScrollTop';
import useTitle from 'hooks/useTitle';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import accountApi from 'apis/accountApi';
import { useDispatch } from 'react-redux';
import { setMessage } from 'redux/slices/message.slice';
import Button from '@material-ui/core/Button';
import img from 'assets/images/Logo5.gif'

function ActivationEmail() {
  useTitle('Kích hoạt tài khoản - Ứng dụng học tiếng Anh miễn phí');
  const dispatch = useDispatch();
  useScrollTop();
  const { activation_token } = useParams();
  useEffect(() => {
    if (activation_token) {
      const activationEmail = async () => {
        try {
          await accountApi.activeToken(activation_token);
          dispatch(
            setMessage({ message: 'Kích hoạt tài khoản thành công', type: 'success' }),
          );
        } catch (err) {
          dispatch(setMessage({ message: 'kích hoạt tài khoản thất bại', type: 'error' }));
        }
      }
      activationEmail()
    }
  }, [activation_token])

  return (
    <div className="container">
      {/* <Button className="_btn _btn-primary">
        Home
      </Button> */}
      <img src={img} />
    </div>
  );
}

export default ActivationEmail;


