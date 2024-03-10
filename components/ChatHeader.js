import styles from './styles/ChatHeader.module.css';
import { useEffect, useState } from 'react';

const ChatHeader = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        console.log("isMobile: ", isMobile);
    }, [isMobile]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className={styles.chatHeader}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src="/LinguaFluent_AI.png" alt="LinguaFluent AI Logo" style={{ width: isMobile ? '30px' : '50px', height: isMobile ? '30px' : '50px', marginLeft: '10px', marginRight: '20px', borderRadius: '50%' }} />
            </div>
            {/* Additional info like model name, settings button, etc. */}
            <h3 style={{ fontWeight: 'bold', fontSize: isMobile ? '18px' : '24px', fontFamily: 'Arial' }}>LinguaFluent AI</h3>
        </div>
    );
};

export default ChatHeader;