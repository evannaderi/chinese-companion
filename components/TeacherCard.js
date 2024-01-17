import { useState } from "react";
import { Button, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import styles from "./styles/Cards.module.css";
import { createTeachingSession } from "../services/openaiService";
import getRandomTopic from "../utils/getRandomTopic";
import getDefaultTopics from "../utils/defaultTopics";

const TeacherCard = ({ content, setTeachingSession, useTeachingSession, customVocab, setCustomVocab, aiCharName, userCharName, model, language }) => {
    const [isTeachingSessionUsed, setIsTeachingSessionUsed] = useState(false);
    const [selectedDefaultTopic, setSelectedDefaultTopic] = useState("");
    const defaultTopics = getDefaultTopics(aiCharName, userCharName, language);

    const handleTopicChange = (event) => {
        const selectedTitle = event.target.value;
        setSelectedDefaultTopic(selectedTitle);
        setTeachingSession(defaultTopics.find(topic => topic.title === selectedTitle)?.content);
    };

    const makeTeachingSession = async () => {
        const topic = getRandomTopic();
        console.log("Topic: ", topic);
        const openAIResponse = await createTeachingSession(topic, model, aiCharName, userCharName);
        setTeachingSession(openAIResponse);
    };

    const handleUseTeachingSession = () => {
        if (content.trim() === '') {
            alert("Please enter a teaching topic first!");
            return;
        }
        setIsTeachingSessionUsed(true);
        useTeachingSession();
    };

    return (
        <div className={styles.teacherCard}>
            <FormControl fullWidth margin="normal">
                <InputLabel>Select a teaching topic</InputLabel>
                <Select
                    value={selectedDefaultTopic}
                    onChange={handleTopicChange}
                    disabled={isTeachingSessionUsed}
                >
                    {defaultTopics.map((topic, index) => (
                        <MenuItem key={index} value={topic.title}>
                            {topic.title}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField
                fullWidth
                multiline
                rows={4}
                value={content}
                onChange={(e) => setTeachingSession(e.target.value)}
                variant="outlined"
                margin="normal"
                disabled={isTeachingSessionUsed}
                placeholder={`Enter a custom teaching topic here... (with your character names ${aiCharName} (AI) and ${userCharName} (you)). Change your character names in the settings!`}
            />
            <TextField
                fullWidth
                variant="outlined"
                margin="normal"
                placeholder="Optionally add custom vocab here..."
                value={customVocab}
                onChange={(e) => setCustomVocab(e.target.value)}
                disabled={isTeachingSessionUsed}
            />
            <Button
                variant="contained"
                onClick={makeTeachingSession}
                disabled={isTeachingSessionUsed}
                style={{ margin: '5px', backgroundColor: 'darkred', color: 'white' }}
            >
                Get Random Topic
            </Button>
            <Button
                variant="contained"
                color="secondary"
                onClick={handleUseTeachingSession}
                disabled={isTeachingSessionUsed}
                style={{ margin: '5px', backgroundColor: 'transparent', color: 'black' }}
            >
                Start Teaching Session
            </Button>
        </div>
    );
};

export default TeacherCard;
