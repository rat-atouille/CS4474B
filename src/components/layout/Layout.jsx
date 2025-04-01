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
        <div className="h-screen">

          {/* The rest of layout */}
          <div className="flex flex-row bg-gray-900">
            {/* Sidebar */}
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} setMusicQueue={setMusicQueue}/>

            <div>
              {/* content */}
              <div 
                className={`flex flex-col overflow-hidden bg-white ${!collapsed ? 'w-3/4' : 'w-5/6'} 
                           md:mt-[5vw] mb-[10vh] md:mb-[5vw]  
                            ${!collapsed ? 'ml-1/3' : '10%'}`}
              >
                {/* navbar */}
                <Navbar showNavBackground={showNavBackground} />
                
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
          </div>
          {/* Pass the state array to the MusicPlayer */}
          <MusicPlayer musicQueue={musicQueue} />
        </div>
      </BrowserRouter>
    </AlbumProvider>
  );
}
