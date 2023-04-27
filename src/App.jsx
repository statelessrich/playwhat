import React, { Suspense } from "react";
import styles from "./app.module.scss";
import { Routes } from "react-router-dom";
import routes from "./utils/routes";
import { Provider } from "./utils/Context";
import ScrollToTop from "./utils/ScrollToTop";
import Header from "./components/header/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

function App() {
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      // show toast when user returns to app
      toast("Welcome back!", {
        position: toast.POSITION.BOTTOM_CENTER,
        toastId: "visible",
      });
    }
  });

  return (
    <Suspense fallback={<h1>potato</h1>}>
      <Provider>
        <QueryClientProvider client={queryClient}>
          <div className={styles.app}>
            <Header />

            <ToastContainer hideProgressBar closeOnClick autoClose={2000} />

            <ScrollToTop>
              <Routes>{routes}</Routes>
            </ScrollToTop>

            <footer>developed by Richard Pires</footer>
          </div>
        </QueryClientProvider>
      </Provider>
    </Suspense>
  );
}

export default App;
