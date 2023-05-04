import { useRouter } from "next/router";
import { useEffect } from "react";
// import { useLocation } from "react-router";

// scrolls to top of page on route change
const ScrollToTop = (props) => {
  const router = useRouter();
  const { pathname } = router;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return <>{props.children}</>;
};

export default ScrollToTop;
