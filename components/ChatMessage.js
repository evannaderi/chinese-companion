import React from 'react';

const ChatMessage = ({ message }) => {
  return (
    <div className={`message ${message.role}`}>
      <div className="message-content">
        <p>{message.content}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
