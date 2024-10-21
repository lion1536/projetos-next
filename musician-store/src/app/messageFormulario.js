import styles from "./messageFormulario.module.css";
import { useState } from "react";

export default function MessageFormulario() {
  const [postMessage, setMessageContent] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/data/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: postMessage,
        }),
      });

      if (response.ok) {
        console.log("Message submitted successfully");
        setMessageContent("");
      } else {
        console.error("Failed to submit message");
      }
    } catch (error) {
      console.error("Error submitting message:", error);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <form onSubmit={handleSubmit} className={styles.containerfilho}>
          <textarea
            type="text"
            placeholder="Digite sua mensagem"
            className={styles.textarea1}
            value={postMessage}
            onChange={(e) => setMessageContent(e.target.value)}
          ></textarea>
          <button type="submit" className={styles.enviar}>
            Enviar
          </button>
        </form>
      </div>
    </>
  );
}
