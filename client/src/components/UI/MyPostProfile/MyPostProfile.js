import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';


const MyPostProfile = ({ profile, id }) => {
  const [posts, setPosts] = useState([]);

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
    <div>
      {
        posts.map(post => (
          <Link key={post._id} to={`/post/${post._id}`}>
            <div className="post_thumb_display">
              {
                <img src={post?.images[0]?.url} alt={post?.images[0]?.url} />
              }
              {
                post?.images[0]?.url && (
                  <div>
                    {post.likes.length} < FavoriteBorderIcon />
                    {post.comments.length}<ChatBubbleOutlineIcon />
                  </div>
                )
              }
            </div>
          </Link>
        ))
      }
    </div>
  );
};

export default MyPostProfile;

