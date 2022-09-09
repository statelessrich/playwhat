import React from "react";
import styles from "./app.module.scss";
import { Routes } from "react-router-dom";
import routes from "./utils/routes";
import { Provider } from "./utils/Context";
import ScrollToTop from "./utils/ScrollToTop";
import Header from "./components/header/Header";

function App() {
  return (
    <Provider>
      <div className={styles.app}>
        <Header />

        <ScrollToTop>
          <Routes>{routes}</Routes>
        </ScrollToTop>

        <footer>developed by Richard Pires</footer>
      </div>
    </Provider>
  );
}

export default App;
