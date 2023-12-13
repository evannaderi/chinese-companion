import styles from './styles/Cards.module.css';

const TranslationCard = ({ title, content }) => {
    return (
        <div className={styles.translationCard}>
            <h3>{title}</h3>
            <p>{content}</p>
        </div>
    );
};

export default TranslationCard;