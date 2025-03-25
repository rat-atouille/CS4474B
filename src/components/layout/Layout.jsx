import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";
import {useState, useEffect} from "react";

function Layout({children}) {
  const [showNavBackground, setShowNavBackground] = useState(false)

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
    <div className="flex flex-row bg-gray-900 h-screen">
      <Sidebar/>
      <div className="flex flex-col w-[80vw] overflow-hidden">
        <Navbar showNavBackground={showNavBackground}/>
        <div className="flex-grow overflow-auto">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Layout;