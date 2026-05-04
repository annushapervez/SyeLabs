import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import "./Hero.css";

const words = ["Conferences", "Mentorship", "Home Labs"];

const phrases = [
  { main: "Designed around", highlight: true },
  { main: "We're focused on bridging the gap between discovery, access, and growth in tech." },
];

const fadeVariants = {
  hidden: { opacity: 0 },
  show: (i) => ({
    opacity: 1,
    transition: { delay: i * 0.08, duration: 0.4 },
  }),
};

function StaggeredFade({ text, visible, startIndex = 0 }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <motion.span
          key={i}
          custom={startIndex + i}
          variants={fadeVariants}
          initial="hidden"
          animate={visible ? "show" : "hidden"}
          style={{ display: "inline-block", marginRight: "0.3em" }}
        >
          {word}
        </motion.span>
      ))}
    </>
  );
}

const Hero = () => {
  const [step, setStep] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const zoneRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % words.length);
        setAnimating(false);
      }, 400);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const zone = zoneRef.current;
          if (!zone) return;
          const scrolled = -zone.getBoundingClientRect().top;
          const adjustedScroll = Math.max(0, scrolled - 100);
          const idx = Math.min(
            Math.max(Math.floor(adjustedScroll / 300), 0),
            phrases.length - 1
          );
          setStep(idx);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="hero">
      <div className="hero-zone" ref={zoneRef}>
        <div className="hero-sticky">
          {phrases.map((phrase, i) => {
            const isVisible = i === step;
            return (
              <div
                key={i}
                className={`hero-phrase ${i === 1 ? "second-phrase" : ""} ${
                  i === step ? "visible" : i < step ? "exiting" : "hidden"
                }`}
              >
                <h1>
                  {i === 0 && (
                    <>
                      <StaggeredFade text="Designed around" visible={isVisible} startIndex={0} />

                      <br />

                      <motion.span
                        custom={2}
                        variants={fadeVariants}
                        initial="hidden"
                        animate={isVisible ? "show" : "hidden"}
                        className={`cycling-word ${animating ? "fade-out" : "fade-in"}`}
                        style={{ display: "inline-block", marginRight: "0.3em" }}
                      >
                        {words[wordIndex]}
                      </motion.span>

                      <br />

                      <StaggeredFade text="to help curious minds grow." visible={isVisible} startIndex={3} />
                    </>
                  )}

                  {i === 1 && (
                    <StaggeredFade text={phrase.main} visible={isVisible} startIndex={0} />
                  )}
                </h1>
              </div>
            );
          })}

          <Link to="/about">
            <button className={`hero-btn ${step === 1 ? "second-btn" : ""}`}>
              Learn more
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;