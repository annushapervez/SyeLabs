import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Footer from "../components/Footer";
import "./Homelabs.css";

function StaggeredFade({ text }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const variants = {
    hidden: { opacity: 0 },
    show: (i) => ({
      opacity: 1,
      transition: { delay: i * 0.08, duration: 0.4 },
    }),
  };

  return (
    <motion.h1
      ref={ref}
      className="homelabs-headline"
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      variants={variants}
    >
      {text.split(" ").map((word, i) => (
        <motion.span
          key={i}
          variants={variants}
          custom={i}
          style={{ display: "inline-block", marginRight: "0.25em" }}
        >
          {word}
        </motion.span>
      ))}
    </motion.h1>
  );
}

const TABS = ["All", "Networking", "Cloud", "Security", "Hardware", "Linux"];

const labItems = [
  {
    title: "Building Your First Home Lab",
    hoverTitle: "Everything you need to get started — hardware picks, network layout, and the mistakes worth avoiding from day one.",
    category: "Hardware",
    video: "/homelabs.mp4",
  },
  {
    title: "VLAN Segmentation from Scratch",
    hoverTitle: "Isolate your IoT devices, guests, and servers without buying enterprise gear. A practical walk through the setup.",
    category: "Networking",
    video: "/linkedin2.mp4",
  },
  {
    title: "Running Kubernetes on Bare Metal",
    hoverTitle: "Skip the cloud bill. Here's how to spin up a real Kubernetes cluster on old hardware sitting in your closet.",
    category: "Cloud",
    video: "/linkedin4.mp4",
  },
  {
    title: "Firewall & Intrusion Detection at Home",
    hoverTitle: "Set up pfSense and Suricata to monitor your home network traffic like a real SOC analyst.",
    category: "Security",
    image: "/robot.png",
  },
  {
    title: "Linux From Scratch: A Beginner's Guide",
    hoverTitle: "Build a working Linux system from the ground up. Slow, painful, and absolutely worth it.",
    category: "Linux",
    image: "/post1.png",
  },
  {
    title: "Rack Setup & Cable Management",
    hoverTitle: "Because a clean rack is a happy rack. Our approach to building a home server setup that doesn't look like chaos.",
    category: "Hardware",
    image: "/post2.png",
  },
];

function LabCard({ item }) {
  const ref = useRef(null);
  const videoRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });
  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = () => {
    setHovered(true);
    videoRef.current?.play();
  };
  const handleMouseLeave = () => {
    setHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <motion.div
      ref={ref}
      className="lab-card"
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.25, 0, 0, 1] }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="lab-card-media">
        {item.video ? (
          <video ref={videoRef} src={item.video} muted loop playsInline />
        ) : (
          <img src={item.image} alt={item.title} />
        )}
        <AnimatePresence>
          {hovered && (
            <motion.div
              className="lab-card-tag-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <span className="lab-card-tag">{item.category}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="lab-card-info">
      <div className="lab-card-title-wrapper">
          <AnimatePresence mode="sync">
            <motion.p
              key={hovered && item.hoverTitle ? "hover" : "default"}
              className="lab-card-title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{ position: "absolute", top: 0, left: 0, right: 0 }}
            >
              {hovered && item.hoverTitle ? item.hoverTitle : item.title}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

function LabGrid() {
  const [activeTab, setActiveTab] = useState("All");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const filtered =
    activeTab === "All"
      ? labItems.slice(0, 6)
      : labItems.filter((i) => i.category === activeTab);

  return (
    <section className="homelabs-grid-section">
      <motion.div
        ref={ref}
        className="homelabs-tabs"
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        {TABS.map((tab, i) => (
          <>
            {i === 1 && <span key="dash" className="homelabs-tab-dash">—</span>}
            <button
              key={tab}
              className={`homelabs-tab ${activeTab === tab ? "homelabs-tab--active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          </>
        ))}
      </motion.div>

      <div className="homelabs-tab-divider" />

      <div className="homelabs-grid">
        <AnimatePresence mode="popLayout">
          {filtered.map((item) => (
            <LabCard key={item.title} item={item} />
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default function Homelabs() {
  return (
    <main className="homelabs">
      <section className="homelabs-hero">
        <StaggeredFade text="Build, break, and learn in spaces of your own. Where curiosity becomes experience, one experiment at a time." />
      </section>
      <LabGrid />
      <Footer />
    </main>
  );
}
