import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import Footer from "../components/Footer";
import "./Conferences.css";

const conferencePosts = [
  {
    title: "Connecting at MassOpenAI",
    author: "SyeLabs Team",
    tags: ["MassOpenAI", "AI"],
    body: "SyeLabs had the opportunity to connect with the MassOpenAI community and explore the latest developments in AI. From AI safety and data provenance to agentic systems and MCP servers, these conversations offered valuable insights into the technologies and ideas shaping the future of AI.",
    image: null,
    youtubeId: "Ym3wmbNwl5g",
    imageName: "massopenai-community",
    link: "https://youtu.be/Ym3wmbNwl5g",
  },
];

const conferenceGridItems = [
  {
    title: "Where is AI taking security?",
    youtubeId: "PSp1KBDymWw",
    poster: "/security-poster.jpg",
    link: "https://youtube.com/shorts/PSp1KBDymWw",
  },
  {
    title: "AWS Summit Attendees Share AI Future Predictions",
    hoverTitle: "We handed over the mic at AWS Summit and asked attendees about the tech inspiring them and their one-word prediction for the future of AI.",
    video: "/linkedin8.mp4",
    poster: "/linkedin8-poster.jpg",
    link: "https://www.linkedin.com/feed/update/urn:li:activity:7475710066453602304",
  },
  {
    title: "How can we cut through AI noise?",
    youtubeId: "htMpw_hUC78",
    poster: "/ai-noise-poster.jpg",
    link: "https://youtube.com/shorts/htMpw_hUC78",
  },
  {
    title: "Highlights from KubeCon 2024",
    hoverTitle: "Ever wondered what it's actually like to walk through a major tech conference as an insider? Here's your backstage pass.",
    video: "/linkedin6.mp4",
    poster: "/linkedin6-poster.jpg",
    link: "https://www.linkedin.com/feed/update/urn:li:activity:7389343590956679168",
  },
  {
    title: "Simple Networking Tips for Your First Conference",
    hoverTitle: "Here's a quick tip to help you start conversations, meet new people, and feel more confident at your first conference.",
    video: "/linkedin7.mp4",
    objectPosition: "center",
    link:"https://www.linkedin.com/feed/update/urn:li:activity:7387260106825949184",
  },
  {
    title: "An Inside Look at KubeCon for First-Timers",
    hoverTitle: "Take a look back at our time at KubeCon 2024, from first impressions to standout moments, here's a glimpse into the experience.",
    video: "/linkedin1.mp4",
    poster: "/linkedin1-poster.jpg",
    link: "https://www.linkedin.com/feed/update/urn:li:activity:7390146819768500225",
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

const upcomingConference = {
  title: "AI Is Moving Fast. Are We Learning Fast Enough to Stay in Control?",
  body: "From the DC State of the Stack Conference to MassOpenAI, conversations with AI users, builders, and security specialists reveal an important truth: The future of AI depends not just on what we build, but on how well we understand it.",
  meta: [
    { label: "Featuring", value: "DC State of the Stack & MassOpenAI" },
    { label: "Read time", value: "5 min" },
  ],
  highlights: [
    { title: "Read on Substack", url: "https://syelabs.substack.com/p/ai-is-moving-fast-are-we-learning" },
    { title: "Read on Medium", url: "https://medium.com/@syelabs.thrivetogether/ai-is-moving-fast-are-we-learning-fast-enough-to-stay-in-control-e307fd54bb6c" },
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
// Muted, looping YouTube embed with a thumbnail on top. The video autoplays
// behind the thumbnail and never pauses: YouTube flashes its play/pause
// buttons for ~3s whenever playback starts, resumes or seeks. So the
// thumbnail only lifts once the video has been playing for 4s, and `revealed`
// (hover / touch) just shows or covers it. To keep scrolling smooth, the video
// only plays while it's on (or near) screen.
function YouTubeHoverVideo({ id, title, poster, revealed }) {
  const iframeRef = useRef(null);
  const readyTimer = useRef(null);
  const onScreen = useRef(false);
  const [ready, setReady] = useState(false);

  // Controls the embed via its iframe API (requires enablejsapi=1).
  const ytPost = (msg) =>
    iframeRef.current?.contentWindow?.postMessage(JSON.stringify(msg), "*");
  const ytCommand = (func, args = []) => ytPost({ event: "command", func, args });

  useEffect(() => {
    const onMessage = (e) => {
      if (e.source !== iframeRef.current?.contentWindow) return;
      let data;
      try { data = JSON.parse(e.data); } catch { return; }
      const state = data.event === "onStateChange" ? data.info : data.info?.playerState;
      if (typeof state !== "number") return;
      if (state === 1) {
        // Autoplay can start before the player accepts commands, so pause here
        // if it began playing off screen.
        if (!onScreen.current) return ytCommand("pauseVideo");
        ytCommand("setOption", ["captions", "track", {}]); // turn off auto-captions
        if (!readyTimer.current) {
          readyTimer.current = setTimeout(() => setReady(true), 4000);
        }
      } else if (state !== 3) {
        // Buffering (3) doesn't bring the buttons back, so it's ignored.
        clearTimeout(readyTimer.current);
        readyTimer.current = null;
        setReady(false);
      }
    };
    window.addEventListener("message", onMessage);

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen.current = entry.isIntersecting;
        ytCommand(entry.isIntersecting ? "playVideo" : "pauseVideo");
      },
      { rootMargin: "200px 0px" }
    );
    observer.observe(iframeRef.current);

    return () => {
      window.removeEventListener("message", onMessage);
      observer.disconnect();
      clearTimeout(readyTimer.current);
    };
  }, []);

  return (
    <>
      <iframe
        ref={iframeRef}
        src={`https://www.youtube-nocookie.com/embed/${id}?enablejsapi=1&mute=1&controls=0&loop=1&playlist=${id}&playsinline=1&rel=0&iv_load_policy=3&disablekb=1&autoplay=1`}
        title={title}
        allow="autoplay; encrypted-media"
        tabIndex={-1}
        onLoad={() => {
          ytPost({ event: "listening", id, channel: "widget" });
          ytCommand("addEventListener", ["onStateChange"]);
        }}
      />
      <img
        className="yt-poster"
        src={poster}
        alt={title}
        style={{ opacity: ready && revealed ? 0 : 1 }}
      />
    </>
  );
}

function PostCard({ post, i }) {
  const ref = useRef(null);
  const videoRef = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.25 });
  const isTouch = useIsTouchDevice();

  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = () => {
    if (post.youtubeId) return setHovered(true);
    videoRef.current?.play();
  };
  const handleMouseLeave = () => {
    if (post.youtubeId) return setHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  // Touch devices: autoplay on scroll into view. Desktop stays hover-only,
  // via handleMouseEnter/Leave above — unchanged.
  useEffect(() => {
    if (!isTouch || !post.video || !videoRef.current) return;

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
  }, [isTouch, post.video]);

  return (
    <motion.div
      ref={ref}
      className="conf-post-card"
      variants={confCardVariants}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      transition={{ delay: i * 0.1 }}
      onClick={() => post.link && window.open(post.link, "_blank")}
      onMouseEnter={isTouch ? undefined : handleMouseEnter}
      onMouseLeave={isTouch ? undefined : handleMouseLeave}
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
        {post.youtubeId ? (
          <YouTubeHoverVideo
            id={post.youtubeId}
            title={post.title}
            poster={`https://i.ytimg.com/vi/${post.youtubeId}/sddefault.jpg`}
            revealed={hovered || isTouch}
          />
        ) : post.video ? (
          <video
            ref={videoRef}
            src={post.video}
            poster={post.poster}
            muted
            playsInline
            webkit-playsinline="true"
            preload="auto"
            loop
          />
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
  const isTouch = useIsTouchDevice();

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

  // Touch devices: autoplay on scroll into view. Desktop stays hover-only.
  useEffect(() => {
    if (!isTouch || !item.video || !videoRef.current) return;

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
  }, [isTouch, item.video]);

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
        {item.youtubeId ? (
          <YouTubeHoverVideo
            id={item.youtubeId}
            title={item.title}
            poster={item.poster ?? `https://i.ytimg.com/vi/${item.youtubeId}/oardefault.jpg`}
            revealed={hovered || isTouch}
          />
        ) : item.video ? (
          <video
            ref={videoRef}
            src={item.video}
            poster={item.poster}
            muted
            loop
            playsInline
            webkit-playsinline="true"
            preload="auto"
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
        {item.hoverTitle && (
          <p className="conference-card-mobile-desc">{item.hoverTitle}</p>
        )}
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
            onClick={() => h.url && window.open(h.url, "_blank")}
            style={h.url ? { cursor: "pointer" } : undefined}
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
      <h2 className="conferences-grid-title">From the blog</h2>
      <div className="upcoming-conf-body">
        <div className="upcoming-conf-left">
          <h2 className="upcoming-conf-title">{upcomingConference.title}</h2>
          <p className="upcoming-conf-text">{upcomingConference.body}</p>
        </div>
        <div className="upcoming-conf-right">
          <div className="upcoming-conf-meta">
            {upcomingConference.meta.map((m) => (
              <div className="upcoming-conf-meta-item" key={m.label}>
                <span className="upcoming-conf-meta-label">{m.label}</span>
                <span className="upcoming-conf-meta-value">{m.value}</span>
              </div>
            ))}
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
