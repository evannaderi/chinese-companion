import Head from "next/head";
import { useState, useEffect } from "react";
import styles from "./index.module.css";
import ChineseSegment from "./components/ChineseSegment";

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [conversation, setConversation] = useState([]);
  const [shouldCallAPI, setShouldCallAPI] = useState(false);
  const [savedWords, setSavedWords] = useState([]);
  const [selectedAPI, setSelectedAPI] = useState("defaultAPI");

  const saveWord = (word) => {
    setSavedWords(prevWords => [...prevWords, word]);
    // Optionally save to local storage or send to backend here
  };

  const renderWords = () => {
    return savedWords.map((word, index) => (
      <div key={index}>
        <span>{word.character}</span> - <span>{word.translation}</span>
      </div>
    ));
  };

  useEffect(() => {
    if (!shouldCallAPI) return;

    const callAPI = async () => {
      let apiURL;
      switch(selectedAPI) {
        case "alternativeAPI":
          apiURL = "/api/dawei";
          break;
        // Add more cases if there are more APIs
        default:
          apiURL = "/api/generate";
      }

      try {
        const response = await fetch(apiURL, {
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
        setConversation(prevConversation => [
          ...prevConversation,
          { type: "assistant", text: `${data.result}`, loading: true },
        ]);
        setUserInput("");
      } catch (error) {
        console.error(error);
        alert(error.message);
      }

      // Reset the shouldCallAPI flag
      setShouldCallAPI(false);
    };

    callAPI();
  }, [shouldCallAPI, selectedAPI]);

  const onSubmit = async (event) => {
    event.preventDefault();
  
    // Add the user's input to the conversation array
    setConversation(prevConversation => [...prevConversation, { type: "user", text: `${userInput}` }]);
  
    // Set the flag to trigger the API call
    setShouldCallAPI(true);
  };

  const renderTranslatedText = (text, isLoading) => {
    // If the translation is loading, return a placeholder or a loading spinner
    if (isLoading) {
      return <div>{text}</div>;
    }

    // Once the translation is ready, render it with the ChineseSegment component
    return <ChineseSegment text={text} saveWord={saveWord} />;
  };

  return (
    <div>
      <Head>
        <title>Chinese Companion</title>
        <link rel="icon" href="/dog.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
      </Head>

      <main className={styles.main}>
        <div clasName={styles.chatContainer}>
          
        </div>
        <h3>Chinese Companion</h3>
        <div className={styles.apiSelector}>
          <label htmlFor="api-select">Choose a mode:</label>
          <select
            id="api-select"
            value={selectedAPI}
            onChange={(e) => setSelectedAPI(e.target.value)}
          >
            <option value="defaultAPI">WordReinforcer</option>
            <option value="alternativeAPI">Dawei the foodie</option>
            {/* Add more options for additional APIs */}
          </select>
        </div>
        <div className={styles.chatBox}>
          {conversation.map((entry, index) => {
            if (entry.type == "assistant") {
              console.log("returning");
              return (
                <div key={index} className={`${styles.chatEntry} ${styles["bot"]}`}>
                  {renderTranslatedText(entry.text)}
                </div>
              );
            } else {
              return (
                <div key={index} className={`${styles.chatEntry} ${styles["user"]}`}>
                  {entry.text}
                </div>
              );
            }
          })}
        </div>
        <form onSubmit={onSubmit} class="input-form">
          <div class="input-frame">
            <input
              type="text"
              name="message"
              placeholder="Type Something (try 你好)"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <input type="submit" value="Send" />
          </div>
        </form>
        <div className={styles.savedWordsContainer}>
            <h4>Saved Words</h4>
            {renderWords()}
        </div>
      </main>
    </div>
  );
}
