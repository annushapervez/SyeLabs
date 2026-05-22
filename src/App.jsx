import { useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import NavBar from './components/NavBar'
import Hero from "./components/Hero"
import Intro from "./components/Intro"
import Offerings from './components/Offerings'
import Content from './components/Content'
import Ticker from './components/Ticker'
import Final from './components/Final'
import Footer from './components/Footer'
import About from './about/About'
import Lenis from "@studio-freight/lenis"
import PageTransitionLayout from './layouts/PageTransitionLayout'
import Reveal from "./components/Reveal"
import Mentorship from './mentorship/Mentorship'
import Conferences from './conferences/Conferences'

function AnimatedRoutes({ lenisRef }) {
  const location = useLocation()

  useEffect(() => {
    const lenis = lenisRef.current
    if (!lenis) return

    const timer = setTimeout(() => {
      lenis.scrollTo(0, { immediate: true })
    }, 350)

    return () => clearTimeout(timer)
  }, [location.pathname])

return (
    <div style={{ position: "relative" }}>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Reveal><Intro /></Reveal>
              <Reveal delay={0.1}><Offerings /></Reveal>
              <Reveal delay={0.15}><Ticker /></Reveal>
              <Reveal delay={0.2}><Content /></Reveal>
              <Reveal delay={0.25}><Final /></Reveal>
              <Footer />
            </>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/mentorship" element={<Mentorship />} />
        <Route path="/conferences" element={<Conferences />} />

      </Routes>
    </div>
)
}

function App() {
  const lenisRef = useRef(null)

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, smooth: true })
    lenisRef.current = lenis

    let rafId
    function raf(time) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return (
    <BrowserRouter>
      <NavBar />
      <AnimatedRoutes lenisRef={lenisRef} />
    </BrowserRouter>
  )
}

export default App