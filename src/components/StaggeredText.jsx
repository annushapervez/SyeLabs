import { motion, useInView } from "framer-motion";
import { useRef } from "react";

function StaggeredLine({ text }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.06, // 👈 controls stagger speed
      },
    },
  };

  const word = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.span
      ref={ref}
      variants={container}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      style={{ display: "inline-block" }}
    >
      {text.split(" ").map((w, i) => (
        <motion.span
          key={i}
          variants={word}
          style={{
            display: "inline-block",
            marginRight: "0.3em",
          }}
        >
          {w}
        </motion.span>
      ))}
    </motion.span>
  );
}

export default StaggeredLine;