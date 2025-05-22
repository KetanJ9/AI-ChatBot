import { use, useState } from "react";
import styles from "./App.module.css";
import { Chat } from "./components/Chat/chat";
import { Controls } from "./components/Controls/Controls";
import { GoogleGenAI } from "@google/genai";
import { Loader } from "./components/Loader/Loader";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOOGLE_AI_API_KEY });

const chat = ai.chats.create({
  model: "gemini-2.0-flash",
  history: [],
});

function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  function addMessage(message) {
    setMessages((prevMessages) => [...prevMessages, message]);
  }
  async function handleContentSend(content) {
    addMessage({ content: content, role: "user" });
    setIsLoading(true);
    try {
      const result = await chat.sendMessage({ message: content });
      const response = result.text;
      addMessage({ content: response, role: "assistant" });
    } catch (error) {
      addMessage({
        content: "Sorry! I couldn't process your request. Please try again",
        role: "assistant",
      });
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className={styles.App}>
      { isLoading  && <Loader />}
      <header className={styles.Header}>
        <img className={styles.Logo} src="/chat-bot.png" />
        <h2 className={styles.Title}>AI Chatbot</h2>
      </header>
      <div className={styles.ChatContainer}>
        <Chat messages={messages} />
      </div>
      <Controls isDisabled={isLoading} onSend={handleContentSend} />
    </div>
  );
}

export default App;
