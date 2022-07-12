import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import './index.scss';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';


const MyPostProfile = ({ profile, id }) => {
  const [posts, setPosts] = useState([]);
  console.log('posts test', posts);
  useEffect(() => {
    if (profile.posts) {
      profile?.posts?.forEach(data => {
        if (data._id === id) {
          setPosts(data.posts);
        }
      });
    }
  }, [profile.posts, id, profile.posts.comments, profile]);

  return (
    <div className='container'>
      {
        // posts.map(post => (
        //   <Link key={post._id} to={`/post/${post._id}`}>
        //     <div className="post_thumb_display">
        //       {
        //         <img src={post?.images[0]?.url} alt={post?.images[0]?.url} />
        //       }
        //     </div>
        //   </Link>
        // ))
        <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
          {posts.map((item, index) => (
            item.images.length > 0 && (
              <ImageListItem key={index}>
                <img
                  src={item.images[0]?.url}
                  srcSet={item.images[0]?.url}
                  alt="image"
                  loading="lazy"
                />
              </ImageListItem>
            )
          ))}
        </ImageList>
      }
    </div>
  );
};

export default MyPostProfile;

