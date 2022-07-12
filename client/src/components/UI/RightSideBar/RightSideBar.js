import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Avatar from '@material-ui/core/Avatar';
import { Link } from 'react-router-dom';
import { getSuggestions } from 'redux/slices/suggestion.slice';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import './index.scss';

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
    <div className='suggestion-cover'>
      {
        suggestion?.users?.length > 0 && (
          <div className='suggestion'>
            <h3>Suggestion For You</h3>
            <AutorenewIcon style={{ cursor: 'pointer' }} onClick={() => {
              dispatch(getSuggestions({ refresh_token }));
            }} />
          </div>
        )
      }

      {
        suggestion.users.map(item => (
          <div key={item._id} className='user-item'>
            <div className="d-flex align-i-center">
              <Avatar src={item.avatar} />
              <h4 className="ml-8">{item.name}</h4>
            </div>
            <Link to={`/profile/${item._id}`}>Take it</Link>
          </div>
        ))
      }
    </div>
  );
};

export default RightSideBar;
