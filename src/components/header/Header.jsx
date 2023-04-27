import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./header.module.scss";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header onClick={() => navigate("/")} className={styles.header}>
      <h1>playwhat</h1>
    </header>
  );
}
