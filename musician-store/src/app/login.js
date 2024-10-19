import styles from "./login.module.css";
import { useState } from "react";
import { useRouter } from "next/router";
import CriarConta from "./criarConta";

export default function Login() {
  const [account, setAccount] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });
      setAccount(true);
      const data = await response.json();
      if (response.ok) {
        alert("Bem-vindo");
        window.location.reload();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      {account ? <CriarConta setAccount={setAccount} /> : <></>}
      <div className={styles.container}>
        <div className={styles.vinil}>
          <img src="/dj.svg"></img>
        </div>
        <div className={styles.fechar}>
          <img src="/close.svg"></img>
        </div>
        <form onSubmit={handleSignup} className={styles.containerfilho}>
          <p>Email de usuário</p>
          <input
            type="email"
            placeholder="Digite seu email"
            className={styles.input1}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <p>Senha</p>
          <input
            type="password"
            placeholder="Digite sua senha"
            className={styles.input1}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <div className={styles.go}>
            <button type="submit" className={styles.entrarbutton}>
              Entrar
            </button>
          </div>
        </form>
        <div className={styles.cadastro}>
          <p>
            Não tem uma conta?
            <span className={styles.conta} onClick={() => setAccount(true)}>
              Criar uma
            </span>
          </p>
        </div>
      </div>
    </>
  );
}
