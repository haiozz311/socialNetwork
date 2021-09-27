import React from 'react';
import { CardContent, Typography } from '@material-ui/core';
import ArrowDropDownCircleRoundedIcon from '@material-ui/icons/ArrowDropDownCircleRounded';
import ArrowDropDownRoundedIcon from '@material-ui/icons/ArrowDropDownRounded';
import { makeStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import Paper from '@material-ui/core/Paper';
import Fade from '@material-ui/core/Fade';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const useStyles = makeStyles((theme) => ({
  root: {
    height: 180,
  },
  container: {
    display: 'flex',
  },
  paper: {
    margin: theme.spacing(1),
  },
  svg: {
    width: 100,
    height: 100,
  },
  polygon: {
    fill: theme.palette.common.white,
    stroke: theme.palette.divider,
    strokeWidth: 1,
  },
}));

const PostContent = ({ post, readMore, setReadMore }) => {
  const classes = useStyles();
  return (
    <>
      {
        post.content.length > 0 && <CardContent>
          <Typography variant="body2" color="text.secondary">

            {post.content.length < 200 ? post.content : readMore ? post.content + ' ' : post.content.slice(0, 200) + '...'}
            {
              post.content.length > 200 &&
              <span onClick={() => setReadMore(!readMore)}>
                {readMore ? 'Hide content' : 'show'}
              </span>
            }
          </Typography>
        </CardContent>
      }
    </>
  );
};

export default PostContent;
