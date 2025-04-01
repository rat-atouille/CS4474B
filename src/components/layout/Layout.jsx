import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";
import MusicPlayer from "./MusicPlayer.jsx";
import { AlbumProvider } from "../../context/AlbumContext.jsx";

export default function Layout({ children }) {
  const [showNavBackground, setShowNavBackground] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [musicQueue, setMusicQueue] = useState();

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
    <AlbumProvider>
      <BrowserRouter>
        <div className="h-screen w-screen flex flex-col overflow-y-auto bg-black">
          {/* Sidebar (Fixed, Always on the Left) */}
          <div
            className={`fixed top-0 left-0 mt-[10vh] md:mt-[5vw] h-full text-white transition-all ${
              collapsed ? "w-16" : "w-64"
            }`}
          >
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} setMusicQueue={setMusicQueue} />
          </div>

          {/* Main Content Wrapper (Takes Full Width) */}
          <div className={`flex flex-col flex-1 min-w-0 transition-all ${collapsed ? "ml-16" : "ml-64"}`}>
            {/* Navbar (Full Width, Sticky on Top) */}
            <Navbar showNavBackground={showNavBackground} className="w-full" />

            {/* Scrollable Content */}
            <div className="flex-1 mt-[10vh] md:mt-[5vw]">
              <Routes>
                <Route path="/*" element={React.cloneElement(children, { setMusicQueue })} />
              </Routes>
            </div>
          </div>

          {/* Music Player at Bottom */}
          <MusicPlayer musicQueue={musicQueue} />
        </div>
      </BrowserRouter>
    </AlbumProvider>
  );
}