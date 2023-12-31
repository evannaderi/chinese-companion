import React, { useState, useRef } from 'react';
import { TextField, Button, IconButton, Tooltip } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import FeedbackIcon from '@mui/icons-material/Feedback'; // Importing Feedback icon
import { getTranscription } from '../services/openaiService';
import styles from './styles/ChatInputArea.module.css';
const transcriptionModel = "whisper-1";

const ChatInputArea = ({ onSendMessage, userInput, setUserInput, isSituationUsed, openHelpChat }) => {
    const [input, setInput] = useState('');
    const [recording, setRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const handleSend = () => {
        if (userInput.trim() !== '') {
            onSendMessage(userInput);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Prevent the default action to avoid line break in TextField
            handleSend();
        }
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

    const saveRecording = async () => {
        console.log("Save recording pressed");
        console.log("The first chunk is: ", audioChunksRef.current[0]);
        console.log("current chunks are: ", audioChunksRef.current);
        console.log("The length of the chunks is: ", audioChunksRef.current.length);
        
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
        console.log("The audio blob is: ", audioBlob)
        console.log("The blob size is: ", audioBlob.size)

        // if (audioBlob.type !== 'audio/webm') {
        //     console.log("The audio blob is not in webm format.");
        //     return;
        // }

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
    
            const result = await getTranscription(base64Audio, audioID, transcriptionModel);
            console.log("called getTranscription");
            console.log("The result of transcription is: ", result);
            setUserInput(result);
        } catch (error) {
            console.error("Error in saveRecording: ", error);
        } finally {
            audioChunksRef.current = []; // Clear the audio chunks
        }
    };

    const handleRecordButtonClick = () => {
        if (recording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const handleGetFeedback = async () => {
        if (userInput.trim() !== '') {
            try {
                const feedback = openHelpChat(userInput, "feedback"); // Call the feedback service
                console.log('Feedback:', feedback); // Handle the feedback response (e.g., display it or log it)
                // You may also want to update the UI based on this feedback
            } catch (error) {
                console.error('Error getting feedback:', error);
            }
        }
    };

    return (
        <div className={styles.chatInputArea}>
            <TextField
                fullWidth
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type your message..."
                variant="outlined"
                margin="normal"
                onKeyPress={handleKeyPress}
            />
            <Tooltip title="Get feedback on correctness of your message">
                <IconButton 
                    onClick={handleGetFeedback}
                    style={{ margin: '5px' }}
                    disabled={!userInput.trim()} // Disable if there's no input
                >
                    <FeedbackIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title="Send Message">
                <IconButton 
                    onClick={handleSend}
                    style={{ margin: '5px' }}
                    disabled={!userInput.trim() || !isSituationUsed } // Disable if there's no input
                >
                    <SendIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title={recording ? 'Stop Recording' : 'Start Recording'}>
                <IconButton 
                    onClick={handleRecordButtonClick}
                    style={{ margin: '5px' }}
                    color={recording ? "secondary" : "primary"}
                >
                    {recording ? <MicOffIcon /> : <MicIcon />}
                </IconButton>
            </Tooltip>
            
        </div>
    );
};

export default ChatInputArea;
