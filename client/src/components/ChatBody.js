import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseurl } from "../auth/BaseUrl";

const ChatBody = ({ lastMessageRef, typingStatus, id, messages }) => {
  const [userMessages, setUserMessages] = useState([]);
  const [userName, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    listLoginUser();
    fetchMessages();
  }, [id])

  const listLoginUser = async () => {
    const loginUsreresponse = await fetch(`${baseurl}login-users`);
    const loginUser = await loginUsreresponse.json();
    const loginUsers = loginUser.result;

    loginUsers.forEach(loginUser => {
      if (loginUser.id === JSON.parse(sessionStorage.getItem('user')).id) {
        setUsername(loginUser.name);
      }
    })
  }

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${baseurl}list-message/${id.id}`); // Adjust endpoint to fetch messages by user ID
      const data = await response.json();
      setUserMessages(data.result);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
  
  const handleLeaveChat = async () => {
    const user_id = JSON.parse(sessionStorage.getItem('user')).id;

    try {
      const response = await fetch(`http://192.168.1.246:4000/disconnect-user`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ user_id })
      });

      if (response.ok) {
        sessionStorage.removeItem("user");
        navigate("/");
        window.location.reload();
      } else {
        console.error("Failed to update user status");
      }
    } catch (error) {
      console.error("Error updating user status on disconnect:", error);
    }
  };

  return (
    <>
      <header className="chat__mainHeader">
        <p className="text-dark fs-4"><strong>Welcome</strong>{` : ${userName}`}</p>
        <button className="leaveChat__btn" onClick={handleLeaveChat}>
          LEAVE CHAT
        </button>
      </header>

      {/*This shows messages sent from you*/}
      {/*This shows messages received by you*/}
      <div className="message__container">
        {/* old history message */}
        {userMessages.map((message) => {
          const currentUserId = JSON.parse(sessionStorage.getItem("user")).id;

          if (message.sender_id === currentUserId) {
            // Message sent by the current user
            return (
              <div className="message__chats" key={message.id}>
                <p className="sender__name">You</p>
                <div className="message__sender">
                  <p>{message.message}</p>
                </div>
              </div>
            );
          } else if (message.receiver_id === currentUserId) {
            // Message received by the current user
            return (
              <div className="message__chats" key={message.id}>
                <p>{userName}</p>
                <div className="message__recipient">
                  <p>{message.message}</p>
                </div>
              </div>
            );
          }

          return null; // Default case if no condition matches
        })}

        {/* daynamic message sending and receiving */}
        {messages.map((message) => {
          const currentUserId = JSON.parse(sessionStorage.getItem("user")).id;

          if (message.sender_id === currentUserId) {
            // Message sent by the current user
            return (
              <div className="message__chats" key={message.id}>
                <p className="sender__name">You</p>
                <div className="message__sender">
                  <p>{message.message}</p>
                </div>
              </div>
            );
          } else if (message.receiver_id === currentUserId) {
            // Message received by the current user
            return (
              <div className="message__chats" key={message.id}>
                <p>{userName}</p>
                <div className="message__recipient">
                  <p>{message.message}</p>
                </div>
              </div>
            );
          }

          return null; // Default case if no condition matches
        })}


        {/*This is triggered when a user is typing*/}
        <div className="message__status">
          <p>{typingStatus}</p>
        </div>
        <div ref={lastMessageRef} />
      </div>
    </>
  );
};

export default ChatBody;
