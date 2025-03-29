import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";
import {useState, useEffect} from "react";
import MusicPlayer from "./MusicPlayer.jsx";

function Layout({children}) {
  const [showNavBackground, setShowNavBackground] = useState(false)
  const [collapsed, setCollapsed] = useState(false);

  const handleScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    const scrolled = (scrollTop + windowHeight) / docHeight * 100;
    scrolled >= 30 ? setShowNavBackground(true) : setShowNavBackground(false);
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    
    // Cleanup event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="h-screen">
      <Navbar showNavBackground={showNavBackground}/>
      <div className="flex flex-row bg-gray-900">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className={`flex flex-col overflow-hidden w-full mt-[10vh] md:mt-[5vw]`}>
          <div className="flex-grow overflow-auto">
            {children}
          </div>
        </div>
      </div>
      <MusicPlayer />
    </div>

  )
}

export default Layout;