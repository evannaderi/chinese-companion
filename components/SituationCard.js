import { createSituation } from "../services/openaiService";

const model = "gpt-3.5-turbo";

const SituationCard = ({ content, setSituation }) => {
    const makeSituation = async () => {
        const openAIResponse = await createSituation(model);
        setSituation(openAIResponse);
    };
    return (
        <div className="situation-card">
            <h3>Situation</h3>
            <p>{content}</p>
            <button onClick={makeSituation}>Create situation</button>
        </div>
    );
};

export default SituationCard;