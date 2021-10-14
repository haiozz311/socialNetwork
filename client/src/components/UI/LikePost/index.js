import React from 'react';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import useStyle from './style';

const LikePost = ({ like, handleLike, handleUnLike }) => {
  const classes = useStyle();
  return (
    <>
      {
        like
          ? <FavoriteIcon className={`${classes.animationHeart}`} onClick={() => {
            handleUnLike();
          }} />
          : <FavoriteBorderIcon className={`${classes.animationHeartClose}`} onClick={() => {
            handleLike();
          }} />
      }
    </>
  );
};

export default LikePost;

