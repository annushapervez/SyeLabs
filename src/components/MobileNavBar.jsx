import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./MobileNavBar.css";

const MobileNavBar = ({ navLinks, pastHero, show }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <nav className={`mobile-nav ${show ? "mobile-nav--show" : "mobile-nav--hide"} ${pastHero ? "mobile-nav--dark" : ""} ${menuOpen ? "mobile-nav--menu-open" : ""}`}>
        <Link to="/" className="mobile-nav-logo">
          SYELABS
          <div className="mobile-nav-logo-dots">
            <span />
            <span />
          </div>
        </Link>

        <button
          className={`mobile-nav-burger ${menuOpen ? "mobile-nav-burger--open" : ""}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span className="mobile-nav-burger-line" />
          <span className="mobile-nav-burger-line" />
        </button>
      </nav>

      <div className={`mobile-nav-panel ${menuOpen ? "mobile-nav-panel--open" : ""}`}>
        <ul className="mobile-nav-links">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link to={link.path} className="mobile-nav-link">
                {link.label}
              </Link>
            </li>
          ))}

          <li className="mobile-nav-dash" aria-hidden="true" />

          <li>
            <a href="https://www.linkedin.com/company/syelabs/" target="_blank" rel="noreferrer" className="mobile-nav-link">
              LinkedIn
            </a>
          </li>
          <li>
            <a href="https://instagram.com/" target="_blank" rel="noreferrer" className="mobile-nav-link">
              Instagram
            </a>
          </li>
        </ul>
      </div>
    </>
  );
};

export default MobileNavBar;