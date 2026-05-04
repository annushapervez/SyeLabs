import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();

useEffect(() => {
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 50);
}, [pathname]);

  return null;
}

export default ScrollToTop;