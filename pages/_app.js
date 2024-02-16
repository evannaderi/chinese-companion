import ChatContainer from "../components/ChatContainer";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar"; 
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme/theme';
import styles from '../styles/index.module.css';
import Head from 'next/head';
import '../styles/global.css';

const Home = () => {
    return (
        <div class={styles.main}>
            <Head>
                <title>LinguaFluent AI</title> 
                {/* Any other meta tags you want can also go here */}
            </Head>
            <ThemeProvider theme={theme} style={styles.main}>
                <ChatContainer />
            </ThemeProvider>
        </div>
    );
}

export default Home;