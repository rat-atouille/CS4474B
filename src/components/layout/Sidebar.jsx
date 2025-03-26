import { useState } from "react";

function Sidebar() {
  // Sample data
  const data = [
    { image: "/placeHolders/placeHolderIcon.jpeg", name: "Anonymous", year: "2019" },
    { image: "/placeHolders/placeHolderIcon.jpeg", name: "Anonymous", year: "2020" },
    { image: "/placeHolders/placeHolderIcon.jpeg", name: "Anonymous", year: "2021" },
    { image: "/placeHolders/placeHolderIcon.jpeg", name: "Anonymous", year: "2022" },
    { image: "/placeHolders/placeHolderIcon.jpeg", name: "Anonymous", year: "2023" },
    { image: "/placeHolders/placeHolderIcon.jpeg", name: "Anonymous", year: "2024" },
    { image: "/placeHolders/placeHolderIcon.jpeg", name: "Anonymous", year: "2019" },
    { image: "/placeHolders/placeHolderIcon.jpeg", name: "Anonymous", year: "2020" },
  ];

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  const handleCategory = (category) => {
    // Toggle category selection
    setSelectedCategory(prevCategory => 
      prevCategory === category ? null : category
    );
  };

  const handleCollapse = () => {
    setCollapsed((prev) => !prev);
  }

  return (
    <div className={`bg-black z-10 h-screen overflow-hidden ${!collapsed ? 'w-[30vw] md:w-[24vw]' : 'w-[14vw] md:w-[5vw]'}`}>
      <div className={`bg-black h-full flex flex-col ${!collapsed ? 'mx-6' : 'mx-2 items-center'}`}>
        {/* Collapse Toggle */}
        <svg 
          onClick={handleCollapse} 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={1.5} 
          stroke="currentColor" 
          className="size-5 mb-3 self-end cursor-pointer text-white"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d={collapsed 
              ? "m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" 
              : "m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"} 
          />
        </svg>

        {/* Header */}
        {!collapsed && (
          <div className="flex justify-between items-center mb-6 w-full">
            <div className="flex items-center space-x-4">
              <i className="fas fa-book text-white"></i>
              <span className="hidden md:block text-white font-bold">Your Library</span>
            </div>
            <div className="flex space-x-4">
              <i className="fas fa-plus text-white cursor-pointer"></i>
              <i className="fas fa-arrow-right text-white cursor-pointer"></i>
            </div>
          </div>
        )}

        {/* Collapsed Header */}
        {collapsed && (
          <div className="flex flex-col items-center space-y-4">
            <i className="fas fa-plus text-white cursor-pointer"></i>
          </div>
        )}

        {/* Category Buttons */}
        {!collapsed && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-6">
            {["Playlists", "Artists", "Albums", "Podcasts"].map((category) => (
              <button
                onClick={() => handleCategory(category)}
                key={category}
                className={`
                  text-[8px] md:text-[9px] lg:text-xs font-semibold 
                  py-1 md:py-2 rounded cursor-pointer 
                  transition-all duration-300 ease-in-out 
                  ${selectedCategory === category 
                    ? 'bg-white text-gray-700 hover:text-gray-500' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Search and Recents */}
        {!collapsed && (
          <div className="flex justify-between items-center w-full mb-4">
            <i className="fas fa-search text-white cursor-pointer"></i>
            <div className="flex items-center space-x-2">
              <span className="hidden md:block text-white">Recents</span>
              <i className="fas fa-list text-white cursor-pointer"></i>
            </div>
          </div>
        )}

        {/* Item Container with Scrolling */}
        <div className={`
          flex-grow overflow-hidden 
          ${!collapsed ? 'w-full' : 'w-full'}
        `}>
          <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-black">
            <div className={`
              space-y-4 p-2 bg-black
              ${!collapsed ? 'px-2' : 'px-1'}
            `}>
              {data
                .filter(item => 
                  !selectedCategory || 
                  // You can add more filtering logic here if needed
                  item.year === selectedCategory
                )
                .map((item, index) => (
                  <div 
                    key={index} 
                    className="flex items-center space-x-4 hover:bg-gray-800 p-2 rounded-md transition-colors"
                  >
                    {/* Square Image */}
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className={`
                        object-cover rounded-sm 
                        ${!collapsed 
                          ? 'w-14 h-14 2xl:w-20 2xl:h-20' 
                          : 'w-10 h-10'
                        }
                      `}
                    />

                    {/* Text Info */}
                    {!collapsed && (
                      <div className="hidden md:block select-none">
                        <span className="text-white font-semibold 2xl:text-lg text-xs">{item.name}</span>
                        <div className="text-gray-400 2xl:text-lg text-xs">{item.year}</div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;