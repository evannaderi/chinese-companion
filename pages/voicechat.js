import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { getGeminiCompletionMultiTurn } from '../services/geminiService'
import { set } from 'mongoose';

const ChatBot = () => {
    const [history, setHistory] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [request, setRequest] = useState('');

    useEffect(() => {
        const processLatestMessage = async () => {
            if (request === '') return;
            console.log("history: ", history);
            const historyWithoutLastItem = history.slice(0, -1); // Remove the last item from the history array
            console.log("historyWithoutLastItem: ", historyWithoutLastItem);
            console.log("userInput: ", request);
            const botResponse = await getGeminiCompletionMultiTurn(historyWithoutLastItem, request); 
            console.log("botResponse: ", botResponse);
            setHistory(currentHistory => [...currentHistory, { role: 'model', parts: botResponse }]);
        };
         
        processLatestMessage();
    }, [request]);

    useEffect(() => {
        console.log("history changed: ", history); 
    }, [history]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userInput.trim()) return;

        
        setHistory(currentHistory => [...currentHistory, { role: 'user', parts: userInput }]);
        setRequest(userInput);
        setUserInput('');
        

        // Update history with user message
        
        

        // Get bot response
        
        
    };

    return (
        <div>
            <h1>Chat with Gemini Bot</h1>
            <div className="chat-window">
                {history.map((entry, index) => (
                    <div key={index} className={entry.role === 'user' ? 'user-message' : 'bot-message'}>
                        {entry.parts}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type your message here..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default ChatBot;
