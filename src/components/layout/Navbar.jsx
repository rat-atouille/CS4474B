function Navbar({ showNavBackground }) {
  return (
    <div
      className={`fixed bg-black w-full h-[10vh] md:h-[5vw] z-10 px-4 py-2 flex items-center justify-between transition-all ${
        showNavBackground && "bg-[#1a1a1a]"
      }`}
    >
      {/* Left Icon and Search Bar in Center */}
      <div className="flex-1 flex justify-center items-center space-x-4">
        <a href={"/"} className="fa-solid fa-house text-lg md:text-xl hover:text-white hover:scale-110 transition-all duration-150 ease-in-out"></a>
        <div className="relative flex items-center rounded-full py-1 text-white bg-stone-800 hover:bg-stone-600 focus-within:border-2 focus-within:bg-stone-700 transition-all duration-150 ease-in-out px-4 w-full max-w-xs sm:max-w-md md:max-w-lg">
          <i className="fa-solid fa-search text-lg md:text-xl hover:text-white hover:scale-110 transition-all duration-150 ease-in-out"></i>
          <input
            type="text"
            placeholder="What do you want to play?"
            className="w-full text-sm md:text-md pl-3 pr-4 outline-none bg-transparent"
          />
          {/* Vertical Divider */}
          <div className="h-6 w-px bg-gray-400 mx-3 hidden sm:block">
              <a href={"/browse"} className="fa-solid fa-box-archive text-lg md:text-xl hover:text-white hover:scale-110 transition-all duration-150 ease-in-out hidden sm:block"></a>
          </div>
        </div>
      </div>

      {/* Right Icons */}
      <div className="flex items-center space-x-3 md:space-x-4 mr-4 md:mr-8">
        <i className="fa-solid fa-bell text-lg md:text-xl hover:text-white hover:scale-110 transition-all duration-150 ease-in-out"></i>
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
