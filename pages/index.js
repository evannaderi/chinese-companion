import ChatContainer from "../components/ChatContainer";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar"; 
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme/theme';
import styles from '../styles/index.module.css';

const Home = () => {
    return (
        <div class={styles.main}>
            <ThemeProvider theme={theme} style={styles.main}>
                <ChatContainer />
            </ThemeProvider>
        </div>
    );
}

export default Home;