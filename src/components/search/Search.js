import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styles from "./search.module.scss";

export default function Search({ onInputChange, value }) {
  return (
    <div className={styles.search}>
      <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.magnifyingGlass} />
      {/* search input */}
      <input
        value={value}
        type="text"
        onChange={onInputChange}
        placeholder="Mario, Elden Ring, etc."
        className={styles.search}
      ></input>
      {/* <input type="submit" value="search" onClick={search}></input> */}
    </div>
  );
}
