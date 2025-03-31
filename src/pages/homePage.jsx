import { useState, useEffect } from "react";
import spotifyData from "../assets/data/data.json";

// ===== Carousel Component =====
function RecentPlayedCarousel({ items, handlePlay }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(1);

  useEffect(() => {
    const updateItemsToShow = () => {
      if (window.innerWidth >= 1024) {
        setItemsToShow(5);
      } else if (window.innerWidth >= 768) {
        setItemsToShow(3);
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
      <div className="relative w-19/20 mx-auto">
        <div className="overflow-hidden">
          <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${(currentIndex * 100) / itemsToShow}%)` }}
          >
            {items.map((item, index) => (
              <div
                key={index}
                className="p-2 group"
                style={{ flex: `0 0 ${100 / itemsToShow}%` }}
              >
                <div className="relative">
                  <img
                    src={item.album.image}
                    alt="Thumbnail"
                    className="h-36 w-full object-cover rounded"
                  />
                <button
                  className="absolute bottom-2 right-2 opacity-0 bg-black rounded-full group-hover:opacity-100 transition-all ease-in-out"
                  onClick={() => handlePlay(item)}  // Pass the item to the handlePlay function
                >
                  <i className="fa-solid fa-circle-play text-5xl text-green-500 hover:scale-105 transition-all duration-150 ease-in-out"></i>
                </button>
                </div>
                <h2 className="mt-1 text-xs font-semibold text-gray-200">
                  {item.album.name}
                </h2>
              </div>
            ))}
          </div>
        </div>
        {/* Navigation Buttons */}
        <button
            onClick={goToPrev}
            className="absolute left-0 top-1/2 transform -translate-x-full -translate-y-1/2
                   text-3xl text-gray-200 hover:scale-110 transition-transform"
        >
          <i className="fa-solid fa-circle-chevron-left"></i>
        </button>
        <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 transform translate-x-full -translate-y-1/2
                   text-3xl text-gray-200 hover:scale-110 transition-transform"
        >
          <i className="fa-solid fa-circle-chevron-right"></i>
        </button>
      </div>
  );
}

// ===== Grid Component =====
function GridView({ items, handlePlay }) {
  const [itemsToShow, setItemsToShow] = useState(2);

  useEffect(() => {
    const updateItemsToShow = () => {
      if (window.innerWidth >= 1024) {
        setItemsToShow(5);
      } else if (window.innerWidth >= 768) {
        setItemsToShow(3);
      } else {
        setItemsToShow(2);
      }
    };

    updateItemsToShow();
    window.addEventListener("resize", updateItemsToShow);
    return () => window.removeEventListener("resize", updateItemsToShow);
  }, []);

  return (
      <div className="flex relative space-x-2 w-full">
        <div
            className="p-2 gap-4 w-full"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${itemsToShow}, minmax(0, 1fr))`,
            }}
        >
          {items.map((item, index) => (
              <div key={index} className="w-full group">
                <div className="relative">
                  <img
                      src={item.album.image}
                      alt="Thumbnail"
                      className="h-36 w-full object-cover rounded"
                  />
                <button
                  className="absolute bottom-2 right-2 opacity-0 bg-black rounded-full group-hover:opacity-100 transition-all ease-in-out"
                  onClick={() => handlePlay(item)}  // Pass the item to the handlePlay function
                >
                  <i className="fa-solid fa-circle-play text-5xl text-green-500 hover:scale-105 transition-all duration-150 ease-in-out"></i>
                </button>
                </div>
                <h2 className="mt-1 text-xs font-semibold text-gray-200">
                  {item.album.name}
                </h2>
              </div>
          ))}
        </div>
      </div>
  );
}

// ===== Media Component =====
function MediaSection({ title, items, renderCollapsed, renderExpanded }) {
  const [expanded, setExpanded] = useState(true);
  const [showAll, setShowAll] = useState(false);

  return (
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h2 className="font-bold tracking-wide">{title}</h2>
            <button
                onClick={() => setExpanded((prev) => !prev)}
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
                  onClick={() => setShowAll((prev) => !prev)}
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
}

function renderMediaSection(title, items, handlePlay) {
  return (
    <MediaSection
      title={title}
      items={items}
      renderCollapsed={(items) => <RecentPlayedCarousel items={items} handlePlay={handlePlay} />}
      renderExpanded={(items) => <GridView items={items} handlePlay={handlePlay} />}
    />
  );
}

// ===== HomePage Component =====
export default function HomePage({ setMusicQueue }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [itemsToShow, setItemsToShow] = useState(2);
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    const updateItemsToShow = () => {
      if (window.innerWidth >= 1024) {
        setItemsToShow(5);
      } else if (window.innerWidth >= 768) {
        setItemsToShow(3);
      } else {
        setItemsToShow(2);
      }
    };

    updateItemsToShow();
    window.addEventListener("resize", updateItemsToShow);
    return () => window.removeEventListener("resize", updateItemsToShow);
  }, []);

  useEffect(() => {
    if (spotifyData) {
      const albumList = Object.entries(spotifyData).flatMap(([artistName, artist]) => {
        return artist.albums.map((album) => ({
          artist: artistName,
          album: album
        }));
      });
      setAlbums(albumList);
    }
  }, []);

  function shuffleArray(array) {
    const newArray = [...array]; // Create a copy of the original array
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // Swap elements
    }
    return newArray;
  }
  
  const handleCategory = (category) => {
    setSelectedCategory(category);
  };

  const handlePlay = (album) => {
    // Ensure that setMusicQueue is a function
    if (typeof setMusicQueue === 'function') {
      setMusicQueue(album);  // Ensure it's an array for a queue
    } else {
      console.error('setMusicQueue is not a function1');
    }
  };


  return (
      <div className="p-8 w-full bg-[#212121]">
        {/* Main Grid Section */}
        <div className="w-full grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {albums.length > 0 && // ✅ Ensure albums exist before mapping
            albums.slice(0, 8).map((item, index) => (
              <div
                key={index}
                className="flex items-center bg-gray-700 hover:bg-gray-600 rounded group relative"
              >
                <img
                  src={item.album.image}
                  alt="Thumbnail"
                  className="h-16 w-16 object-cover"
                />
                <h2 className="ml-3 p-1 text-xs font-semibold">{item.album.name}</h2>
                <button
                  className="absolute bottom-2 right-2 opacity-0 bg-black rounded-full group-hover:opacity-100 transition-all ease-in-out"
                  onClick={() => handlePlay(item)}  // Pass the item to the handlePlay function
                >
                  <i className="fa-solid fa-circle-play text-5xl text-green-500 hover:scale-105 transition-all duration-150 ease-in-out"></i>
                </button>
              </div>
            ))
          }
        </div>

        {/* Category Buttons */}
        <div className="mt-7 mb-7 flex flex-wrap gap-3">
          {["All", "Music", "Podcasts", "Audiobooks"].map((category) => (
              <button
                  onClick={() => handleCategory(category)}
                  key={category}
                  className={`bg-gray-700 text-sm font-semibold text-gray-300 px-4 py-1 rounded-full
                cursor-pointer transition-all duration-300 ease-in-out
                ${
                      selectedCategory === category
                          ? "bg-green-500 text-white"
                          : "hover:bg-gray-500"
                  }`}
              >
                {category}
              </button>
          ))}
        </div>

        {/* Conditional Rendering of Media Sections */}
        {selectedCategory === "All" && (
            <>
              {renderMediaSection("Recently Played", shuffleArray(albums), handlePlay)}
              {renderMediaSection("Made For You", shuffleArray(albums), handlePlay)}
              {renderMediaSection("Your Top Mixes", shuffleArray(albums), handlePlay)}
              {renderMediaSection("Trending Podcasts", shuffleArray(albums), handlePlay)}
              {renderMediaSection("Your Latest Episodes", shuffleArray(albums), handlePlay)}
              {renderMediaSection("Recommended For You", shuffleArray(albums), handlePlay)}
              {renderMediaSection("Audiobook Collection", shuffleArray(albums), handlePlay)}
              {renderMediaSection("Your Audiobook Library", shuffleArray(albums), handlePlay)}
              {renderMediaSection("Top Audiobooks", shuffleArray(albums), handlePlay)}
            </>
        )}
        {selectedCategory === "Music" && (
            <>
              {renderMediaSection("Recently Played", shuffleArray(albums), handlePlay)}
              {renderMediaSection("Made For You", shuffleArray(albums), handlePlay)}
              {renderMediaSection("Your Top Mixes", shuffleArray(albums), handlePlay)}
            </>
        )}
        {selectedCategory === "Podcasts" && (
            <>
              {renderMediaSection("Trending Podcasts", shuffleArray(albums), handlePlay)}
              {renderMediaSection("Your Latest Episodes", shuffleArray(albums), handlePlay)}
              {renderMediaSection("Recommended For You", shuffleArray(albums), handlePlay)}
            </>
        )}
        {selectedCategory === "Audiobooks" && (
            <>
              {renderMediaSection("Audiobook Collection", shuffleArray(albums), handlePlay)}
              {renderMediaSection("Your Audiobook Library", shuffleArray(albums), handlePlay)}
              {renderMediaSection("Top Audiobooks", shuffleArray(albums), handlePlay)}
            </>
        )}
      </div>
  );
}
