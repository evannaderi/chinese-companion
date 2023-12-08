import React, { useState } from 'react';

const ChatInputArea = ({ onSendMessage }) => {
    const [input, setInput] = useState('');

    const handleSend = () => {
        onSendMessage(input);
        setInput('');
    };

    return (
        <div className="chat-input-area">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
            />
            <button onClick={handleSend}>Send</button>
        </div>
    );
};

export default ChatInputArea;
