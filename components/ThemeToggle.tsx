"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="theme-toggle-wrapper">
        <div className="theme-toggle-track theme-toggle-placeholder" />
      </div>
    )
  }

  const isDark = theme === "dark"

  return (
    <div className="theme-toggle-wrapper">
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={`theme-toggle-track ${isDark ? "theme-toggle-dark" : "theme-toggle-light"}`}
        aria-label={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
        title={isDark ? "Mode Terang" : "Mode Gelap"}
      >
        {/* Background decorations */}
        <div className="theme-toggle-bg">
          {/* Stars (visible in dark mode) */}
          <AnimatePresence>
            {isDark && (
              <>
                <motion.span
                  className="theme-star theme-star-1"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ delay: 0.15, duration: 0.3 }}
                />
                <motion.span
                  className="theme-star theme-star-2"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ delay: 0.25, duration: 0.3 }}
                />
                <motion.span
                  className="theme-star theme-star-3"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ delay: 0.35, duration: 0.3 }}
                />
                <motion.span
                  className="theme-star theme-star-4"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                />
                <motion.span
                  className="theme-star theme-star-5"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                />
              </>
            )}
          </AnimatePresence>

          {/* Clouds (visible in light mode) */}
          <AnimatePresence>
            {!isDark && (
              <>
                <motion.span
                  className="theme-cloud theme-cloud-1"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                />
                <motion.span
                  className="theme-cloud theme-cloud-2"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                />
              </>
            )}
          </AnimatePresence>
        </div>

        {/* The thumb / celestial body */}
        <motion.div
          className="theme-toggle-thumb"
          layout
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
          style={{
            x: isDark ? 24 : 0,
          }}
        >
          {/* Sun rays */}
          <AnimatePresence>
            {!isDark && (
              <motion.div
                className="theme-sun-rays"
                initial={{ opacity: 0, rotate: -45, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 45, scale: 0.5 }}
                transition={{ duration: 0.4 }}
              >
                {[...Array(8)].map((_, i) => (
                  <span
                    key={i}
                    className="theme-ray"
                    style={{ transform: `rotate(${i * 45}deg)` }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sun / Moon face */}
          <motion.div
            className={`theme-celestial ${isDark ? "theme-moon" : "theme-sun"}`}
            animate={{
              rotate: isDark ? 0 : 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 0.6, ease: "easeInOut" },
              scale: { duration: 0.4, ease: "easeOut" },
            }}
            key={isDark ? "moon" : "sun"}
          >
            {/* Moon craters */}
            <AnimatePresence>
              {isDark && (
                <>
                  <motion.span
                    className="theme-crater theme-crater-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.2 }}
                  />
                  <motion.span
                    className="theme-crater theme-crater-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.3 }}
                  />
                  <motion.span
                    className="theme-crater theme-crater-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.35 }}
                  />
                </>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </button>
    </div>
  )
}
