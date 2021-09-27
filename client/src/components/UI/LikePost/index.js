import React from 'react';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';

const LikePost = ({ like, handleLike, handleUnLike }) => {
  return (
    <>
      {
        like
          ? <FavoriteIcon onClick={() => {
            handleUnLike();
          }} />
          : <FavoriteBorderIcon onClick={() => {
            handleLike();
          }} />
      }
    </>
  );
};

export default LikePost;

