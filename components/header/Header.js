import React from "react";
// import { useNavigate } from "react-router-dom";
import styles from "./header.module.scss";
import { useRouter } from "next/router";

export default function Header() {
  // const navigate = useNavigate();
  const router = useRouter();

  return (
    <header onClick={() => router.push("/")} className={styles.header}>
      <h1>playwhat</h1>
    </header>
  );
}
