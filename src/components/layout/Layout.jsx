import React, {useState, useEffect} from "react";
import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";
import MusicPlayer from "./MusicPlayer.jsx";
import {Outlet} from "react-router-dom";

export default function Layout({musicQueue, setMusicQueue}) {
  const [collapsed, setCollapsed] = useState(false);
  const [showNavBackground, setShowNavBackground] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState();

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

  useEffect(() => {
    console.log(currentSongIndex);
  }, [currentSongIndex])

  return (
    <div className="h-screen w-screen overflow-x-hidden flex flex-col bg-black">
      {/* Sidebar (Fixed, Always on the Left) */}
      <div
        className={`fixed top-0 left-0 mt-[10vh] md:mt-[5vw] h-full text-white transition-all ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} setMusicQueue={setMusicQueue} currentSongIndex={currentSongIndex} setCurrentSongIndex={setCurrentSongIndex}/>
      </div>

      {/* Main Content Wrapper (Takes Full Width) */}
      <div className={`flex flex-col flex-1 min-w-0 transition-all`}>
        {/* Navbar (Full Width, Sticky on Top) */}
        <Navbar showNavBackground={showNavBackground} className="w-full"/>

        {/* Scrollable Content */}
        <div className={`flex-1 mt-[10vh] md:mt-[5vw] overflow-y-auto bg-[#212121] ${collapsed ? "ml-16" : "ml-64"}`}>
          <Outlet/>
        </div>
      </div>

      {/* Music Player at Bottom */}
      <MusicPlayer musicQueue={musicQueue} currentSongIndex={currentSongIndex} setCurrentSongIndex={setCurrentSongIndex}/>
    </div>
  );
}