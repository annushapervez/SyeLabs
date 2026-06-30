import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import "./Final.css";

function StaggeredLines({ lines, className }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const variants = {
    hidden: { opacity: 0 },
    show: (i) => ({
      opacity: 1,
      transition: { delay: i * 0.08, duration: 0.4 },
    }),
  };

  let wordIndex = 0;

  return (
    <motion.h1
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
    >
      {lines.map((line, lineIdx) => (
        <span
          key={lineIdx}
          className={`line-${lineIdx + 1}`}
        >
          {line.split(" ").map((word) => {
            const i = wordIndex++;
            return (
              <motion.span
                key={i}
                custom={i}
                variants={variants}
                style={{
                  display: "inline-block",
                  marginRight: "0.25em",
                }}
              >
                {word}
              </motion.span>
            );
          })}
        </span>
      ))}
    </motion.h1>
  );
}

const Final = () => {
  const [isDarkZone, setIsDarkZone] = useState(false);
  const zoneRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const zone = zoneRef.current;
      if (!zone) return;

      const scrolled = -zone.getBoundingClientRect().top;
      const adjustedScroll = Math.max(0, scrolled - 100);

      const threshold = 100; 
      setIsDarkZone(adjustedScroll > threshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="final">
      <div className="final-zone" ref={zoneRef}>
        <div className="final-sticky">
          <div className="final-phrase">
            <StaggeredLines
  className={isDarkZone ? "light-text" : "dark-text"}
  lines={[
    "All the pieces of the journey, brought into one place.",
    "See how we bring together real experiences, practical knowledge, and the people behind it all — turning curiosity into clarity, and interest into something you can actually build."
  ]}
/>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Final;