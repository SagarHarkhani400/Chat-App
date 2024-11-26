import React, { useState } from "react";
import { baseurl } from "../auth/BaseUrl";

const ChatFooter = ({ socket, id }) => {
  const [message, setMessages] = useState("");

  const handleTyping = (e) => {
    if (e.target.value) {
      socket.emit('typing', `${JSON.parse(sessionStorage.getItem('user')).name} is typing`)
    } else {
      socket.emit('stop typing')
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    // set sender using session 
    const sessionUser = sessionStorage.getItem('user');
    const parseUser = JSON.parse(sessionUser);
    const sender_id = parseUser?.id;

    // get reciever id
    let receiver_id = id.id;
    if (!message.trim() || !receiver_id) {
      alert("Message cannot be empty or Receiver ID not found.");
      return;
    }

    // set time in time formate
    const d = new Date();
    const time = `${d.getHours()}/${d.getMinutes()}/${d.getSeconds()}`;

    
    try {
      const response = await fetch(`${baseurl}messages`, {
        method: 'POST',
        body: JSON.stringify({ message, sender_id, receiver_id, time }),
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (response.ok) {
        // Emit the message through the socket only if server confirms
        const result = await response.json();
        const newMessage = {
          text: message,
          userName: parseUser?.name,
          sender_id,
          receiver_id,
          id: result.result.insertId,
          socketId: socket.id,
          time,
        };
        console.log(newMessage);

        if (result.success) {
          setMessages(""); // Clear the input box
          socket.emit("message", newMessage);
          socket.emit("stop typing");
        } else {
          console.error("Message not acknowledged by the server.");
        }
      } else {
        console.error("Failed to send the message to the server.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="chat__footer">
      <form className="form" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Write message"
          className="message"
          value={message}
          onChange={(e) => setMessages(e.target.value)}
          onKeyDown={handleTyping}
        />
        <button className="sendBtn" type="submit">SEND</button>
      </form>
    </div>
  );
};

export default ChatFooter;
