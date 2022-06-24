/* eslint-disable react/jsx-key */
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import CloseIcon from '@material-ui/icons/Close';
import Grid from '@material-ui/core/Grid';

import Avatar from '@material-ui/core/Avatar';
import ResetIcon from '@material-ui/icons/RotateLeft';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import LoopIcon from '@material-ui/icons/Loop';
import InputCustom from 'components/UI/InputCustom';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import useStyle from './style';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { MAX, MIN, REGEX } from 'constant';
import WordContributionData from 'components/Contribution/Word/data';
import * as yup from 'yup';
import SaveIcon from '@material-ui/icons/Save';


import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import TextEditor from '../Editor';

const schema = yup.object().shape({
  title: yup
    .string()
    .trim()
    .required('Nhập tiêu đề'),
  desc: yup
    .string()
    .trim()
    .required('Nhập miêu tả'),
  // html: yup
  //   .string()
  //   .trim()
  //   .required('Nhập nội dung')
});
function ModalAddBlogs({ open, onClose, onRegister }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [htmlContent, setHtmlContent] = useState(null);
  const onSubmit = (data) => {
    onRegister({ ...data, html: htmlContent });
  };
  const classes = useStyle();
  const onResetForm = () => {
    const initialValues = {
      title: '',
      desc: '',
      html: '',
    };
    reset(initialValues);
  };
  const handleHtmlEditor = editor => {
    setHtmlContent(editor);
  };
  return (
    <Dialog
      classes={{
        paper: classes.rootPaper,
      }}
      onClose={onClose}
      aria-labelledby="setting dialog"
      disableBackdropClick={true}
      maxWidth="md"
      open={open}>
      <div className={`${classes.title} flex-center-between`}>
        <span>Tạo blogs</span>
        <CloseIcon className="cur-pointer" onClick={onClose} />
      </div>

      <DialogContent classes={{ root: classes.content }}>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <Grid className={classes.grid} container spacing={3} mb-4>
            {/* new word */}
            <Grid item xs={12}>
              <InputCustom
                className="w-100"
                label="Tiêu đề"
                error={Boolean(errors.title)}
                inputProps={{
                  autoFocus: true,
                  maxLength: MAX.WORD_LEN,
                  name: 'title',
                  ...register('title'),
                }}
              />
              {errors.title && (
                <p className="text-error">{errors.title?.message}</p>
              )}
            </Grid>
            <Grid item xs={12}>
              <InputCustom
                className="w-100"
                label="Miêu tả nội dung"
                error={Boolean(errors.word)}
                multiline
                inputProps={{
                  autoFocus: true,
                  maxLength: MAX.WORD_LEN,
                  name: 'desc',
                  ...register('desc'),
                }}
              />
              {errors.desc && (
                <p className="text-error">{errors.desc?.message}</p>
              )}
            </Grid>
          </Grid>
          <TextEditor handleHtmlEditor={handleHtmlEditor} />

          <div className="dyno-break"></div>
          {/* button group */}
          <div className="d-flex flex-end jus-content-end pt-5 w-100">
            <Button
              className={`${classes.btn} ${classes.btnReset}`}
              color="secondary"
              endIcon={<ResetIcon />}
              variant="outlined"
              // disabled={submitting}
              onClick={onResetForm}
            >
              Reset
            </Button>
            <Button
              type="submit"
              className={`${classes.btn} _btn _btn-primary`}
              // disabled={submitting}
              // endIcon={
              //   submitting ? <LoopIcon className="ani-spin" /> : <SaveIcon />
              // }
              variant="contained">
              Thêm từ
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

ModalAddBlogs.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  onRegister: PropTypes.func,
};

ModalAddBlogs.defaultProps = {
  onClose: function () { },
  open: false,
};

export default ModalAddBlogs;
