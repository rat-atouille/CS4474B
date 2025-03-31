import React, { useState, useEffect } from "react"; 
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";
import MusicPlayer from "./MusicPlayer.jsx";

export default function Layout({ children }) {
  const [showNavBackground, setShowNavBackground] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [musicQueue, setMusicQueue] = useState(); // State to hold the array

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
          <div className={`flex flex-col overflow-hidden w-full mt-[10vh] md:mt-[5vw] mb-[10vh] md:mb-[5vw]`}>
            <div className="flex-grow overflow-auto">
              {/* Pass the setMusicQueue function to the children via the Routes */}
              <Routes>
                <Route
                  path="/*"
                  element={React.cloneElement(children, { setMusicQueue })} // Pass the setMusicQueue function
                />
              </Routes>
            </div>
          </div>
        </div>

        {/* Pass the state array to the MusicPlayer */}
        <MusicPlayer musicQueue={musicQueue} />
      </div>
    </BrowserRouter>
  );
}