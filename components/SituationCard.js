import { createSituation } from "../services/openaiService";
import { useState } from "react";
import getRandomNoun from "../utils/getRandomNoun";
import { Button, TextField } from "@mui/material";
import styles from "./styles/Cards.module.css";

const model = "gpt-4-1106-preview"; // more advanced model

const SituationCard = ({ content, setSituation, useSituation }) => {
    const [isSituationUsed, setIsSituationUsed] = useState(false);

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
            <h3>Situation</h3>
            <TextField
                fullWidth
                multiline
                rows={4}
                value={content}
                onChange={(e) => setSituation(e.target.value)}
                variant="outlined"
                margin="normal"
                disabled={isSituationUsed}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={makeSituation}
                disabled={isSituationUsed}
                style={{ margin: '5px' }}
            >
                Generate situation
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