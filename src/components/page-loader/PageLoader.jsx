import React from "react";
import styles from "./page-loader.module.scss";

const PageLoader = () => {
  return (
    <div className={styles.pageLoader}>
      <h1>playwhat</h1>

      <div className={styles.ldsEllipsis}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default PageLoader;
