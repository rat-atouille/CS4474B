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

  const handleCategory = (category) => {
    setSelectedCategory(category);
    console.log(category);
  };

  return (
    <div className={"bg-black h-screen w-[20vw]"}>
      <div className="mt-20 mx-10">
        {/* First Row with Book Icon, Plus and Arrow Icons */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <i className="fas fa-book text-white mt-2"></i>
            <span className="text-white">Your Library</span>
          </div>
          <div className="flex space-x-4">
            <i className="fas fa-plus text-white mt-2"></i>
            <i className="fas fa-arrow-right text-white mt-2"></i>
          </div>
        </div>

        {/* Category Buttons */}
        <div className="flex justify-between space-x-3 mb-6">
          {["Playlists", "Artists", "Albums", "Podcasts"].map((category) => (
            <button
              onClick={() => handleCategory(category)}
              key={category}
              className={`bg-gray-700 text-sm font-semibold text-gray-300 px-6 py-1 rounded 
                  cursor-pointer transition-all duration-300 ease-in-out 
                  ${selectedCategory === category ? 'bg-white text-gray-700 hover:text-gray-500' : 'hover:bg-gray-500'}`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Search and Recents */}
        <div className="flex justify-between items-center">
          <i className="fas fa-search text-white mt-2"></i>
          <div className="flex items-start space-x-2">
            <span className="text-white">Recents</span>
            <i className="fas fa-list text-white mt-2"></i>
          </div>
        </div>

        {/* Item Column */}
        <div className="mt-10 space-y-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              {/* Square Image */}
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-sm" />

              {/* Text Info */}
              <div>
                <span className="text-white font-semibold">{item.name}</span>
                <div className="text-gray-400 text-sm">{item.year}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
