import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import SearchBar from "../SearchBar.jsx";

function Navbar({ showNavBackground }) {
  const [searchText, setSearchText] = useState("");
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const fullPath = location.pathname + location.search;
  const [prevPages, setPrevPages] = useState([]);
  const [nextPages, setNextPages] = useState([]);
  
  useEffect(() => {
    const lastPage = sessionStorage.getItem("currentPage");
    let updatedPrevPages = JSON.parse(sessionStorage.getItem("prevPages")) || [];
    let updatedNextPages = JSON.parse(sessionStorage.getItem("nextPages")) || [];
  
    if (lastPage && lastPage !== fullPath) {
      updatedPrevPages = [lastPage, ...updatedPrevPages];
      updatedNextPages = [];
  
      sessionStorage.setItem("prevPages", JSON.stringify(updatedPrevPages));
      sessionStorage.setItem("nextPages", JSON.stringify(updatedNextPages));
    }
  
    sessionStorage.setItem("currentPage", fullPath);
  
    setPrevPages(updatedPrevPages);
    setNextPages(updatedNextPages);
  
  }, [fullPath]);
  
  const goToNext = () => {
    let prevPages = JSON.parse(sessionStorage.getItem("prevPages")) || [];
    let nextPages = JSON.parse(sessionStorage.getItem("nextPages")) || [];
    const currentPage = sessionStorage.getItem("currentPage");
  
    if (nextPages.length > 0) {
      const nextPage = nextPages[0];
      const updatedNextPages = nextPages.slice(1);
      const updatedPrevPages = [currentPage, ...prevPages];
  
      sessionStorage.setItem("prevPages", JSON.stringify(updatedPrevPages));
      sessionStorage.setItem("nextPages", JSON.stringify(updatedNextPages));
      sessionStorage.setItem("currentPage", nextPage);
  
      setPrevPages(updatedPrevPages);
      setNextPages(updatedNextPages);
  
      navigate(nextPage);
    }
  };
  
  const goToPrevious = () => {
    let prevPages = JSON.parse(sessionStorage.getItem("prevPages")) || [];
    let nextPages = JSON.parse(sessionStorage.getItem("nextPages")) || [];
    const currentPage = sessionStorage.getItem("currentPage");
  
    if (prevPages.length > 0) {
      const previousPage = prevPages[0];
      const updatedPrevPages = prevPages.slice(1);
      const updatedNextPages = [currentPage, ...nextPages];
  
      sessionStorage.setItem("prevPages", JSON.stringify(updatedPrevPages));
      sessionStorage.setItem("nextPages", JSON.stringify(updatedNextPages));
      sessionStorage.setItem("currentPage", previousPage);
  
      setPrevPages(updatedPrevPages);
      setNextPages(updatedNextPages);
  
      navigate(previousPage);
    }
  };  

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchText.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(searchText.trim())}`);
    }
  };

  return (
    <div
      className={`fixed bg-black w-full h-[10vh] 
              md:h-[5vw] z-20 px-5 flex items-center 
                  justify-between transition-all 
                  ${showNavBackground && "bg-[#1a1a1a]"}`}
    >
      <div className="flex-1  flex justify-between items-center space-x-4">
        
        {/* history stuff */}
        <div className="flex items-center gap-2">
          {/* Left Icons */}
          <button onClick={goToPrevious}>
                  <i className={`fa-solid fa-angle-left text-lg md:text-xl text-gray-500 hover:scale-110 transition-all duration-150 ease-in-out
                    ${prevPages.length > 0 ? "text-white hover:text-white" : "text-gray-300"}`}></i>
                </button>

            {/* right Icons */}
          <button onClick={goToNext}>
            <i className={`fa-solid fa-angle-right text-lg md:text-xl text-gray-500 hover:scale-110 transition-all duration-150 ease-in-out
              ${nextPages.length > 0 ? "text-white hover:text-white" : "text-gray-300"}`}></i>
          </button>
        </div>
        
        <div className="flex items-center w-full  justify-center gap-5">
            <Link
              to="/"
              className={`fa-solid fa-house text-lg md:text-xl hover:text-white hover:scale-110 transition-all duration-150 ease-in-out ${
                location.pathname === "/" ? "text-white" : "text-gray-300"
              }`}
            ></Link>
            <div
              className="relative flex items-center rounded-full py-1 text-white bg-stone-800
                        hover:bg-stone-600 focus-within:border-2 focus-within:bg-stone-700
                        transition-all duration-150 ease-in-out px-4 w-full
                        max-w-xs sm:max-w-md md:max-w-lg"
            >
              <i className="fa-solid fa-search text-lg md:text-xl hover:text-white hover:scale-110 transition-all duration-150 ease-in-out"></i>

              <SearchBar
                searchRef={searchRef}
                searchText={searchText}
                setSearchText={setSearchText}
                onKeyDown={handleKeyDown}
                delay={500}
                placeholder={"What do you want to play?"}
                className={"select-none w-full text-sm md:text-md pl-3 pr-4 outline-none bg-transparent"}
              />
              <div className="h-6 w-px bg-gray-400 mx-2 hidden sm:block"></div>
              <Link
                to={"/browse"}
                href="/browse"
                className={`ml-1 mr-1 fa-solid fa-box-archive text-lg md:text-xl hover:text-white hover:scale-110
                          transition-all duration-150 ease-in-out hidden sm:block relative group ${location.pathname === "/browse" ? "text-white" : "text-gray-300"}`}
              >
                <span
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200
                            absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black
                            text-white px-3 py-1 rounded-md text-xs font-medium"
                >
                  Browse
                </span>
              </Link>
            </div>
        </div>

            {/* Right Icons */}
      <div className="flex items-center space-x-3 md:space-x-4 mr-4 md:mr-8">
        <i className="fa-solid fa-bell text-lg md:text-xl hover:text-white hover:scale-110 transition-all duration-150 ease-in-out"></i>
        <img src="src/assets/profileIcon.png" alt="Thumbnail" className="h-6 w-6 md:h-8 md:w-8 object-cover rounded-full hover:text-white" />
      </div>
    </div>


    </div>
  );
}

export default Navbar;