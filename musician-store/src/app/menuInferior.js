"use client";
import styles from "./menuInferior.module.css";
import { useState } from "react";
import Login from "./login";
import MessageFormulario from "./messageFormulario";
export default function MenuInferior() {
  const [renderLog, setRenderLog] = useState(false);
  const [message, setMessage] = useState(false);

  const toggleMessage = () => {
    setMessage(!message);
  };

  return (
    <>
      {renderLog ? <Login setRenderLog={setRenderLog} /> : <></>}
      {message ? <MessageFormulario /> : <></>}
      <div className={styles.container}>
        <div className={styles.menusanduiche}>
          <img src="/burgermenu.svg"></img>
        </div>
        <div className={styles.cart}>
          <img src="/cart.svg"></img>
        </div>
        <button className={styles.digitar} onClick={toggleMessage}>
          <img src="/notepad.svg"></img>
        </button>
        <div className={styles.artistas}>
          <img src="/artists.svg"></img>
        </div>
        <div className={styles.usuario}>
          <img src="/user.svg"></img>
        </div>
      </div>
    </>
  );
}
