import { createSituation } from "../services/openaiService";
import { useState } from "react";
import getRandomNoun from "../utils/getRandomNoun";
import styles from "./styles/Cards.module.css";

const model = "gpt-4"; // more advanced model

const SituationCard = ({ content, setSituation, useSituation }) => {
    const [isSituationUsed, setIsSituationUsed] = useState(false);

    const makeSituation = async () => {
        const word = getRandomNoun();
        console.log("word: ", word);
        const openAIResponse = await createSituation(word, model);
        setSituation(openAIResponse);
    };

    const handleUseSitatuion = () => {
        setIsSituationUsed(true);
        useSituation();
    };

    return (
        <div className={styles.situationCard}>
            <h3>Situation</h3>
            <textarea 
                value={content} 
                onChange={(e) => setSituation(e.target.value)} 
                rows="4" 
                cols="50" 
                disabled={isSituationUsed} // Disable textarea if situation is used
            />
            <button onClick={makeSituation} disabled={isSituationUsed}>Generate situation</button>
            <button onClick={handleUseSitatuion} disabled={isSituationUsed}>Use situation</button>
        </div>
    );
};

export default SituationCard;