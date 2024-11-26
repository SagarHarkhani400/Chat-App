import React, { useEffect, useState } from 'react';
import { baseurl } from '../auth/BaseUrl';
import { Link, useParams } from 'react-router-dom';

const ChatBar = () => {
  const [users, setUsers] = useState([]);
  const {id} = useParams();
  
  useEffect(() => {
    getLoginUsers();
  },[])
  
  const getLoginUsers = async () => {
    const response = await fetch(`${baseurl}login-users`)
    const result = await response.json()

    if (result) {
      setUsers(result.result);
    }
  }
  return (
    <div className="chat__sidebar">
      <h3>Chat Application</h3>

      <div>
        <h6 className="chat__header">ACTIVE USERS</h6>
        <div className="chat__users">
          {users
            .filter((user) => JSON.parse(sessionStorage.getItem('user')).id !== user.id)
            .map((user) => (
              user.id === parseInt(id) ? ( 
                <Link to={`/chat/${user.id}`} key={user.id} className="chat__userLink active">
                  {user.name}
                </Link>
              ) : (
                <Link to={`/chat/${user.id}`} key={user.id} className="chat__userLink">
                  {user.name}
                </Link>
              )
            ))}
          <p></p>
        </div>
      </div>
    </div>
  );
};

export default ChatBar;