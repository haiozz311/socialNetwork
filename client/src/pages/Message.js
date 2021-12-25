import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import LeftSide from 'components/Message/LeftSide';
import RightSide from 'components/Message/RightSide';
import './styles/message.scss';



const Message = () => {
  return (
    <div className="message container">
      <Grid container>
        <Grid item xs={4}>
          <LeftSide />
        </Grid>
        <Grid item xs={8}>
          <RightSide />
        </Grid>
      </Grid>
    </div>
  );
};
  
export default Message;
