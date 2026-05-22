import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import Footer from "../components/Footer";
import "./Conferences.css";

const conferencePosts = [
  {
    title: "Behind the Scenes at NVIDIA Conference 2025",
    author: "SyeLabs Team",
    tags: ["NVIDIA", "AI"],
    body: "SyeLabs takes you inside one of the biggest AI events of the year. From the show floor to the sessions, here's what it actually looks and feels like to be in the room where the industry is moving.",
    image: null,
    video: "/linkedin2.mp4",
    imageName: "nvidia-conference-2025",
  },
];

const conferenceGridItems = [
  {
    title: "Highlights from KubeCon 2024",
    hoverTitle: "Ever wondered what it's actually like to walk through a major tech conference as an insider? Here's your backstage pass.",
    video: "/linkedin6.mp4",
    link: "https://www.linkedin.com/feed/update/urn:li:activity:7389343590956679168",
  },
  {
    title: "Simple Networking Tips for Your First Conference",
    hoverTitle: "Here’s a quick tip to help you start conversations, meet new people, and feel more confident at your first conference.",
    video: "/linkedin7.mp4",
    objectPosition: "center",
    link:"https://www.linkedin.com/feed/update/urn:li:activity:7387260106825949184",
  },
  {
    title: "An Inside Look at KubeCon for First-Timers",
    hoverTitle: "Take a look back at our time at KubeCon 2024, from first impressions to standout moments, here’s a glimpse into the experience.",
    video: "/linkedin1.mp4",
    link: "https://www.linkedin.com/feed/update/urn:li:activity:7390146819768500225",
  },
];


const upcomingConference = {
  title: "AWS Summit New York City 2026",
  date: "June 17, 2026",
  location: "New York City",
  body: "SyeLabs is heading to AWS Summit NYC to explore what's actually working in AI, from real-world cloud adoption to practical strategies teams are using today. We'll be taking you inside the sessions, conversations, and innovations shaping the future.",
  highlights: [
    {
      title: "200+ Sessions",
      image: "/aws.jpg",
    },
    {
      title: "Hands-on Demos",
      image: "/aws2.jpg",
    },
    {
      title: "AI & Cloud Leaders",
      image: "/aws3.jpg",
    },
  ],
};

const gridContainer = {
  hidden: {},
  show: { transition: { duration: 1 } },
};

const gridItem = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const confCardVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

function PostCard({ post, i }) {
  const ref = useRef(null);
  const videoRef = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.25 });

  const handleMouseEnter = () => videoRef.current?.play();
  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <motion.div
      ref={ref}
      className="conf-post-card"
      variants={confCardVariants}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      transition={{ delay: i * 0.1 }}
      onClick={() => post.link && window.open(post.link, "_blank")}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="conf-post-card-left">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <h2 className="conf-post-card-title">{post.title}</h2>
        </div>
        <p className="conf-post-card-author">by {post.author}</p>
        <div className="conf-post-card-tags">
          {post.comingSoon && <span className="conf-post-tag-coming-soon">Coming Soon</span>}
          {post.tags.map((tag) => (
            <span className="conf-post-tag" key={tag}>{tag}</span>
          ))}
        </div>
        <p className="conf-post-card-body">{post.body}</p>
      </div>
      <div className="conf-post-card-image">
        {post.video ? (
          <video ref={videoRef} src={post.video} muted playsInline loop />
        ) : post.image ? (
          <img src={post.image} alt={post.imageName} />
        ) : (
          <div className="conf-post-card-image-placeholder" />
        )}
      </div>
    </motion.div>
  );
}

function GridCard({ item, i }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.25 });
  const videoRef = useRef(null);
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
      className="conference-card"
      variants={gridItem}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      transition={{ delay: i * 0.1 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => item.link && window.open(item.link, "_blank")}
      style={{ cursor: item.link ? "pointer" : "default" }}
    >
      <div className="conference-card-avatar">
        {item.video ? (
          <video
            ref={videoRef}
            src={item.video}
            muted
            loop
            playsInline
            style={{
              transform: item.zoom ? `scale(${item.zoom})` : "scale(1)",
              objectPosition: item.objectPosition ?? "top",
            }}
          />
        ) : (
          <span>{item.label.charAt(0)}</span>
        )}
      </div>
      <div className="conference-card-info">
<div className="conference-card-title-wrapper">
  <AnimatePresence mode="sync">
    <motion.p
      key={hovered && item.hoverTitle ? "hover" : "default"}
      className="conference-card-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{ position: "absolute", top: 0, left: 0 }}
    >
      {hovered && item.hoverTitle ? item.hoverTitle : item.title}
    </motion.p>
  </AnimatePresence>
</div>
      </div>
    </motion.div>
  );
}

function HighlightsList({ highlights }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const containerRef = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 200, damping: 25, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 200, damping: 25, mass: 0.5 });

  const handleMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <div
      className="upcoming-conf-highlights"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setActiveIndex(null)}
    >
      {highlights.map((h, i) => {
        const isActive = activeIndex === i;
        return (
          <div
            key={h.title}
            className={`upcoming-conf-highlight ${isActive ? "is-active" : ""}`}
            onMouseEnter={() => setActiveIndex(i)}
          >
            <div className="highlight-row">
              <motion.span
                className="highlight-bullet"
                animate={{
                  opacity: isActive ? 1 : 0,
                  scale: isActive ? 1 : 0.4,
                }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.p
                className="upcoming-conf-highlight-title"
                animate={{ x: isActive ? 15 : 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {h.title}
              </motion.p>
            </div>

          </div>
        );
      })}

<motion.div
  className="highlight-floating-preview"
  style={{ x: springX, y: springY }}
>
  <AnimatePresence>
    {activeIndex !== null && highlights[activeIndex].image && (
      <motion.img
        key="preview"
        src={highlights[activeIndex].image}
        alt={highlights[activeIndex].title}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />
    )}
  </AnimatePresence>
</motion.div>
    </div>
  );
}

function UpcomingConference() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.section
      ref={ref}
      className="upcoming-conf"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <h2 className="conferences-grid-title">Upcoming</h2>
      <div className="upcoming-conf-body">
        <div className="upcoming-conf-left">
          <h2 className="upcoming-conf-title">{upcomingConference.title}</h2>
          <p className="upcoming-conf-text">{upcomingConference.body}</p>
        </div>
        <div className="upcoming-conf-right">
          <div className="upcoming-conf-meta">
            <div className="upcoming-conf-meta-item">
              <span className="upcoming-conf-meta-label">Date</span>
              <span className="upcoming-conf-meta-value">{upcomingConference.date}</span>
            </div>
            <div className="upcoming-conf-meta-item">
              <span className="upcoming-conf-meta-label">Location</span>
              <span className="upcoming-conf-meta-value">{upcomingConference.location}</span>
            </div>
          </div>
          <HighlightsList highlights={upcomingConference.highlights} />
        </div>
      </div>
    </motion.section>
  );
}

function ConferenceGrid() {
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true, amount: 0.5 });

  return (
    <section className="conferences-grid-section">
      <motion.h2
        ref={titleRef}
        className="conferences-grid-title"
        initial={{ opacity: 0, y: 30 }}
        animate={titleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        More from the floor
      </motion.h2>
      <div className="conferences-grid">
        {conferenceGridItems.map((item, i) => (
          <GridCard key={item.title} item={item} i={i} />
        ))}
      </div>
    </section>
  );
}

function StaggeredFade({ lines, className }) {
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
      variants={variants}
    >
      {lines.map((line, lineIdx) => (
        <span key={lineIdx} style={{ display: "block" }}>
          {line.split(" ").map((word) => {
            const i = wordIndex++;
            return (
              <motion.span
                key={i}
                variants={variants}
                custom={i}
                style={{ display: "inline-block", marginRight: "0.25em" }}
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

function ConfClosingLines({ lines, className }) {
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
        <span key={lineIdx} className={`conf-closing-line-${lineIdx + 1}`} style={{ display: "inline" }}>
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

function ConferencesClosing() {
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
    <section className="conf-closing">
      <div className="conf-closing-zone" ref={closingZoneRef}>
        <div className="conf-closing-sticky">
          <div className="conf-closing-phrase">
            <ConfClosingLines
              className={isDark ? "conf-closing-text light-text" : "conf-closing-text dark-text"}
              lines={[
           "Beyond the stages and speaker decks, conferences are where ideas become conversations.",
"Watch how people connect, navigate the room, and turn brief moments into lasting opportunities."
              ]}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Conferences() {
  return (
      <main className="conferences">
        <section className="conferences-hero">
          <StaggeredFade
            lines={["Conferences", "Past the panel."]}
            className="conferences-headline"
          />
          <div className="conferences-posts">
            {conferencePosts.map((post, i) => (
              <PostCard key={post.title} post={post} i={i} />
            ))}
          </div>
        </section>

        <UpcomingConference />
        <ConferenceGrid />
        <ConferencesClosing />
        <Footer />
      </main>
  );
}
