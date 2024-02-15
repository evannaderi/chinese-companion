import { createSituation } from "../services/openaiService";
import { useEffect, useState } from "react";
import getRandomNoun from "../utils/getRandomNoun";
import { Button, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import styles from "./styles/Cards.module.css";
import getDefaultSituations from "../utils/defaultSituations";

const model = "gpt-4-1106-preview"; // more advanced model
const SituationCard = ({ content, setSituation, useSituation, customVocab, setCustomVocab, aiCharName, userCharName, model }) => {
    const [isSituationUsed, setIsSituationUsed] = useState(false);
    const [selectedDefaultSituation, setSelectedDefaultSituation] = useState("");
    const [situations, setSituations] = useState([])

    useEffect(() => {
        // Initialize with default situations and attempt to append saved situations
        const initDefaultSituations = getDefaultSituations(userCharName, aiCharName);
        const savedSituations = JSON.parse(localStorage.getItem('savedSituations')) || [];
        const combinedSituations = [...initDefaultSituations, ...savedSituations];
        setSituations(combinedSituations);
    }, [userCharName, aiCharName]);

    const handleSelectChange = (event) => {
        const selectedTitle = event.target.value;
        const selectedDialogue = situations.find(situation => situation.title === selectedTitle)?.dialogue;
        setSelectedDefaultSituation(selectedTitle);
        setSituation(selectedDialogue);
    };

    const makeSituation = async () => {
        const word = getRandomNoun();
        console.log("word: ", word);
        const openAIResponse = await createSituation(word, model, aiCharName, userCharName);
        setSituation(openAIResponse);
    };

    const handleUseSituation = () => {
        if (content.trim() === '') {
            alert("Please enter a situation first!");
            return;
        }
        setIsSituationUsed(true);
        useSituation();
    };

    const saveSituationToDefaults = () => {
        if (content.trim() === '') {
            alert("Please enter a situation first!");
            return;
        }
    
        // Prompt the user for a custom title
        const customTitle = prompt("Enter a title for the new situation:", "Custom Situation");
        // Check if the user pressed "Cancel" or entered an empty title
        if (customTitle === null || customTitle.trim() === '') {
            alert("The situation must have a title to be saved.");
            return;
        }
    
        const newSituation = {
            title: customTitle, // Use the custom title provided by the user
            dialogue: content
        };
    
        // Retrieve existing saved situations or initialize an empty array if none
        const savedSituations = JSON.parse(localStorage.getItem('savedSituations')) || [];
        savedSituations.push(newSituation);
    
        // Save the updated array back to local storage
        localStorage.setItem('savedSituations', JSON.stringify(savedSituations));
    
        // Optionally, immediately reflect the change in the dropdown without a page reload
        setSituations([...situations, newSituation]);
    
        alert("Situation saved to defaults!");
    };
    
    

    return (
        <div className={styles.situationCard}>
            <FormControl fullWidth margin="normal">
                <InputLabel>First, select a situation or enter your own</InputLabel>
                <Select
                    value={selectedDefaultSituation}
                    onChange={handleSelectChange}
                    disabled={isSituationUsed}
                >
                    {situations.map((situation, index) => (
                        <MenuItem key={index} value={situation.title}>
                            {situation.title}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField
                fullWidth
                multiline
                rows={4}
                value={content}
                onChange={(e) => setSituation(e.target.value)}
                variant="outlined"
                margin="normal"
                disabled={isSituationUsed}
                placeholder={`Type any situation that you want to be in here. You MUST use two characters in your situation: the AI's name is ${aiCharName} and your name is ${userCharName}. Change your character names in the settings.`}
            />
            <TextField
                fullWidth
                variant="outlined"
                margin="normal"
                placeholder="Optionally add custom vocab that you want to integrate into the conversation here..."
                value={customVocab}
                onChange={(e) => setCustomVocab(e.target.value)}
                disabled={isSituationUsed}
            />
            <Button
                variant="contained"
                color="secondary"
                onClick={makeSituation}
                disabled={isSituationUsed}
                style={{ margin: '5px', backgroundColor: 'transparent', color: 'black'}}
            >
                Get Random situation
            </Button>
            <Button
                variant="contained"
                color="secondary"
                onClick={saveSituationToDefaults}
                disabled={isSituationUsed}
                style={{ margin: '5px', backgroundColor: 'transparent', color: 'black'}}
            >
                Save situation to defaults
            </Button>
            <Button
                variant="contained"
                color="primary"
                onClick={handleUseSituation}
                disabled={isSituationUsed}
                style={{ margin: '5px' }}
            >
                Start Conversation
            </Button>
            
        </div>
    );
};

export default SituationCard;