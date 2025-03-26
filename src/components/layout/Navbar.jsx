function Navbar({showNavBackground}) {
  return (
    <div
      className={`bg-[#1a1a1a] w-full h-[5vw] z-10 px-4 py-2 flex items-center justify-between transition-all ${showNavBackground && "bg-[#1a1a1a]"}`}>
      {/* Left Icon and Search Bar in Center */}
      <div className="flex-1 flex justify-center items-center space-x-4">
        <i
          className="fa-solid fa-house text-2xl hover:text-white hover:scale-110 transition-all duration-150 ease-in-out"></i>
        <input
          type="text"
          placeholder="What do you want to play?"
          className="w-xl text-lg pl-3 pr-4 py-2 rounded-lg bg-stone-600 text-white focus:outline-none focus:ring-2 focus:ring-stone-500"
        />
      </div>

      {/* Right Icons */}
      <div className="flex items-center space-x-4 mr-8">
        <i
          className="fa-solid fa-bell text-3xl hover:text-white hover:scale-110 transition-all duration-150 ease-in-out"></i>
        <img
          src="src\assets\profileIcon.png"
          alt="Thumbnail"
          className="h-12 w-12 object-cover rounded-full hover:text-white"
        />
      </div>
    </div>
  );
}

export default Navbar;
