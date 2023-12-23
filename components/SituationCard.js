import { createSituation } from "../services/openaiService";
import { useState } from "react";
import getRandomNoun from "../utils/getRandomNoun";
import { Button, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import styles from "./styles/Cards.module.css";
import getDefaultSituations from "../utils/defaultSituations";

const model = "gpt-4-1106-preview"; // more advanced model

const SituationCard = ({ content, setSituation, useSituation, customVocab, setCustomVocab, aiCharName, userCharName }) => {
    const [isSituationUsed, setIsSituationUsed] = useState(false);
    const [selectedDefaultSituation, setSelectedDefaultSituation] = useState("");
    const defaultSituations = getDefaultSituations(userCharName, aiCharName);

    const handleSelectChange = (event) => {
        const selectedTitle = event.target.value;
        const selectedDialogue = defaultSituations.find(situation => situation.title === selectedTitle)?.dialogue;
        setSelectedDefaultSituation(selectedTitle);
        setSituation(selectedDialogue);
    };

    const makeSituation = async () => {
        const word = getRandomNoun();
        console.log("word: ", word);
        const openAIResponse = await createSituation(word, model);
        setSituation(openAIResponse);
    };

    const handleUseSituation = () => {
        setIsSituationUsed(true);
        useSituation();
    };

    return (
        <div className={styles.situationCard}>
            <FormControl fullWidth margin="normal">
                <InputLabel>Default Situations</InputLabel>
                <Select
                    value={selectedDefaultSituation}
                    onChange={handleSelectChange}
                    disabled={isSituationUsed}
                >
                    {defaultSituations.map((situation, index) => (
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
                placeholder="Enter your situation here..." 
            />
            <TextField
                label="Custom vocab" // Floating label
                fullWidth
                variant="outlined"
                margin="normal"
                placeholder="Enter your custom vocab here..."
                value={customVocab}
                onChange={(e) => setCustomVocab(e.target.value)}
                disabled={isSituationUsed}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={makeSituation}
                disabled={isSituationUsed}
                style={{ margin: '5px' }}
            >
                Random situation
            </Button>
            <Button
                variant="contained"
                color="secondary"
                onClick={handleUseSituation}
                disabled={isSituationUsed}
                style={{ margin: '5px' }}
            >
                Use situation
            </Button>
        </div>
    );
};

export default SituationCard;