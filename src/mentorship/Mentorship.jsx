import { useRef, useEffect, useState } from "react";
import { color, motion, useInView, AnimatePresence } from "framer-motion";
import Footer from "../components/Footer";
import "./Mentorship.css";

const posts = [
  {
    title: "Crafting Your 90 Second Pitch",
    author: "Fatema Kibria",
    tags: ["Career", "Leadership"],
    body: "Your pitch is your buisness case for you. A concise narrative that communicates who you are, what you do, and why it matters in measurable, strategic terms. Think of it less as an introduction and more as an invitation to the right conversation.",
    image: "/post1.png",
    imageName: "test",
    link: "https://www.linkedin.com/posts/syelabs_careeradvice-leadership-storytelling-activity-7418062177292435456-haF4?utm_source=share&utm_medium=member_desktop&rcm=ACoAAC9GeDABvdk515cZ7yy8RR55U5zeik8ObhI",
  },
{
  title: "You Belong Before You Feel Ready",
  author: "Annusha Pervez",
  tags: ["Growth", "Mindset"],
  comingSoon: true,
  body: "A lot of people wait for permission before they contribute, apply, speak up, or reach out. But the people who end up surprising themselves are often the ones willing to enter spaces before they feel fully validated by them. You do not need to become someone else to belong. Your perspective, curiosity, and willingness to learn already make you valuable in the room.",  image: "/post-confidence.png",
      image: "/post2.png",
  imageName: "confidence",
},
{
  title: "Networking isn’t Collecting Contacts",
  author: "Syeda Habib",
  tags: ["LinkedIn", "Career"],
comingSoon: true,
  body: "The best networking rarely starts with asking for a job. It starts with curiosity, thoughtful questions, and genuine engagement. People remember conversations that made them feel understood, not messages that felt transactional.",
  image: null,
  imageName: "networking",
}
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

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
      className="mentorship-headline"
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

const WORKSHOP_TAGS = [
  "Demystifying AI",
  "AI + Coding",
  "Technical Confidence",
  "Career Exploration",
  "Student Workshops",
  "Conference Sessions",
];

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
function WorkshopSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const isMobile = useIsMobile();

  const pairs = [];
  for (let i = 0; i < WORKSHOP_TAGS.length; i += 2) {
    pairs.push(WORKSHOP_TAGS.slice(i, i + 2));
  }

  const [pairIndex, setPairIndex] = useState(0);

  useEffect(() => {
    if (!isMobile) return;
    const id = setInterval(() => {
      setPairIndex((p) => (p + 1) % pairs.length);
    }, 2800);
    return () => clearInterval(id);
  }, [isMobile, pairs.length]);

  return (
    <motion.section
      ref={ref}
      className="mentorship-workshops"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <h2 className="mentorship-workshops-heading">
        We bring conversations, and hands-on learning into classrooms, communities, and conferences.
      </h2>

      {isMobile ? (
        <div className="mentorship-workshop-tags mobile">
          {pairs[pairIndex].map((tag, idx) => (
            <div className="workshop-tag-card" key={idx}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  {tag}
                </motion.span>
              </AnimatePresence>
            </div>
          ))}
        </div>
      ) : (
        <div className="mentorship-workshop-tags">
          {WORKSHOP_TAGS.map((tag) => (
            <div className="workshop-tag-card" key={tag}>
              <span>{tag}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mentorship-workshop-feature">
        <div className="mentorship-workshop-feature-copy">
          <p>
            Our workshops break down complex tech topics into sessions that feel approachable,
            practical, and engaging, especially for students and emerging technologists.
          </p>
          <p>
            From explaining how AI actually uses data, to helping students articulate their technical accomplishments
            with confidence, we focus on making tech easier to understand
            and less intimidating to explore.
          </p>
          <div className="workshop-feature-footer">
            <span>
              Interested in bringing a workshop to your school,
              organization, or event?
            </span>
            <a href="mailto:	syelabs.thrivetogether@gmail.com" style={{ color: "#C1714F" }}>Reach out</a>
          </div>
        </div>

        <div className="mentorship-workshop-feature-visual">
          <img src="/robot.png" alt="robot" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </div>
      </div>
    </motion.section>
  );
}

function PostCard({ post, i }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.25 });

  return (
    <motion.div
      ref={ref}
      className="post-card"
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      transition={{ delay: i * 0.1 }}
      onClick={() => post.link && window.open(post.link, "_blank")}
      style={{ cursor: post.link ? "pointer" : "default" }}
    >
      {/* Left: text */}
      <div className="post-card-left">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <h2 className="post-card-title">{post.title}</h2>
        </div>
        <p className="post-card-author">by {post.author}</p>

        <div className="post-card-tags">
          {post.comingSoon && <span className="post-tag-coming-soon">Coming Soon</span>}
          {post.tags.map((tag) => (
            <span className="post-tag" key={tag}>{tag}</span>
          ))}
        </div>
        <p className="post-card-body">{post.body}</p>
      </div>

      {/* Right: image */}
      <div className="post-card-image">
        {post.image ? (
          <>
            <img src={post.image} alt={post.imageName} />

          </>
        ) : (
          <div className="post-card-image-placeholder" />
        )}
      </div>
    </motion.div>
  );
}

function StaggeredLines({ lines, className, delay = 0, blur=true}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

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
          style={{
            display: "inline",
            willChange: "transform, opacity, filter",
          }}
        >
          {line.split(" ").map((word) => {
            const i = wordIndex++;
            return (
              <motion.span
                key={i}
                custom={i}
                initial="hidden"
                animate={isInView ? "show" : "hidden"}
                variants={{
                  hidden: { opacity: 0, y: 18, filter: blur ? "blur(6px)"  : "none" },
                  show: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: {
                      delay: delay + i * 0.06,
                      duration: 0.7,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  },
                }}
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
export default function Mentorship() {
  const postsRef = useRef(null);
  const postsInView = useInView(postsRef, { once: true, amount: 0.1 });
    const closingZoneRef = useRef(null);
    const [isDarkZone, setIsDarkZone] = useState(false);
useEffect(() => {
  const handleScroll = () => {
    const zone = closingZoneRef.current;
    if (!zone) return;

    const scrolled = -zone.getBoundingClientRect().top;
    const adjustedScroll = Math.max(0, scrolled - 100);

    setIsDarkZone(adjustedScroll > 800);
  };

  window.addEventListener("scroll", handleScroll, { passive: true });

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, []);
  return (
      <main className="mentorship">

<section className="mentorship-hero">
  <StaggeredFade text="Guidance doesn't have to be hard to find. The right mentor, the right moment, and suddenly the path forward becomes clear." />

</section>

<section className="mentorship-posts" ref={postsRef}>
      <StaggeredLines
    className="mentorship-posts-label"
    lines={["From our mentors, to you."]}
    delay={2}
  />
  {posts.map((post, i) => (
    <PostCard key={post.title} post={post} i={i} />
  ))}
</section>

<section className="mentorship-closing">
    
  <div className="mentorship-closing-zone" ref={closingZoneRef}>
<WorkshopSection />
    <div className="mentorship-closing-sticky">
      <div className="mentorship-closing-phrase">
        <StaggeredLines
          className={isDarkZone ? "light-text" : "mentor-dark-text"}
            blur={false}
          lines={[
            "The right guidance doesn’t just answer questions, it changes what feels possible.",
            "Mentorship creates the space for clarity, momentum, and growth to take shape."
          ]}
        />
      </div>
    </div>
  </div>
</section>

        <Footer />
      </main>
  );
}