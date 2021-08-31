import React, { useState } from 'react';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import SettingInput from './Modal/SettingInput';


const SettingReset = () => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      <SettingInput onClose={() => setOpenModal(false)} open={openModal} />
      <LockOpenIcon onClick={() => setOpenModal(true)} />
    </>
  );
};

export default SettingReset;
