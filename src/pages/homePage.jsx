import { useState, useEffect } from "react";

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

// Carousel Component
function RecentPlayedCarousel({ items }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(1);

  useEffect(() => {
    const updateItemsToShow = () => {
      if (window.innerWidth >= 1024) {
        setItemsToShow(6);
      } else if (window.innerWidth >= 768) {
        setItemsToShow(4);
      } else {
        setItemsToShow(2);
      }
    };
    updateItemsToShow();
    window.addEventListener("resize", updateItemsToShow);
    return () => window.removeEventListener("resize", updateItemsToShow);
  }, []);

  const totalItems = items.length;
  const maxIndex = totalItems - itemsToShow;
  
  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex >= maxIndex ? 0 : prevIndex + 1));
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex <= 0 ? maxIndex : prevIndex - 1));
  };

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${(currentIndex * 100) / itemsToShow}%)` }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="p-2"
              style={{ flex: `0 0 ${100 / itemsToShow}%` }}
            >
              <div className="relative">
                <img
                  src={item.image}
                  alt="Thumbnail"
                  className="h-36 w-full object-cover rounded"
                />
                <button className="absolute bottom-2 right-2">
                  <img
                    src="/play-button.png"
                    alt="Play"
                    className="w-10 h-10 hover:scale-105 transition-transform duration-300"
                  />
                </button>
              </div>
              <h2 className="mt-1 text-xs font-semibold text-gray-200">{item.name}</h2>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={goToPrev}
        className="absolute left-0 top-1/2 transform -translate-x-full -translate-y-1/2 text-3xl text-gray-200 hover:scale-110 transition-transform"
      >
        <i className="fa-solid fa-circle-chevron-left"></i>
      </button>
      <button
        onClick={goToNext}
        className="absolute right-0 top-1/2 transform translate-x-full -translate-y-1/2 text-3xl text-gray-200 hover:scale-110 transition-transform"
      >
        <i className="fa-solid fa-circle-chevron-right"></i>
      </button>
    </div>
  );
}

// Grid Component
const GridView = ({ items }) => {
  return (
    <div className="flex relative space-x-2 w-full">
      <div className="mt-8 p-2 grid grid-cols-6 gap-4 w-full">
        {items.map((item, index) => (
          <div key={index} className="w-full">
            <div className="relative">
              <img
                src={item.image}
                alt="Thumbnail"
                className="h-36 w-full object-cover rounded"
              />
              <button className="absolute bottom-2 right-2">
                <img
                  src="/play-button.png"
                  alt="Play"
                  className="w-14 h-14 hover:scale-105 transition-transform duration-300"
                />
              </button>
            </div>
            <h2 className="mt-1 text-xs font-semibold text-gray-200">{item.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

// Media Component
const MediaSection = ({ title, items, renderCollapsed, renderExpanded }) => {
  const [expanded, setExpanded] = useState(true);
  const [showAll, setShowAll] = useState(false);

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h2 className="font-bold tracking-wide">{title}</h2>
          <button
            onClick={() => setExpanded(prev => !prev)}
            className="ml-2 text-xl text-gray-200 hover:scale-105 hover:text-white transition-all duration-150 ease-in-out"
          >
            {expanded ? (
              <i className="fa-solid fa-circle-minus"></i>
            ) : (
              <i className="fa-solid fa-circle-plus"></i>
            )}
          </button>
        </div>
        {expanded && (
          <a
            onClick={() => setShowAll(prev => !prev)}
            className="text-xs text-gray-300 font-semibold hover:underline cursor-pointer transition-all duration-150 ease-in-out"
          >
            {showAll ? "Show Less" : "Show All"}
          </a>
        )}
      </div>
      {expanded && (
        <div className="mt-4">
          {showAll ? renderExpanded(items) : renderCollapsed(items)}
        </div>
      )}
    </div>
  );
};

const renderMediaSection = (title, items) => (
    <MediaSection
        title={title}
        items={items}
        renderCollapsed={(items) => <RecentPlayedCarousel items={items} />}
        renderExpanded={(items) => <GridView items={items} />}
    />
);

export default function HomePage() {
    const [selectedCategory, setSelectedCategory] = useState("All");

    const handleCategory = (category) => {
        setSelectedCategory(category);
        console.log(category)
    }

  return (
    <div className="p-8 mt-20 mx-10 bg-gray-900">
      {/* Category Buttons */}
      <div className="space-x-3">
        {["All", "Music", "Podcasts", "Audiobooks"].map((category) => (
          <button
            onClick={() => handleCategory(category)}
            key={category}
            className={`bg-gray-700 text-sm font-semibold text-gray-300 px-4 py-1 rounded-full 
                cursor-pointer transition-all duration-300 ease-in-out 
                ${selectedCategory === category ? 'bg-green-500 text-white' : 'hover:bg-gray-500'}`}              
          >
            {category}
          </button>
        ))}
      </div>

      {/* Main Grid Section */}
      <div className="mt-8 grid grid-cols-4 gap-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center bg-gray-700 hover:bg-gray-600 rounded">
            <img
              src={item.image}
              alt="Thumbnail"
              className="h-16 w-16 object-cover"
            />
            <h2 className="ml-3 font-semibold">{item.name}</h2>
          </div>
        ))}
      </div>

        {selectedCategory == "All" ? (
            <>
                    {renderMediaSection("Recently Played", data)}
                    {renderMediaSection("Made For You", data)}
                    {renderMediaSection("Your Top Mixes", data)}
                    {renderMediaSection("Trending Podcasts", data)}
                    {renderMediaSection("Your Latest Episodes", data)}
                    {renderMediaSection("Recommended For You", data)}
                    {renderMediaSection("Audiobook Collection", data)}
                    {renderMediaSection("Your Audiobook Library", data)}
                    {renderMediaSection("Top Audiobooks", data)}
            </>
            ) : selectedCategory == "Music" ? (
                <>
                    {renderMediaSection("Recently Played", data)}
                    {renderMediaSection("Made For You", data)}
                    {renderMediaSection("Your Top Mixes", data)}
                </>   
            ) : selectedCategory == "Podcasts" ? (
                <>
                    {renderMediaSection("Trending Podcasts", data)}
                    {renderMediaSection("Your Latest Episodes", data)}
                    {renderMediaSection("Recommended For You", data)}
                </>
            ) : selectedCategory == "Audiobooks" && (
                <>
                    {renderMediaSection("Audiobook Collection", data)}
                    {renderMediaSection("Your Audiobook Library", data)}
                    {renderMediaSection("Top Audiobooks", data)}
                </>
            )}
    </div>
  );
}
