import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import MobileNavBar from "./MobileNavBar";
import './NavBar.css';

const NavBar = () => {
  const [hovered, setHovered] = useState(null);
  const [show, setShow] = useState(true);
  const [pastHero, setPastHero] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 900 : false
  );
  const lastScroll = useRef(0);

  const NAV_LINKS = [
    { label: "Mentorship", path: "/mentorship" },
    { label: "Conferences", path: "/conferences" },
    { label: "Home Lab", path: "/homelabs" },
    { label: "About", path: "/about" },
  ];

  const location = useLocation();
  const isHome = location.pathname === "/";
  const isMentorship = location.pathname === "/mentorship";
  const isConferences = location.pathname === "/conferences";
  const isHomelabs = location.pathname === "/homelabs";

  // Track viewport size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const delta = currentScroll - lastScroll.current;
      if (currentScroll < 60) {
        setShow(true);
      } else if (delta > 6) {
        setShow(false);
      } else if (delta < -6) {
        setShow(true);
      }
      setScrolled(currentScroll > 80);
      if (isConferences) {
        setPastHero(currentScroll > window.innerHeight * 0.4);
      }
      lastScroll.current = currentScroll;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isConferences]);

  useEffect(() => {
    if (!isHome && !isMentorship && !isConferences && !isHomelabs) {
      setPastHero(true);
      return;
    }
    if (isConferences) {
      setPastHero(false);
      return;
    }
    const heroSelector = isHome
      ? ".hero"
      : isMentorship
      ? ".mentorship-hero"
      : ".homelabs-hero";
    const hero = document.querySelector(heroSelector);
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [isHome, isMentorship, isConferences, isHomelabs]);

  // Render mobile navbar on small screens
  if (isMobile) {
    return <MobileNavBar navLinks={NAV_LINKS} pastHero={pastHero} show={show} />;
  }

  // Desktop navbar
  return (
    <nav className={`navbar ${show ? "nav-show" : "nav-hide"} ${pastHero ? "navbar--dark" : ""} ${scrolled ? "navbar--scrolled" : ""}`}>
      <Link to="/" className="sye-logo">
        SYELABS
        <div className="sye-logo-dots">
          <span />
          <span />
        </div>
      </Link>

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