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
import { getProfileUsers, setIds } from 'redux/slices/profile.slice';
import useStyle from './style';
import { formatDate } from 'helper';
import ButtonFollow from 'components/UI/ButtonFollow';
import { formStyle } from 'components/UI/style';
import Followers from 'components/UI/Followers';
import Following from 'components/UI/Following';
import MyPostProfile from 'components/UI/MyPostProfile/MyPostProfile';
import './index.scss';

function UserAccount({ onUpdateProfile, userData, id }) {
  console.log({userData, id});
  const [data, setData] = useState({});
  const dataUserInfor = useSelector((state) => state.userInfo);
  const { posts } = useSelector((state) => state.post);
  const profile = useSelector(state => state.profile);
  const { refresh_token } = useSelector(state => state.token);
  const { name, avatar, coin, email, createdDate, createdAt, followers, following } = data;

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
    setData(userData);
  }, [userData, dataUserInfor.avatar,dataUserInfor.followers, dataUserInfor.following ]);

  useEffect(() => {
    setIdUser(id);
  }, [id]);

  useEffect(() => {
    if (profile.ids.every(item => item !== id)) {
      dispatch(getProfileUsers({ id, refresh_token }));
    }
  }, [id, refresh_token, dispatch]);

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
      dispatch(setMessage({ type: 'error', message: 'Vui l??ng nh???p t??n' }));
      return;
    }

    if (currentName.length > MAX.NAME_LEN) {
      setErrors({ ...errors, name: true });
      dispatch(
        setMessage({
          type: 'error',
          message: `T??n t???i ??a ${MAX.NAME_LEN} k?? t???`,
        }),
      );
      return;
    }

    onUpdateProfile(currentName.trim());
  };

  useEffect(() => {
    if (id === dataUserInfor._id) {
      setData(dataUserInfor);
    }
  }, [dataUserInfor.following,dataUserInfor.followers]);

  return (
    <>
      <div className={`${classes.wrap} cover-profile container flex-center`}>
        <div className={`${classes.root} profile`}>
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
                label="Nh???p t??n"
                error={errors.name}
                defaultValue={name}
              />

            </div>
          )}

          <div className={classes.info}>
            <div>
              <p className={classes.underLine} onClick={() => setShowFollowers(true)}>{followers?.length} Ng?????i theo d??i</p>
            </div>
            <div>
              <p className={classes.underLine} onClick={() => setShowFollowing(true)}>{following?.length} ??ang theo d??i</p>
            </div>
            {Boolean(email) && <p>{email}</p>}
            {Boolean(createdDate || createdAt) && <p>???? tham gia v??o {formatDate(createdDate || createdAt)}</p>}
            <p>
              S??? coin hi???n t???i: <span className={classes.coin}>{coin}</span>
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
                    Ch???nh s???a
                  </Button>
                </>
                :
                (
                  <div className="d-flex w-100">
                    <Button
                      onClick={handleCloseEditMode}
                      className={`${classes.editBtn} _btn _btn-outlined-accent w-50`}>
                      Hu??? b???
                    </Button>
                    <Button
                      onClick={handleUpdate}
                      className={`${classes.editBtn} _btn _btn-primary ml-4 w-50`}>
                      C???p nh???t
                    </Button>
                  </div>
                )
            ) : null

          }

        </div>
      </div >
      <MyPostProfile profile={profile} id={id} />
    </>
  );
}

UserAccount.propTypes = {
  // createdDate: PropTypes.any,
  // email: PropTypes.string,
  onUpdateProfile: PropTypes.func,
};

export default UserAccount;
