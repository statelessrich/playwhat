import React from "react";
import styles from "./app.module.scss";
import { Routes, useNavigate } from "react-router-dom";
import routes from "./utils/routes";
import { Provider } from "./utils/Context";
import ScrollToTop from "./utils/ScrollToTop";

function App() {
  const navigate = useNavigate();

  return (
    <Provider>
      <div className={styles.app}>
        <header onClick={() => navigate("/")}>
          <h1>playwhat</h1>
        </header>

        <ScrollToTop>
          <Routes>{routes}</Routes>
        </ScrollToTop>

        <footer>developed by Richard Pires</footer>
      </div>
    </Provider>
  );
}

export default App;
