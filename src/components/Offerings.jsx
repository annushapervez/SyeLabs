import "./Offerings.css";
import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";

const offerings = [
  {
    title: "Mentorship",
    desc: "Guidance from people who've navigated the industry. Get real advice, real connections, and a clearer path forward.",
    tags: ["Career guidance", "Industry access"],
    hoverColor: "#f2faff",
    video: "mentorship.mp4",
    visualBg: "#5a4334",
    link: "/mentorship",
  },
  {
    title: "Conferences",
    desc: "Step inside the conference experience. From real conversations to practical advice, see how people actually show up, connect, and make the most of it.",
    tags: ["Networking", "Talks", "Workshops"],
    hoverColor: "#fcf7ff",
    video: "conferences.mp4",
    visualBg: "var(--rust)",
      link: "/conferences",

  },
  {
    title: "Home Labs",
    desc: "Hands-on learning environments you can build and run from anywhere. Practice real skills without needing enterprise resources.",
    tags: ["Hands-on", "Self-paced", "Real tools"],
    hoverColor: "#fbf9eb",
    video: "homelabs.mp4",
    visualBg: "#1a1208",
    link: "/homelabs",

  },
];

function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const hasCoarsePointer = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    const hasTouchSupport = "ontouchstart" in window || navigator.maxTouchPoints > 0;

    setIsTouch(hasCoarsePointer && hasTouchSupport);
  }, []);

  return isTouch;
}

function StaggeredBody({ text, className }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.02,
      },
    },
  };

  const word = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.25, ease: "easeOut" },
    },
  };

  return (
    <motion.p
      ref={ref}
      className={className}
      variants={container}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
    >
      {text.split(" ").map((w, i) => (
        <motion.span
          key={i}
          variants={word}
          style={{ display: "inline-block", marginRight: "0.25em" }}
        >
          {w}
        </motion.span>
      ))}
    </motion.p>
  );
}

// Desktop: relies purely on the native `autoPlay` attribute, unchanged.
// Touch devices: additionally forces `.play()` once the video scrolls into
// view, since mobile browsers (esp. iOS Low Power Mode) often ignore the
// bare autoPlay attribute and fall back to showing a play button.
function OfferingVideo({ src }) {
  const videoRef = useRef(null);
  const isTouch = useIsTouchDevice();

  useEffect(() => {
    if (!isTouch || !videoRef.current) return;

    const el = videoRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {});
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isTouch]);

  return (
    <video
      ref={videoRef}
      className="offering-img"
      src={src}
      autoPlay
      loop
      muted
      playsInline
      webkit-playsinline="true"
      preload="auto"
    />
  );
}

const Offerings = ({ onHoverColor }) => {
  const defaultBg = "#F2E8D9"; 

  return (
    <section className="offerings">
        <div className="offerings-header">
    <h2 className="offerings-headline">
      How we help you grow
    </h2>
  </div>
      {offerings.map((item, i) => (
<div
  key={i}
  className="offering"
  onMouseEnter={() => {
    document.body.style.background = item.hoverColor;
  }}
  onMouseLeave={() => {
    document.body.style.background = "#ffffff"; 
  }}
>          
          <div className="offering-left">
            <h2 className="offering-title">{item.title}</h2>
<StaggeredBody
  text={item.desc}
  className="offering-desc"
/>
            <div className="offering-tags">
              {item.tags.map((tag, j) => (
                <span key={j} className="offering-tag">{tag}</span>
              ))}
            </div>

            {item.link
              ? <Link to={item.link} className="offering-link">Learn more →</Link>
              : <a href="#" className="offering-link">Learn more →</a>
            }
          </div>

<div
  className="offering-right"
>
            <OfferingVideo src={`/${item.video}`} />

            <div className="offering-glass" />

            <span className="offering-visual-title">
              {item.title}
            </span>
          </div>

        </div>
      ))}
    </section>
  );
};

export default Offerings;