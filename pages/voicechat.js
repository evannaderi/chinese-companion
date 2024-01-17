import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { IconButton } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import { getGeminiCompletionMultiTurn } from '../services/geminiService';
import { getTranscription } from '../services/openaiService';
import { getTTS } from '../services/openaiService';
import { Button } from '@mui/material';
import styles from '../styles/voicechat.module.css';

const transcriptionModel = "whisper-1";
const voice = "alloy";

const ChatBot = () => {
    const [history, setHistory] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [request, setRequest] = useState('');
    const audioRef = React.useRef(null);

    const [recording, setRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    // useEffect(() => {
    //     if (!recording) {
    //         mediaRecorderRef.current = new MediaRecorder(window.stream);
    //         mediaRecorderRef.current.addEventListener('dataavailable', handleDataAvailable);
    //         mediaRecorderRef.current.addEventListener('stop', handleStop);
    //     }
    // }, [recording]);

    const fetchAndSetAudio = async () => {
        
        try {
            const googleResponse = await getTTS({ text: "hello", model: voice });
            const audioBlob = new Blob([new Uint8Array(Buffer.from(googleResponse.audioData, 'base64'))], { type: 'audio/mpeg' });
            const audioUrl = URL.createObjectURL(audioBlob);
            audioRef.current.src = audioUrl;
            console.log("The audio src is: ", audioRef.current.src);
            audioRef.current.play();
        } catch (error) {
            console.error("Error playing text:", error.message);
        }
    };

    const handlePlay = async (text) => {
        try {
            const response = await getTTS('tts-1', voice, text);
            const audioBlob = new Blob([new Uint8Array(Buffer.from(response.audioData, 'base64'))], { type: 'audio/mpeg' });
            const audioUrl = URL.createObjectURL(audioBlob);
            audioRef.current.src = audioUrl;
            console.log("The audio src is: ", audioRef.current.src);
            audioRef.current.play();
        } catch (error) {
            console.error("Error playing text:", error.message);
        }
    };

    const handlePause = () => {
        setIsPlaying(false);
        audioRef.current.pause();
    };


    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const options = { mimeType: 'audio/webm' };
        mediaRecorderRef.current = new MediaRecorder(stream, options);

        mediaRecorderRef.current.ondataavailable = (event) => {
            console.log('Data available: ', event.data);
            if (event.data.size > 0) {
                audioChunksRef.current.push(event.data);
                console.log(`Chunk received: size=${event.data.size}`);
            }
        };
    
        mediaRecorderRef.current.onstart = () => {
            console.log('Recording started');
        };

        mediaRecorderRef.current.onstop = async () => {
            console.log("Recording stopped, saving Blob.");
            saveRecording();
        };
    
        mediaRecorderRef.current.onerror = (event) => {
            console.error('Recording error:', event.error);
        };
    
        mediaRecorderRef.current.start();

        setRecording(true);
    };

    const stopRecording = async () => {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        setRecording(false);

        // Wait a bit to make sure the last chunks have been pushed
        // setTimeout(() => {
        //     console.log("Chunks at the end of recording:", audioChunksRef.current);
        //     saveRecording();
        // }, 1000); // Adjust this delay as needed
        
    };

    const processUserInput = async (transcript) => {
        
        const botResponse = await getGeminiCompletionMultiTurn(history, transcript);
        setHistory(currentHistory => [...currentHistory, 
            { role: 'user', parts: transcript },
            { role: 'model', parts: botResponse }
        ]);
        
        
        
        
        handlePlay(botResponse);
    };

    const saveRecording = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
        // Implement logic to handle the audioBlob (e.g., send to server, transcribe, etc.)
        // Reset audioChunksRef

        try {
            const base64Audio = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve(reader.result);
                }
                reader.onerror = reject;
                reader.readAsDataURL(audioBlob);
            });
    
            const audioID = `audio_${Date.now()}`;
            console.log("Calling getTranscription with base64Audio: ", base64Audio, " and audioID: ", audioID);
    
            const transResult = await getTranscription(base64Audio, audioID, transcriptionModel);
            console.log("called getTranscription");
            console.log("The result of transcription is: ", transResult);
            setHistory(currentHistory => [...currentHistory, { role: 'user', parts: transResult }]);
            setRequest(transResult);
            
        } catch (error) {
            console.error("Error in saveRecording: ", error);
        } finally {
            audioChunksRef.current = []; // Clear the audio chunks
        }
    };

    useEffect(() => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.onstop = saveRecording;
        }
    }, []);

    // useEffect(() => {
    //     console.log("request changed: ", request);
    //     const processLatestMessage = async () => {
    //         if (request === '') return;
    //         console.log("history: ", history);
    //         const historyWithoutLastItem = history.slice(0, -1); // Remove the last item from the history array
    //         console.log("historyWithoutLastItem: ", historyWithoutLastItem);
    //         console.log("userInput: ", request);
    //         const newRequest = "Reminder: you are Lihua in a situation where you forget grandma's cookies and you are asking me (John) for help. Do not include your name just your message. Only speak English. Remember the natural flow of conversatoin) " + request;
    //         let botResponse = "";
    //         try {
    //             botResponse = await getGeminiCompletionMultiTurn(historyWithoutLastItem, newRequest); 
    //         } catch (error) {
    //             alert("Error in gemini completion: ", error);
    //         }
            
    //         console.log("botResponse: ", botResponse);
    //         setHistory(currentHistory => [...currentHistory, { role: 'model', parts: botResponse }]);
    //         console.log("about to play: ", botResponse);
    //         await handlePlay(botResponse);  
    //         console.log("done playing");
            
    //     };
         
    //     processLatestMessage();
    // }, [request]);

    useEffect(() => {console.log("history changed: ", history);
        const processLatestMessage = async () => {
            if (history.length === 0) return;
            const lastMessage = history[history.length - 1];
            if (lastMessage.parts === '') return;
            if (lastMessage.role === 'user') {
                console.log("history: ", history);
                const historyWithoutLastItem = history.slice(0, -1);
                console.log("historyWithoutLastItem: ", historyWithoutLastItem);
                //const newRequest = "Reminder: you are Lihua in a situation where you forget grandma's cookies and you are asking me (John) for help. Do not include your name just your message. Only speak English. Remember the natural flow of conversatoin) " + request;
                let botResponse = "";
                try {
                    console.log("lastMessage.parts: ", lastMessage.parts);
                    botResponse = await getGeminiCompletionMultiTurn(historyWithoutLastItem, lastMessage.parts); 
                    console.log("botResponse: ", botResponse);
                } catch (error) {
                    alert("Error in gemini completion: ", error);
                }

                setHistory(currentHistory => [...currentHistory, { role: 'model', parts: botResponse }]);
                console.log("about to play: ", botResponse);
                await handlePlay(botResponse);  
                console.log("done playing");
            }
        };

        processLatestMessage();
    }, [history]);

    useEffect(() => {
        //setHistory(currentHistory => [...currentHistory, { role: 'user', parts: "Only speak Spanish at a beginner level." }]);
        
    }, []);

    useEffect(() => {
        
        // const playLatestBotResponse = async () => {
        //     if (history.length > 0) {
        //         const lastMessage = history[history.length - 1];
        //         if (lastMessage.role === 'model') {
        //             await handlePlay(lastMessage.parts);
        //         }
        //     }
        // };
    
        // playLatestBotResponse();
    }, [history]);

    const handleSubmit = async (e) => {
        if (e)
            e.preventDefault();
        if (!userInput.trim()) return;

        
        setHistory(currentHistory => [...currentHistory, { role: 'user', parts: userInput }]);
        setRequest(userInput);
        setUserInput('');
        

        // Update history with user message
        
        

        // Get bot response
        
        
    };

    const handleRecordButtonClick = () => {
        recording ? stopRecording() : startRecording();
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
                <IconButton 
                    onClick={handleRecordButtonClick}
                    className={styles.microphoneButton}
                    style={{fontSize: '8rem'}}
                >
                    {recording ? <MicOffIcon style={{ fontSize: 200 }}/> : <MicIcon style={{ fontSize: 200 }}/>}
                </IconButton>
                
                <audio ref={audioRef}/>
            </form>
        </div>
    );
};

export default ChatBot;
