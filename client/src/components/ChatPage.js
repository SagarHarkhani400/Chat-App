import React, { useEffect, useRef, useState } from "react";
import ChatBar from "./ChatBar";
import ChatBody from "./ChatBody";
import ChatFooter from "./ChatFooter";
import { useParams } from "react-router-dom";

const ChatPage = ({ socket }) => {
  const id = useParams();
  const [messages, setMessages] = useState([]);
  const [typingStatus, setTypingStatus] = useState('');
  const lastMessageRef = useRef(null);
  
  // Listen for new messages
  useEffect(() => {
    socket.on("messageResponse", data => setMessages([...messages, data]));

    return () => {
      socket.off("messageResponse");
    };
  }, [socket, messages]);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    socket.on('typingResponse', (data) => setTypingStatus(data))
    socket.on('stopTypingResponse', () => setTypingStatus(''))

    return () => {
      socket.off('typingResponse');
      socket.off('stopTypingResponse');
    };
  }, [socket]);

  return (
    <div className="chat">
      <ChatBar socket={socket} />
      <div className="chat__main">
        <ChatBody id={id} messages={messages} lastMessageRef={lastMessageRef} typingStatus={typingStatus} />
        <ChatFooter id={id} socket={socket}/>
      </div>
    </div>
  );
};

export default ChatPage;
