import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";
import MusicPlayer from "./MusicPlayer.jsx";

export default function Layout({ children }) {
  const [showNavBackground, setShowNavBackground] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    const scrolled = ((scrollTop + windowHeight) / docHeight) * 100;
    setShowNavBackground(scrolled >= 30);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
      <BrowserRouter>
        <div className="h-screen">
          <Navbar showNavBackground={showNavBackground} />

          {/* The rest of layout */}
          <div className="flex flex-row bg-gray-900">
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
            <div
                className={`flex flex-col overflow-hidden w-full mt-[10vh] md:mt-[5vw] mb-[10vh] md:mb-[5vw]`}
            >
              <div className="flex-grow overflow-auto">
                {/*
                3) Define a <Routes> block with a single route path="/*"
                   that renders 'children' (which is <App />).
                   <App /> will contain the actual sub-routes ("/", "/search", etc.).
              */}
                <Routes>
                  <Route path="/*" element={children} />
                </Routes>
              </div>
            </div>
          </div>

          <MusicPlayer />
        </div>
      </BrowserRouter>
  );
}
