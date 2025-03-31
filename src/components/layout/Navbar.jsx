import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar({ showNavBackground }) {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchText.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(searchText.trim())}`);
    }
  };

  return (
      <div
          className={`fixed bg-black w-full h-[10vh] md:h-[5vw] z-20 px-4 py-2 flex items-center 
                  justify-between transition-all 
                  ${showNavBackground && "bg-[#1a1a1a]"}`}
      >
        <div className="flex-1 flex justify-center items-center space-x-4">
          <a
              href="/"
              className="fa-solid fa-house text-lg md:text-xl hover:text-white hover:scale-110
                     transition-all duration-150 ease-in-out"
          ></a>

          <div
              className="relative flex items-center rounded-full py-1 text-white bg-stone-800
                     hover:bg-stone-600 focus-within:border-2 focus-within:bg-stone-700
                     transition-all duration-150 ease-in-out px-4 w-full
                     max-w-xs sm:max-w-md md:max-w-lg"
          >
            <i className="fa-solid fa-search text-lg md:text-xl hover:text-white
                       hover:scale-110 transition-all duration-150 ease-in-out"></i>

            <input
                type="text"
                placeholder="What do you want to play?"
                className="w-full text-sm md:text-md pl-3 pr-4 outline-none bg-transparent"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={handleKeyDown}
            />

            <div className="h-6 w-px bg-gray-400 mx-2 hidden sm:block"></div>
            <a
                href="/browse"
                className="fa-solid fa-box-archive text-lg md:text-xl hover:text-white hover:scale-110
                       transition-all duration-150 ease-in-out hidden sm:block relative group"
            >
            <span
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200
                         absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black
                         text-white px-3 py-1 rounded-md text-sm"
            >
              Browse
            </span>
            </a>
          </div>
        </div>

        {/* Right Icons */}
        <div className="flex items-center space-x-3 md:space-x-4 mr-4 md:mr-8">
          <i
              className="fa-solid fa-bell text-lg md:text-xl hover:text-white hover:scale-110
                     transition-all duration-150 ease-in-out"
          ></i>
          <img
              src="src/assets/profileIcon.png"
              alt="Thumbnail"
              className="h-6 w-6 md:h-8 md:w-8 object-cover rounded-full hover:text-white"
          />
        </div>
      </div>
  );
}

export default Navbar;
