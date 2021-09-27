import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import { current } from '@reduxjs/toolkit';
import InputCustom from 'components/UI/InputCustom';
import UploadButton from 'components/UI/UploadButton';
import { DEFAULTS, MAX } from 'constant';
import { cloudinaryImgOptimize } from 'helper';
import PropTypes from 'prop-types';
import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMessage } from 'redux/slices/message.slice';
import useStyle from './style';
import { formatDate } from 'helper';
import ButtonFollow from 'components/UI/ButtonFollow';
import { formStyle } from 'components/UI/style';
import Followers from 'components/UI/Followers';
import Following from 'components/UI/Following';

function UserAccount({ onUpdateProfile, userData, id }) {
  const [data, setData] = useState({});
  let { name, avatar, coin, email, createdDate, createdAt, followers, following } = data;

  const dataUserInfor = useSelector((state) => state.userInfo);
  const avtSrc = Boolean(avatar)
    ? cloudinaryImgOptimize(avatar, 150, 150)
    : DEFAULTS.IMAGE_SRC;
  const classes = useStyle();
  const [editMode, setEditMode] = useState(false);
  const inputRef = useRef({ name });
  const [errors, setErrors] = useState({ name: false });
  const [idUser, setIdUser] = useState(id);
  const [flagAuth, setflagAuth] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const dispatch = useDispatch();

  const handleInputChange = (v, type = 0) => {
    if (type) {
      errors.name && v !== '' && setErrors({ ...errors, name: false });
      inputRef.current.name = v;
    }
  };

  useEffect(() => {
    userData.forEach(user => {
      setData(user);
    });
  }, [userData]);

  useEffect(() => {
    setIdUser(id);
  }, [id]);

  useEffect(() => {
    if (dataUserInfor._id === idUser) {
      setflagAuth(true);
    } else {
      setflagAuth(false);
    }
  }, [idUser, dataUserInfor._id]);

  const handleCloseEditMode = () => {
    inputRef.current = { name };
    setEditMode(false);
  };

  const handleUpdate = () => {
    const { name: currentName } = inputRef.current;
    if (currentName.trim() === name.trim()) {
      return;
    }

    if (currentName.trim() === '') {
      setErrors({ ...errors, name: true });
      dispatch(setMessage({ type: 'error', message: 'Vui lòng nhập tên' }));
      return;
    }

    if (currentName.length > MAX.NAME_LEN) {
      setErrors({ ...errors, name: true });
      dispatch(
        setMessage({
          type: 'error',
          message: `Tên tối đa ${MAX.NAME_LEN} ký tự`,
        }),
      );
      return;
    }

    onUpdateProfile(currentName.trim());
  };

  useEffect(() => {
    setData(dataUserInfor);
  }, [dataUserInfor.following]);

  return (
    <div className={`${classes.wrap} container flex-center`}>
      <div className={classes.root}>
        <div className="flex-center w-100 h-100">
          <div className={classes.avtWrap}>
            <img
              className={`${classes.avt} w-100 h-100`}
              src={avtSrc}
              alt="Avatar Photo"
            />

            <div className={`${classes.cameraIconWrap} flex-center`}>
              <CameraIcon className={classes.cameraIcon} />

              <UploadButton className={classes.fileInput} />
            </div>
          </div>
        </div>

        {!editMode ? (
          <div className="mt-8">
            <h2 className={classes.name}>{name}</h2>
          </div>
        ) : (
          <div className="flex-center-col mt-8">
            <InputCustom
              onChange={(e) => handleInputChange(e.target.value, 1)}
              className="mb-8"
              placeholder={name}
              label="Nhập tên"
              error={errors.name}
              defaultValue={name}
            />

          </div>
        )}

        <div className={classes.info}>
          <div>
            <p className={classes.underLine} onClick={() => setShowFollowers(true)}>{followers?.length} Người theo dõi</p>
          </div>
          <div>
            <p className={classes.underLine} onClick={() => setShowFollowing(true)}>{following?.length} Đang theo dõi</p>
          </div>
          {Boolean(email) && <p>{email}</p>}
          {Boolean(createdDate || createdAt) && <p>Đã tham gia vào {formatDate(createdDate || createdAt)}</p>}
          <p>
            Số coin hiện tại: <span className={classes.coin}>{coin}</span>
          </p>
        </div>
        {
          showFollowers &&
          <Followers
            users={data.followers}
            open={showFollowers}
            setShowFollowers={setShowFollowers}
            userInfo={dataUserInfor}
          />
        }
        {
          showFollowing &&
          <Following
            users={data.following}
            open={setShowFollowing}
            setShowFollowing={setShowFollowing}
            userInfo={dataUserInfor}
          />
        }
        <ButtonFollow user={data} />

        {
          flagAuth ? (
            !editMode ?
              <>
                <Button
                  onClick={() => setEditMode(true)}
                  className={`_btn _btn-primary w-100`}
                  startIcon={<EditIcon />}>
                  Chỉnh sửa
                </Button>
              </>
              :
              (
                <div className="d-flex w-100">
                  <Button
                    onClick={handleCloseEditMode}
                    className={`${classes.editBtn} _btn _btn-outlined-accent w-50`}>
                    Huỷ bỏ
                  </Button>
                  <Button
                    onClick={handleUpdate}
                    className={`${classes.editBtn} _btn _btn-primary ml-4 w-50`}>
                    Cập nhật
                  </Button>
                </div>
              )
          ) : null

        }

      </div>
    </div >
  );
}

UserAccount.propTypes = {
  // createdDate: PropTypes.any,
  // email: PropTypes.string,
  onUpdateProfile: PropTypes.func,
};

export default UserAccount;
