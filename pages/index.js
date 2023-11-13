import Head from "next/head";
import { useState, useEffect, useCallback } from "react";
import styles from "./index.module.css";
import ChineseSegment from "./components/ChineseSegment";

const initialText = "你好！你今天怎么样？"

const useAPI = async (shouldCallAPI, selectedAPI, conversation, setConversation, setUserInput, setShouldCallAPI, setLoading, setError, reinforcementWords) => {
  useEffect(() => {
    if (!shouldCallAPI) return;

    setLoading(true); // Start loading
    setError(null); // Reset error state

    const callAPI = async () => {
      const apiURL = selectedAPI === "alternativeAPI" ? "/api/dawei" : "/api/generate";

      try {
        const response = await fetch(apiURL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: conversation, reinforcement: reinforcementWords }),
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        setConversation(prev => [...prev, { type: "assistant", text: data.result }]);
        setUserInput("");
        
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false); // End loading
      }
    };

    callAPI();
    setShouldCallAPI(false);
  }, [shouldCallAPI, selectedAPI, conversation, setLoading, setError]);
};

const SavedWords = ({ savedWords }) => {
  return savedWords.map((word, index) => (
    <div key={index}>
      <span>{word.character}</span> - <span>{word.translation}</span>
    </div>
  ));
};

// const renderChatEntries = async (conversation, saveWord) => {
//   return conversation.map((entry, index) => (
//     <div key={index} className={`${styles.chatEntry} ${styles[entry.type]}`}>
//       {entry.type === "assistant" ? <ChineseSegment text={entry.text} saveWord={saveWord} /> : entry.text}
//     </div>
//   ));
// };

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [conversation, setConversation] = useState([]);
  const [shouldCallAPI, setShouldCallAPI] = useState(false);
  const [savedWords, setSavedWords] = useState([]);
  const [selectedAPI, setSelectedAPI] = useState("defaultAPI");
  const [reinforcementWords, setReinforcementWords] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(
    () => {
      setConversation(prev => [...prev, { type: "assistant", text: initialText }]);
      console.log(conversation);
    }, []
  )

  useAPI(shouldCallAPI, selectedAPI, conversation, setConversation, setUserInput, setShouldCallAPI, setLoading, setError, reinforcementWords);

  const saveWord = useCallback((word) => {
    setSavedWords(prevWords => [...prevWords, word]);
  }, []);

  const onSubmit = (event) => {
    event.preventDefault();
    setConversation(prev => [...prev, { type: "user", text: userInput }]);
    setShouldCallAPI(true);
  };

  const renderChatEntries = () => {
    return conversation.map((entry, index) => (
      <div key={index} className={`${styles.chatEntry} ${styles[entry.type]}`}>
        {entry.type === "assistant" ? <ChineseSegment text={entry.text} saveWord={saveWord} /> : entry.text}
      </div>
    ));
  };

  function exportInputValue() {
    const inputValue = reinforcementWords;
    return inputValue; // Just for demonstration

    // Assuming you have a module or function in another file where you want to use this value
    // You can import that function here and pass the inputValue to it
}

  return (
    <div>
      <Head>
        <title>Chinese Companion</title>
        <link rel="icon" href="/dog.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
      </Head>

      <main className={styles.main}>
        <div className={styles.chatContainer}>
          <label>Reinforcement words</label>
          <input type="text" id="name" name="name" onChange={(e) => setReinforcementWords(e.target.value)}></input>
          <button onclick="exportInputValue()">Export Value</button>
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
          {renderChatEntries()}
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
            <SavedWords savedWords={savedWords} />
        </div>
      </main>
    </div>
  );
}
