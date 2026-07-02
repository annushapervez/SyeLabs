import { useRef, useEffect, useState } from "react";
import "./content.css";

const posts = [
  {
    tag: "Event Recap",
    title: "Inside look for first timers at KubeCon!",
    meta: "3 min watch · LinkedIn",
    video: "linkedin1.mp4",
    poster: "linkedin1-poster.jpg",
    link: "https://www.linkedin.com/posts/syelabs_kubecon-cncf-cloudnative-activity-7390146819768500225-XjS3?utm_source=share&utm_medium=member_desktop&rcm=ACoAAC9GeDABvdk515cZ7yy8RR55U5zeik8ObhI",
    bg: "#2C1A0E",
  },
  {
    tag: "Advice",
    title: "Here's what 2024 KubeCon attendees say you should know",
    meta: "1 min watch · LinkedIn",
    zoom: 1.15,
    video: "linkedin4.mp4",
    poster: "linkedin4-poster.jpg",
    link: "https://www.linkedin.com/posts/syelabs_kubecon-kubecon2025-kubecon2024-activity-7385122449283108864-WsmJ?utm_source=share&utm_medium=member_desktop&rcm=ACoAAC9GeDABvdk515cZ7yy8RR55U5zeik8ObhI",
    bg: "#1e1208",
  },
  {
    tag: "Advice",
    title: "Level up your professional presence in 2026",
    meta: "Infographic · LinkedIn",
    image: "linkedin3.png",
    link: "https://www.linkedin.com/posts/syelabs_careeradvice-leadership-storytelling-activity-7418062177292435456-haF4?utm_source=share&utm_medium=member_desktop&rcm=ACoAAC9GeDABvdk515cZ7yy8RR55U5zeik8ObhI",
    bg: "#4a2c1a",
  },
  {
    tag: "Event Recap",
    title: "Behind the scenes at NVIDIA Conference 2025",
    meta: "2 min watch · LinkedIn",
    video: "linkedin2.mp4",
    poster: "linkedin2-poster.jpg",
    link: "https://www.linkedin.com/feed/update/urn:li:activity:7391934094215004160",
    bg: "var(--rust)",
  },
  {
    tag: "Explainer: Coming Soon",
    title: "Get on Board: Running VMs in Kubernetes with KubeVirt",
    meta: "Coming soon",
    image: "linkedin5.png",
    link: null,
    bg: "#1e1208",
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

function Card({ v, className = "" }) {
  const videoRef = useRef(null);
  const cardRef = useRef(null);
  const isTouch = useIsTouchDevice();

  function handleMouseEnter() {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }

  function handleMouseLeave() {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }

  // Autoplay on scroll into view — touch devices only.
  // Desktop keeps strictly hover-triggered playback via handleMouseEnter/Leave above.
  useEffect(() => {
    if (!isTouch || !v.video || !videoRef.current || !cardRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current.play().catch(() => {});
        } else {
          videoRef.current.pause();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [isTouch, v.video]);

  return (
    <div
      ref={cardRef}
      className={`content-card ${className}`}
      onClick={() => v.link && window.open(v.link, "_blank")}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="content-thumb" style={{ background: v.bg }}>

       {v.video && (
  <video
    ref={videoRef}
    className="content-video"
    src={`/${v.video}`}
    poster={v.poster ? `/${v.poster}` : undefined}
    muted
    loop
    playsInline
    webkit-playsinline="true"
    preload="auto"
    style={{
      transform: v.zoom ? `scale(${v.zoom})` : "scale(1)",
    }}
  />
)}

        {v.image && (
          <img
            className="content-image"
            src={`/${v.image}`}
            alt={v.title}
          />
        )}

        <div className="content-info">
          <span className="content-tag">{v.tag}</span>
          <h3 className="content-title">{v.title}</h3>
        </div>
      </div>
    </div>
  );
}

function Content() {
  return (
    <section className="content-section">
      <div className="content-header">
        <div>
          <h2 className="content-headline">
            Content to keep you moving
          </h2>
        </div>
   </div>

      <div className="content-grid">
        <Card v={posts[0]} className="featured" />
        {posts.slice(1).map((v, i) => (
          <Card key={i} v={v} />
        ))}
      </div>
    </section>
  );
}

export default Content;