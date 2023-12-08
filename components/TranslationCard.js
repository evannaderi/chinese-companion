const TranslationCard = ({ title, content }) => {
    return (
        <div className="info-card">
            <h3>{title}</h3>
            <p>{content}</p>
        </div>
    );
};

export default TranslationCard;