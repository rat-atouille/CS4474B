import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";
import {useState, useEffect} from "react";

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
    <div className="flex flex-row bg-gray-900 h-screen">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className={`flex flex-col w-80% overflow-hidden ${!collapsed ? 'w-[70vw] md:w-[76vw]' : 'w-[86vw] md:w-[95vw]'}`}>
        <Navbar showNavBackground={showNavBackground}/>
        <div className="flex-grow overflow-auto">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Layout;