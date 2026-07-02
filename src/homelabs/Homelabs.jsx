import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import Footer from "../components/Footer";
import "./Homelabs.css";

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth <= breakpoint
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);
  return isMobile;
}

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

const galleryScenes = [
  { image: "/kitchen.jpg",   scene: "A busy kitchen line",  concept: "Pipelines & queues" },
    { image: "/stadium.jpg",   scene: "A sold-out stadium",   concept: "Load balancing" },
  { image: "/subway.jpg",    scene: "The subway map",       concept: "Graph traversal" },
   { image: "/traffic.jpg",   scene: "Rush-hour traffic",    concept: "Routing & scheduling" },
       { image: "/golf.jpg",      scene: "A golf course at dawn", concept: "Distributed systems" },
  { image: "/kitchen.jpg",   scene: "A busy kitchen line",  concept: "Pipelines & queues" },
];

function ScrollGallery({ scenes = galleryScenes }) {
  const ref = useRef(null);
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  const doubled = [...scenes, ...scenes];

  return (
    <section ref={ref} className="scroll-gallery">
     {isMobile ? (
  <div className="scroll-gallery-track scroll-gallery-track--auto">
    {doubled.map((s, i) => (
      <figure className="scroll-gallery-item" key={i}>
        <img src={s.image} alt={s.scene} />
        <figcaption className="scroll-gallery-caption">
          <span className="scroll-gallery-scene">{s.scene}</span>
          <span className="scroll-gallery-concept">{s.concept}</span>
        </figcaption>
      </figure>
    ))}
  </div>
) : (
  <motion.div className="scroll-gallery-track" style={{ x }}>
    {scenes.map((s, i) => (
      <figure className="scroll-gallery-item" key={i}>
        <img src={s.image} alt={s.scene} />
        <figcaption className="scroll-gallery-caption">
          <span className="scroll-gallery-scene">{s.scene}</span>
          <span className="scroll-gallery-concept">{s.concept}</span>
        </figcaption>
      </figure>
    ))}
  </motion.div>
)}
    </section>
  );
}

const labHighlight = {
  title: "How It's All Connected",
  author: "SyeLabs Team",
  tags: ["Series", "Coming Soon"],
  body: "A new video series launching soon! Where everyday experiences become lessons in tech. From football stadiums to golf courses, we're finding distributed systems, load balancing, and engineering principles hiding in plain sight. The world is built on the same ideas we build with!",
  image: "/linkedin3.png",
};
const TABS = ["All","Architecture of Homelab","OpenShift","AI Basics", "Tools"];

const labItems = [
  {
    title: "KubeVirt for VMs",
    hoverTitle: "VMs don't have to live outside the Kubernetes ship. See how KubeVirt brings them aboard — no conversion needed.",
    category: "OpenShift",
    image: "/kube.png",
    comingSoon: true,
  },
    {
    title: "What is Data?",
    hoverTitle: "Data is the foundation AI builds on. We unpack what data is, what makes it useful, and why accuracy is the difference between intelligence and noise.",
    category: "AI Basics",
    image: "/data.png",
    comingSoon: true,
  },
  {
    title: "ISO Install Tutorial",
    hoverTitle: "Turn a USB drive into a bootable hypervisor installer. a step-by-step walkthrough covering architecture choices, USB prep, and getting your server to boot.",
    category: "Architecture of Homelab",
    image: "/iso.png",
    comingSoon: true,
  },
];



function LabCard({ item }) {
  const ref = useRef(null);
  const videoRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });
  const [hovered, setHovered] = useState(false);
  const isMobile = useIsMobile();

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
     onMouseEnter={ isMobile ? undefined : handleMouseEnter}
      onMouseLeave={isMobile ? undefined : handleMouseLeave}
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
              {item.comingSoon && (
                <span className="lab-card-tag-coming-soon">Coming Soon</span>
              )}
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

function LabPostCard({ post }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.25 });

  return (
    <motion.div
      ref={ref}
      className="lab-post-card"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <h2 className="lab-post-card-title">{post.title}</h2>
      <p className="lab-post-card-author">by {post.author}</p>
      <div className="lab-post-card-tags">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className={tag === "Coming Soon" ? "lab-post-tag-coming-soon" : "lab-post-tag"}
          >
            {tag}
          </span>
        ))}
      </div>
      <p className="lab-post-card-body">{post.body}</p>
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

      <div className="homelabs-load-more">
        <span className="homelabs-load-more-label">Load More</span>
      </div>
    </section>
  );
}

function LabNewsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error

  const KIT_FORM_ID = "9611773";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");

    try {
      const formData = new FormData();
      formData.append("email_address", email);

      const res = await fetch(
        `https://app.kit.com/forms/${KIT_FORM_ID}/subscriptions`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Subscribe failed");

      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <section className="lab-newsletter-section">
      <div className="lab-newsletter-card">
        <div className="lab-newsletter-left">
          <h2 className="lab-newsletter-title">Get dispatches from the lab</h2>
          <p className="lab-newsletter-sub">
            Every month, we share what we're building, breaking, and learning. Sign up if you dare.
          </p>
          <form className="lab-newsletter-form" onSubmit={handleSubmit}>
            <input
              className="lab-newsletter-input"
              type="email"
              placeholder="yourname@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "submitting" || status === "success"}
              required
            />
            <button
              className="lab-newsletter-btn"
              type="submit"
              disabled={status === "submitting" || status === "success"}
            >
              {status === "submitting"
                ? "Signing up..."
                : status === "success"
                ? "You're in"
                : "Sign me up"}
            </button>
          </form>

          {status === "error" && (
            <p className="lab-newsletter-message">
              Something went wrong. Try again?
            </p>
          )}

          <p className="lab-newsletter-disclaimer">
            We'll never share your details. By signing up, you agree to receive communications from SyeLabs.
          </p>
        </div>
      </div>
    </section>
  );
}

function LabClosingLines({ lines, className }) {
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
        <span key={lineIdx} className={`lab-closing-line-${lineIdx + 1}`}>
          {line.split(" ").map((word) => {
            const i = wordIndex++;
            return (
              <motion.span
                key={i}
                custom={i}
                variants={variants}
                style={{ display: "inline-block", marginRight: "0.25em" }}
              >
                {word}
              </motion.span>
            );
          })}
          {lineIdx < lines.length - 1}
        </span>
      ))}
    </motion.h1>
  );
}

function HomelabsClosing() {
  const closingZoneRef = useRef(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const zone = closingZoneRef.current;
      if (!zone) return;
      const scrolled = -zone.getBoundingClientRect().top;
      setIsDark(Math.max(0, scrolled - 100) > 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="lab-closing">
      <div className="lab-closing-zone" ref={closingZoneRef}>
        <div className="lab-closing-sticky">
          <div className="lab-closing-phrase">
            <LabClosingLines
              className={isDark ? "lab-closing-text light-text" : "lab-closing-text dark-text"}
              lines={["We believe technology should be understood, not just used.",
                 "Whether you're building your first homelab or exploring complex architectures, every experiment is another opportunity to see how it's all connected."]}
  
              
            />
          </div>
        </div>
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
      <ScrollGallery />
      <section className="lab-highlight-section">
        <LabPostCard post={labHighlight} />
      </section>
      <LabGrid />
      <LabNewsletter />
      <HomelabsClosing />
      <Footer />
    </main>
  );
}
