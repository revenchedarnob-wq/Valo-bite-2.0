import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Preloader } from "@/components/Preloader";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CommissionDrawer } from "@/components/CommissionDrawer";
import { Dock } from "@/components/Dock";
import { Cursor } from "@/components/Cursor";
import { ScrollProgress } from "@/components/ScrollProgress";
import { initSmoothScroll, scrollTopImmediate } from "@/lib/scroll";
import Home from "@/pages/Home";
import Studio from "@/pages/Studio";
import Archive from "@/pages/Archive";
import StudyDetail from "@/pages/StudyDetail";
import NotFound from "@/pages/NotFound";

const EASE_LUXE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    scrollTopImmediate();
  }, [pathname]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
        transition={{ duration: 0.45, ease: EASE_LUXE }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/studio" element={<Studio />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/archive/:slug" element={<StudyDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const [revealed, setRevealed] = useState(false);

  // Inertial smooth scrolling for the entire site.
  useEffect(() => initSmoothScroll(), []);

  return (
    <BrowserRouter>
      <div className="grain max-w-[100vw] min-h-svh overflow-x-clip bg-alabaster text-ink">
        <ScrollToTop />
        <AnimatePresence>
          {!revealed && <Preloader key="preloader" onDone={() => setRevealed(true)} />}
        </AnimatePresence>

        {revealed && (
          <>
            <Cursor />
            <ScrollProgress />
            <Nav />
            <AnimatedRoutes />
            <Dock />
            <CommissionDrawer />
          </>
        )}
      </div>
    </BrowserRouter>
  );
}
