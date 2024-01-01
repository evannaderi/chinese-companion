// HelpInstructionsModal.js

import React from 'react';
import { Modal, Box, Button } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    maxHeight: '80vh',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    overflowY: 'scroll',
    fontFamily: 'Arial',
};

const HelpInstructionsModal = ({ isOpen, onClose }) => {
    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="help-modal-title"
            aria-describedby="help-modal-description"
        >
            <Box sx={style}>
                <h2 id="help-modal-title">How to use LinguaFluent?</h2>
                <p>A sophisticated ChatGPT wrapper designed for immersive language learning through role-play scenarios.</p>
    
                <h2>Getting Started</h2>
                <ol>
                    <li>
                        <strong>Choose a Role-Play Scenario:</strong>
                        <ul>
                            <li>Access various role-play scenarios for an engaging learning experience.</li>
                            <li>Choose from predefined scenarios, type your own, or get a random situation via the green Situation Card.</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Customize Your Experience:</strong>
                        <ul>
                            <li>Personalize the names of your character and the AI character in Settings.</li>
                            <li>Make your role-play more relatable and fun.</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Select a Language and AI Model:</strong>
                        <ul>
                            <li>Choose the language you wish to learn.</li>
                            <li>Select between GPT-4 or GPT-3.5 models based on your preference.</li>
                            <li>Adjust the voice settings for a personalized experience.</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Interacting with the AI:</strong>
                        <ul>
                            <li>Click on words sent by the AI that you don't understand to get translations.</li>
                            <li>Engage in conversations based on scenarios to practice your language skills.</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Feedback on Input:</strong>
                        <ul>
                            <li>Click the 'Get Feedback' button to receive feedback on the correctness of your messages.</li>
                            <li>Use this feature to improve your language accuracy and learning.</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Listening to AI Responses:</strong>
                        <ul>
                            <li>Experience the AI bot's responses audibly with OpenAI's Text-to-Speech (TTS) technology.</li>
                            <li>Enhances comprehension and listening skills in your target language.</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Speech-to-Text Feature:</strong>
                        <ul>
                            <li>Use OpenAI Whisper's speech-to-text feature by clicking on the microphone label.</li>
                            <li>Convert your spoken words into text for an interactive conversational experience.</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Manage Your Vocabulary:</strong>
                        <ul>
                            <li>Add new words or phrases to your Saved Words manually.</li>
                            <li>Keep track of new words learned during conversations.</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Review Words:</strong>
                        <ul>
                            <li>Use "Review Words" feature employing spaced repetition for efficient learning.</li>
                            <li>Enable Spaced Repetition Conversation Mode to integrate review words into conversations.</li>
                            <li>Turn off this mode if you prefer more natural conversations.</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Performance Tips:</strong>
                        <ul>
                            <li>Switch to GPT-4 for a more robust experience if GPT-3.5 underperforms.</li>
                        </ul>
                    </li>
                </ol>

                <h2>Additional Features</h2>
                <ul>
                    <li>
                        <strong>Help and Support:</strong>
                        <p>Access the Help section for assistance or questions about the app.</p>
                    </li>
                    <li>
                        <strong>Settings Customization:</strong>
                        <p>Customize the app settings to match your learning style and preferences.</p>
                    </li>
                </ul>

                <p>Enjoy your language learning adventure with our app! Whether you're a beginner or advancing your skills, this tool is designed to make language learning interactive, fun, and effective.</p>
                <Button onClick={onClose}>Close</Button>
            </Box>
        </Modal>
    );
};

export default HelpInstructionsModal;
