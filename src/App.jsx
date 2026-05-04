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
import Reveal from "./components/Reveal";

function AnimatedRoutes({ lenisRef }) {
  const location = useLocation()

  useEffect(() => {
    lenisRef.current?.stop()

    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0

    const timer = setTimeout(() => {
      lenisRef.current?.scrollTo(0, { immediate: true })
      lenisRef.current?.start()
    }, 350)

    return () => clearTimeout(timer)
  }, [location.pathname])

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <PageTransitionLayout>
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
        </Routes>
      </PageTransitionLayout>
    </div>
  )
}

function App() {
  const lenisRef = useRef(null); // store lenis instance

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, smooth: true })
    lenisRef.current = lenis
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf) }
    requestAnimationFrame(raf)
  }, [])

  return (
    <BrowserRouter>
      <NavBar />
      <AnimatedRoutes lenisRef={lenisRef} />
    </BrowserRouter>
  )
}
export default App;