import React, { useState, useEffect } from 'react';
import CommentCard from './CommentCard';
import useStyle from './style';

const CommentDisplay = ({ comment, post, replyCm }) => {
  const [showRep, setShowRep] = useState([]);
  const [next, setNext] = useState(2);

  useEffect(() => {
    setShowRep(replyCm.slice(replyCm.length - next));
  }, [replyCm, next]);
  const classes = useStyle();
  return (
    <div>
      <CommentCard comment={comment} post={post} commentId={comment._id}>
        <div className={`${classes.bgWhite}`}>
          {
            showRep.map((item, index) => (
              item.reply &&
              <CommentCard
                key={index}
                comment={item}
                post={post}
                commentId={comment._id}
              />
            ))
          }
          {
            replyCm.length - next > 0
              ? <div className="p-2 border-top"
                style={{ cursor: 'pointer', color: 'crimson' }}
                onClick={() => setNext(next + 10)}>
                Xem thêm
              </div>

              : replyCm.length > 1 &&
              <div className="p-2 border-top"
                style={{ cursor: 'pointer', color: 'crimson' }}
                onClick={() => setNext(2)}>
                ẩn
              </div>
          }
        </div>
      </CommentCard>
    </div>
  );
};

export default CommentDisplay;
