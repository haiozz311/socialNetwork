import React, { useEffect, useState } from 'react';

import Table from '../components/DashBoard/table/Table';
import { useSelector, useDispatch } from 'react-redux';
import GlobalLoading from 'components/UI/GlobalLoading';
import accountApi from 'apis/accountApi';
import ModalUser from 'components/UI/ModalUser/ModalUser';
import ModalAddUser from 'components/UI/AddUser/AddUser';
import Avatar from '@material-ui/core/Avatar';
import { setMessage } from 'redux/slices/message.slice';
import Button from '@material-ui/core/Button';
import { UX } from 'constant';
import AddIcon from '@material-ui/icons/Add';

const Customers = () => {
  const [user, setUser] = useState([]);
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isAddUser, setIsAddUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const { refresh_token } = useSelector((state) => state.token);
  const { _id } = useSelector((state) => state.userInfo);
  const dispatch = useDispatch();

  useEffect(() => {
    let isSub = true;
    (async function () {
      try {
        setLoading(true);
        const apiRes = await accountApi.getTotalUser();
        if (apiRes.status === 200 && isSub) {
          const { users } = apiRes.data;
          const dataFilter = users.filter(item => item._id !== _id);
          setUser(dataFilter);
        }
      } catch (error) { }
      finally {
        if (isSub) {
          setLoading(false);
        }
      }
    })();

    return () => (isSub = false);
  }, [refresh]);
  const customerTableHead = [
    '',
    'name',
    'email',
    'status',
    'coin',
    'role',
    'avatar',
];

  const handleRemoveItem = async () => {
    try {
      await accountApi.deleteUser(item._id, refresh_token);
      dispatch(
        setMessage({ message: 'Xóa người dùng thành công', type: 'success' }),
      );
      setRefresh(!refresh);
      setOpen(false);
    } catch (err) {
      dispatch(setMessage({ message: 'Xóa người dùng thất bại', type: 'error' }));
    }
  };

  const handleUpdate = () => {
    setIsUpdate(true);
  };

  const handleAddUser = () => {
    setIsAddUser(!isAddUser);
  };

  const handleConfirmUpdate = async data => {
    const { name, coin, role, id, token } = data;
    try {
      await accountApi.putUpdateProfileByAdmin(name, coin, role, token, id);
      dispatch(
        setMessage({ message: 'Cập nhật thông tin người dùng thành công', type: 'success' }),
      );
      setOpen(false);
      setIsUpdate(false);
      setRefresh(!refresh);
    } catch (err) {
      dispatch(setMessage({ message: 'Cập nhật thông tin người dùng thất bại', type: 'error' }));
    }
  };

  const handleClose = () => {
    setOpen(false);
    setIsAddUser(false);
    setIsUpdate(false);
  };

  const handleRegister = async (account) => {
    try {
      setLoading(true);
      const { email, password, name } = account;
      const apiRes = await accountApi.postRegisterAccount(
        email.toLowerCase(),
        name,
        password,
      );
      if (apiRes?.status === 200) {
        const { msg } = apiRes?.data;
        dispatch(setMessage({ message: msg, type: 'success' }));
        setTimeout(() => {
          setLoading(false);
        }, UX.DELAY_TIME);
        handleClose();
      }
    } catch (error) {
      const message =  'Register Success! Please active your email to start.';
      dispatch(setMessage({ message, type: 'success' }));
      setLoading(false);
      handleClose();
    }
  };

const renderHead = (item, index) => <th key={index}>{item}</th>;

const renderBody = (item, index) => (
  <tr key={index} onClick={() => {
    setOpen(true);
    setItem(item);
    }}>
        <td>{index+1}</td>
        <td>{item.name}</td>
        <td>{item.email}</td>
        <td>{item.authType === 'gg' ? 'Gmail' : item.authType === 'fb' ? 'Facebook': 'Local'}</td>
        <td>{item.coin}</td>
        <td>{item.role === 0 ? 'User' : 'Admin'}</td>
        <Avatar src={item.avatar} />
    </tr>
);
    return (
      <div>
        {
          loading ? <GlobalLoading title="Đang hiển thị dữ liệu..." /> : <>
            <div className='d-flex jus-content-between align-i-center'>
              <h2 className="page-header">
                customers
              </h2>
              <Button
                // className={`${classes.btn} ${classes.btnReset}`}
                color="primary"
                endIcon={<AddIcon />}
                variant="contained"
                // disabled={submitting}
                onClick={handleAddUser}>
                Tạo tài khoản
              </Button>
            </div>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card__body">
                            <Table
                                limit='10'
                                headData={customerTableHead}
                                renderHead={(item, index) => renderHead(item, index)}
                                bodyData={user}
                                renderBody={(item, index) => renderBody(item, index)}
                            />
                        </div>
                    </div>
                </div>
            </div>
          </>
        }
        {open && <ModalUser open={open} item={item}
          onClose={() => handleClose()}
          onRemove={() => handleRemoveItem()}
          onUpdate={() => handleUpdate()}
          isUpdate={isUpdate}
          handleConfirmUpdate={handleConfirmUpdate}
          renderHead={renderHead}
          renderBody={renderBody}
          customerTableHead={customerTableHead}
          token={refresh_token}
        />
        }
        {isAddUser && <ModalAddUser open={isAddUser}
          onClose={() => handleClose()}
          onRegister={handleRegister}
          loading={loading}
        />
        }
        </div>
    );
};

export default Customers;
