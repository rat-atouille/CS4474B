import { useState } from "react";

function Sidebar() {
  // Sample data
  const data = [
    { image: "/placeHolders/placeHolderIcon.jpeg", name: "Anonymous", year: "2019" },
    { image: "/placeHolders/placeHolderIcon.jpeg", name: "Anonymous", year: "2019" },
    { image: "/placeHolders/placeHolderIcon.jpeg", name: "Anonymous", year: "2019" },
    { image: "/placeHolders/placeHolderIcon.jpeg", name: "Anonymous", year: "2019" },
    { image: "/placeHolders/placeHolderIcon.jpeg", name: "Anonymous", year: "2019" },
    { image: "/placeHolders/placeHolderIcon.jpeg", name: "Anonymous", year: "2019" },
    { image: "/placeHolders/placeHolderIcon.jpeg", name: "Anonymous", year: "2019" },
    { image: "/placeHolders/placeHolderIcon.jpeg", name: "Anonymous", year: "2019" },
  ];

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [collapsed, setCollapsed] = useState(false);

  const handleCategory = (category) => {
    setSelectedCategory(category);
    console.log(category);
  };

  const handleCollapse = () => {
    setCollapsed((prev) => !prev);
  }

  return (
    <div className={`bg-black ${!collapsed ? 'w-[20vw]' : 'w-[5vw]'}`}>
      <div className={`bg-black my-20 ${!collapsed ? 'mx-6' : 'mx-2 flex flex-col justify-center items-center'}`}>
      <svg 
        onClick={handleCollapse} 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={1.5} 
        stroke="currentColor" 
        className="size-5 mb-3"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d={collapsed 
            ? "m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" 
            : "m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"} 
        />
      </svg>

        {!collapsed ? (
          <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <i className="fas fa-book text-white mt-2"></i>
            <span className="text-white font-bold">Your Library</span>
          </div>
          <div className="flex space-x-4">
            <i className="fas fa-plus text-white mt-2"></i>
            <i className="fas fa-arrow-right text-white mt-2"></i>
          </div>
        </div>
        ) : (
          <div className="flex justify-between items-center mb-6">
            <i className="fas fa-plus text-white mt-2"></i>
          </div>
        )}



        {/* Category Buttons */}
        {!collapsed && (
          <div className="grid grid-cols-2 gap-3 mb-6 2xl:flex 2xl:flex-wrap">
          {["Playlists", "Artists", "Albums", "Podcasts"].map((category) => (
            <button
              onClick={() => handleCategory(category)}
              key={category}
              className={`bg-gray-700 text-xs font-semibold text-gray-300 px-4 py-1 rounded 
                  cursor-pointer transition-all duration-300 ease-in-out 
                  ${selectedCategory === category ? 'bg-white text-gray-700 hover:text-gray-500' : 'hover:bg-gray-500'}`}
            >
              {category}
            </button>
          ))}
        </div>
        )}

        {/* Search and Recents */}
        {!collapsed && (
          <div className="flex justify-between items-center">
          <i className="fas fa-search text-white mt-2"></i>
          <div className="flex items-start space-x-2">
            <span className="text-white">Recents</span>
            <i className="fas fa-list text-white mt-2"></i>
          </div>
        </div>
        )}

        {/* Item Column */}
        <div className={`space-y-4 ${!collapsed ? 'mt-10' : 'mt-2'}`}>
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              {/* Square Image */}
              <img src={item.image} alt={item.name} className={`2xl:w-20 2xl:h-20 object-cover rounded-sm ${!collapsed ? 'w-14 h-14' : 'w-10 h-10'}`}/>

              {/* Text Info */}
              {!collapsed && (
                <div>
                  <span className="text-white font-semibold 2xl:text-lg text-xs">{item.name}</span>
                  <div className="text-gray-400 2xl:text-lg text-xs">{item.year}</div>
                </div>
              )}

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
