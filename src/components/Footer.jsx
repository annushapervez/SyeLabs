import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const LINKS = [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/syelabs/" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
  ];

  return (
    <footer className="footer">
      <div className="footer-inner">

        <div className="footer-dots">
          <span />
          <span />
        </div>

        <div className="footer-right">
          <ul className="footer-links">
            {LINKS.map((link) => (
              <li key={link.label}>
                {link.to ? (
                  <Link to={link.to} className="footer-link">
                    {link.label}
                  </Link>
                ) : (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link"
                  >
                    {link.label}
                  </a>
                )}
              </li>
            ))}
          </ul>

          <span className="footer-copy">
            © {new Date().getFullYear()} SyeLabs
          </span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;