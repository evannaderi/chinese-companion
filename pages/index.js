import Head from "next/head";
import { useState, useEffect } from "react";
import styles from "./index.module.css";
import ChineseSegment from "./components/ChineseSegment";

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [conversation, setConversation] = useState([]);
  const [shouldCallAPI, setShouldCallAPI] = useState(false);

  useEffect(() => {
    if (!shouldCallAPI) return;

    const callAPI = async () => {
      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: conversation }),
        });
    
        const data = await response.json();
    
        if (response.status !== 200) {
          throw data.error || new Error(`Request failed with status ${response.status}`);
        }
    
        // Add the bot's response to the conversation array
        setConversation(prevConversation => [...prevConversation, { type: "bot", text: `Lihua: ${data.result}`}]);
        setUserInput("");
      } catch (error) {
        console.error(error);
        alert(error.message);
      }

      // Reset the shouldCallAPI flag
      setShouldCallAPI(false);
    };

    callAPI();
  }, [shouldCallAPI]);

  const onSubmit = async (event) => {
    event.preventDefault();
  
    // Add the user's input to the conversation array
    setConversation(prevConversation => [...prevConversation, { type: "user", text: `Student: ${userInput}` }]);
  
    // Set the flag to trigger the API call
    setShouldCallAPI(true);
  };

  const renderTranslatedText = (text) => {
    return <ChineseSegment text={text} />;
  };

  return (
    <div>
      <Head>
        <title>Lihua Chat</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
  
        <h3>Chat with Lihua</h3>
        <div className={styles.chatBox}>
          {conversation.map((entry, index) => (
            <div key={index} className={`${styles.chatEntry} ${styles[entry.type]}`}>
              {renderTranslatedText(entry.text)}
            </div>
          ))}
        </div>
        <form onSubmit={onSubmit}>
          <div class="input-frame">
            <input
              type="text"
              name="message"
              placeholder="Type your message"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <input type="submit" value="Send" />
          </div>
        </form>
      </main>
    </div>
  );
}
