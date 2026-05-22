import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import './NavBar.css';

const NavBar = () => {
  const [hovered, setHovered] = useState(null);
  const [show, setShow] = useState(true);
  const [pastHero, setPastHero] = useState(false);
  const lastScroll = useRef(0);

  const NAV_LINKS = [
    { label: "Mentorship", path: "/mentorship" },
    { label: "Conferences", path: "/conferences" },
    { label: "Home Lab", path: "/" },
    { label: "About", path: "/about" },
  ];

  const location = useLocation();
  const isHome = location.pathname === "/";
  const isMentorship = location.pathname === "/mentorship";
  const isConferences = location.pathname === "/conferences";


  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (currentScroll > lastScroll.current) {
        setShow(false);
      } else {
        setShow(true);
      }

      if (isConferences) {
        setPastHero(currentScroll > window.innerHeight * 0.4);
      }

      lastScroll.current = currentScroll;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isConferences]);

  useEffect(() => {
    if (!isHome && !isMentorship && !isConferences) {
      setPastHero(true);
      return;
    }

    if (isConferences) return;

    const heroSelector = isHome ? ".hero" : ".mentorship-hero";
    const hero = document.querySelector(heroSelector);
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setPastHero(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, [isHome, isMentorship, isConferences]);

  return (
    <nav className={`navbar ${show ? "nav-show" : "nav-hide"} ${pastHero ? "navbar--dark" : ""}`}>
      
      {/* Logo */}
      <Link to="/" className="sye-logo">
        SYELABS
        <div className="sye-logo-dots">
          <span />
          <span />
        </div>
      </Link>

      {/* Links */}
      <ul className="sye-links">
        {NAV_LINKS.map((link) => (
          <li key={link.label}>
            <Link
              to={link.path}
              className={`sye-link${hovered === link.label ? " active" : ""}`}
              onMouseEnter={() => setHovered(link.label)}
              onMouseLeave={() => setHovered(null)}
            >
              {link.label}
            </Link>
          </li>
        ))}

        <div className="sye-divider" />

        {/* Socials */}
        <div className="socials">
          <li>
            <a href="https://www.linkedin.com/company/syelabs/" target="_blank" rel="noreferrer" className="sye-social-icon">
              <img src="/linkedin.png" alt="LinkedIn" className="social-icon-img" />
            </a>
          </li>
          <li>
            <a href="https://instagram.com/" target="_blank" rel="noreferrer" className="sye-social-icon">
              <img src="/instagram.png" alt="Instagram" className="social-icon-img" />
            </a>
          </li>
        </div>
      </ul>
    </nav>
  );
};

export default NavBar;