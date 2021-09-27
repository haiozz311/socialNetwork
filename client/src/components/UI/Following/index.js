import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import CloseIcon from '@material-ui/icons/Close';
import Avatar from '@material-ui/core/Avatar';
import useStyle from './style';
import ButtonFollow from '../ButtonFollow';

const Following = ({ users, open, setShowFollowing, userInfo }) => {
  console.log({ users, open, setShowFollowing, userInfo })
  const classes = useStyle();
  return (
    <div>
      <Dialog
        classes={{
          paper: classes.rootPaper,
        }}
        aria-labelledby="setting dialog"
        disableBackdropClick={true}
        maxWidth="md"
        open={open}
      >
        <div className={`${classes.title} flex-center-between`}>
          <span>Danh Sách đang theo dõi bạn</span>
          <CloseIcon onClick={() => setShowFollowing(false)} className="cur-pointer" />
        </div>

        <DialogContent classes={{ root: classes.content }}>
          <h2 className={classes.contentLabel}>Thông tin</h2>
          {
            users?.map((item) => (
              <>
                <div className={classes.contentItem}>
                  <div className="d-flex align-i-center">
                    <Avatar src={item?.avatar} />
                    <h4 className="ml-3">{item.name}</h4>
                  </div>
                  {
                    userInfo._id !== item._id && <ButtonFollow user={item} dataFlag={true} className="customW" />
                  }
                </div>
              </>
            ))
          }
        </DialogContent>

        <DialogActions className={classes.actions}>
          <Button
            className="_btn _btn-primary"
            onClick={() => {
              setShowFollowing(false);
            }}
            color="primary"
            size="small"
            variant="contained">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Following;
