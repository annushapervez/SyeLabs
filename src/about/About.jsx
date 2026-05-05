import { useRef, useEffect, useState } from "react";
import { delay, motion, useInView } from "framer-motion";
import LineSVG from "../assets/line.svg";
import Footer from '../components/Footer'
import PageTransitionLayout from "../layouts/PageTransitionLayout";


import "./About.css";

const beats = [
  {
    label: "the gap",
    title: "There was a gap nobody was filling.",
    body: "Mentorship was hard to access. Conferences felt out of reach. Building a home lab meant figuring everything out alone. The information existed but not in a way that felt connected, or usable.",
    filled: true,
  },
  {
    label: "the realization",
    title: "It didn’t have to be that way.",
    body: "What people needed wasn’t more content, it was clarity. The right guidance, at the right time, in a space that actually made sense to learn in.",
    filled: false,
  },
  {
    label: "the idea",
    title: "What if it all lived in one place?",
    body: "A space where mentorship was accessible, where conferences weren’t distant, and where hands-on labs were something you could actually run without friction.",
    filled: false,
  },
  {
    label: "the start",
    title: "So SyeLabs began taking shape.",
    body: "Built around real needs not assumptions. Designed to make learning feel structured, connected, and within reach for anyone trying to move forward.",
    filled: false,
  },
  {
    label: "the build",
    title: "And it’s been evolving ever since.",
    body: "What started as an idea became something shared. SyeLabs continues to grow as a space built around access, clarity, and the people moving through it.",
    filled: true,
  },
];
const team = [
  {
    name: "Syeda Habib",
    role: "Solution Architect",
    bio: "Turning complex tech into clear, actionable insight through conference briefings, homelab walkthroughs, and career guidance. Helping individuals find their place in the broader landscape and make informed, career-advancing decisions.",
    // no image field
  },
  {
    name: "Annusha Pervez",
    role: "Technical Specialist",
    bio: "Blending creativity and technical knowledge to turn abstract systems into clean, digestible visuals and explanations. Making complex technology simple and accessible, so learning feels intuitive instead of intimidating.",
    image: "/annu.png",
  },
  {
    name: "Fatema Kibria",
    role: "Digital Performance Analyst",
    bio: "Turning raw data on youth behavior into clear, actionable strategies to reach young audiences effectively. Leveraging CRM systems to standardize workflows, driving long-term growth and stronger ROI for SyeLabs.",
    image: "fatema.png",
  },
];

const teamContainer = {
  hidden: {},
  show: {
    transition: {
      duration: 1,
    },
  },
};

const teamItem = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
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
      className="about-headline"
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      variants={variants}
    >
      {text.split(' ').map((word, i) => (
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
  )
}

function FadeUpBody({ text, className, trigger }) {
  return (
    <motion.p
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={trigger ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      {text}
    </motion.p>
  );
}

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
          style={{ display: "inline" }} 
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
function TimelineBeat({ beat, i, firstBeatRef }) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.5,
  });

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.15, 
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.div
      ref={(el) => {
        ref.current = el;
        if (i === 0) firstBeatRef.current = el;
      }}
      className="timeline-beat"
      variants={container}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
    >
      <div className="timeline-content">
        
        <motion.div className="tl-beat-title" variants={item}>
          {beat.title}
        </motion.div>
<FadeUpBody
  text={beat.body}
  className="tl-beat-body"
  trigger={isInView}
/>
      </div>
    </motion.div>
  );
}

export default function About() {
  const beatRefs = useRef([]);
  const closeRef = useRef(null);
  const closingZoneRef = useRef(null);
  const [isDarkZone, setIsDarkZone] = useState(false);
const firstBeatRef = useRef(null);
const firstBeatInView = useInView(firstBeatRef, {
  once: true,
  amount: 0.6,
});
const teamRef = useRef(null);
const teamInView = useInView(teamRef, {
  once: true,
  amount: 0.3,
});
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("tl-visible");
        });
      },
      { threshold: 0.15 }
    );

    beatRefs.current.forEach((el) => el && observer.observe(el));
    if (closeRef.current) observer.observe(closeRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const zone = closingZoneRef.current;
      if (!zone) return;
      const scrolled = -zone.getBoundingClientRect().top;
      const adjustedScroll = Math.max(0, scrolled - 100);
      setIsDarkZone(adjustedScroll > 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (

                <PageTransitionLayout>
    <main className="about">
      {/* ── Hero ── */}
<section className="about-hero">
  <StaggeredFade text="Syelabs takes what's tangled in thought and gives it shape you can follow. A small team, attentive to every thread, draws out what matters." />
</section>

<motion.div
  className="our-story-header"
  initial={{ opacity: 0, y: 40 }}
  animate={firstBeatInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
  transition={{ duration: 0.6 }}
>
        <span className="our-story-label">Our story</span>
      </motion.div>

      <img src={LineSVG} alt="timeline" className="timeline-svg" />

      {/* ── SVG Timeline ── */}
<div className="timeline-svg-wrapper">
  {beats.map((beat, i) => (
    <TimelineBeat
      key={i}
      beat={beat}
      i={i}
      firstBeatRef={firstBeatRef}
    />
  ))}
</div>

      {/* ── Divider ── */}
      <div className="about-rule" />


      {/* ── Team ── */}
     <section className="about-team" ref={teamRef}>
  <motion.div
    variants={teamContainer}
    initial="hidden"
    animate={teamInView ? "show" : "hidden"}
  >
    {/* Title */}
    <motion.h2
      className="about-section-label"
      variants={teamItem}
    >
      The people behind it
    </motion.h2>

    {/* Grid */}
    <div className="team-grid">
      {team.map((person, i) => (
        <motion.div
          className="team-card"
          key={person.name}
          variants={teamItem}
        >
          <div className="team-avatar">
            {person.image ? (
              <img src={person.image} alt={person.name} />
            ) : (
              <span>{person.name.charAt(0)}</span>
            )}
          </div>

          <div className="team-info">
            <p className="team-name">{person.name}</p>
            <p className="team-role">{person.role}</p>
            <p className="team-bio">{person.bio}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
</section>
            <div className="about-rule" />


      {/* ── Closing ── */}
      <section className="about-closing">
        <div className="about-closing-zone" ref={closingZoneRef}>
          <div className="about-closing-sticky">
            <div className="about-closing-phrase">
<StaggeredLines
  className={isDarkZone ? "light-text" : "dark-text"}
  lines={[
    "Somewhere between curiosity and clarity, something began to take form.",
    "SyeLabs exists as a place to explore, build, and bring ideas forward."
  ]}
/>
            </div>
          </div>
        </div>
      </section>
                <Footer />

    </main>
                </PageTransitionLayout>

    
  );
}