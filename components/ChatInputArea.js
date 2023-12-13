import React, { useState, useRef } from 'react';
import { getTranscription } from '../services/openaiService';
import styles from './styles/ChatInputArea.module.css';

const transcriptionModel = "whisper-1";

const ChatInputArea = ({ onSendMessage }) => {
    const [input, setInput] = useState('');
    const [recording, setRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const handleSend = () => {
        onSendMessage(input);
        setInput('');
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
            setInput(result);
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

    return (
        <div className={styles.chatInputArea}>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
            />
            <button onClick={handleSend}>Send</button>
            <button onClick={handleRecordButtonClick}>
                {recording ? 'Stop Recording' : 'Start Recording'}
            </button>
        </div>
    );
};

export default ChatInputArea;
