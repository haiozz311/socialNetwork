import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Avatar from '@material-ui/core/Avatar';
import { Link } from 'react-router-dom';
import { getSuggestions } from 'redux/slices/suggestion.slice';
import AutorenewIcon from '@material-ui/icons/Autorenew';

const RightSideBar = () => {
  const auth = useSelector((state) => state.userInfo);
  const { refresh_token } = useSelector((state) => state.token);
  const suggestion = useSelector((state) => state.suggestion);
  const dispatch = useDispatch();
  useEffect(() => {
    if (refresh_token) {
      dispatch(getSuggestions({ refresh_token }));
    }
  }, [refresh_token]);
  return (
    <div>
      <Link to={`/profile/${auth._id}`} className="d-flex mx-8">
        <Avatar src={auth.avatar} />
        {/* <h4 className={`${classes.textName} ml-4`}>{comment.user.name}</h4> */}
      </Link>
      <div>
        <h5>Gợi ý kết bạn</h5>
        <AutorenewIcon />
        {
          suggestion.users.map(item => (
            <Link key={item._id} to={`/profile/${item._id}`} className="d-flex mx-8">
              <Avatar src={item.avatar} />
              <h4 className={`ml-4`}>{item.name}</h4>
            </Link>
          ))
        }
      </div>
    </div>
  );
};

export default RightSideBar;
