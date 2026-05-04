import { motion, AnimatePresence } from "framer-motion"
import { useLocation } from "react-router-dom"

export default function PageTransitionLayout({ children }) {
  const location = useLocation()

  return (
    <AnimatePresence mode="sync" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{
          minHeight: "100vh",
          width: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}