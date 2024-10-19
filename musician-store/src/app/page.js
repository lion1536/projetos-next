import Image from "next/image";
import styles from "./page.module.css";
import MenuSuperior from "./menuSuperior";
import MenuInferior from "./menuInferior";

export default function Home() {
  return (
    <>
      <MenuSuperior />
      <MenuInferior />
    </>
  );
}
