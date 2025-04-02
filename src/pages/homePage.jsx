import { useEffect, useState, useMemo } from "react";
import spotifyData from "../assets/data/data.json";
import podcastData from "../assets/data/podcastData.json";
import { useNavigate } from "react-router-dom";
import { PlayButton } from "../components/playButton.jsx";
import isPodcast from "../isPodcast.js";
import { useAlbum } from "../context/AlbumContext.jsx";
import getStructuredData from "../getStructuredData.js";

// ===== Carousel Component =====
function RecentPlayedCarousel({ items, handlePlay, handleAlbumClick }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(1);
  const navigate = useNavigate();

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
          style={{transform: `translateX(-${(currentIndex * 100) / itemsToShow}%)`}}
        >
          {items.map((item, index) => (
            <div
              onClick={() => {
                if (isPodcast(item)) {
                  navigate(`/podcast/?name=${item.podcastName}`);
                } else {
                  handleAlbumClick(item);
                }
              }}
              key={index}
              className="p-2 group"
              style={{flex: `0 0 ${100 / itemsToShow}%`}}
            >
              <div className="relative">
                <img
                  src={item.album?.image ?? item.image}
                  alt="Thumbnail"
                  className="h-42 w-42 object-fit rounded"
                />
                <PlayButton 
                  onClick={(e) => {
                    e.stopPropagation();  // Prevents triggering handleAlbumClick
                    if (isPodcast(item)) {
                      handlePlay("podcast", item.podcastName, 0);
                    } else {
                      handlePlay("album", item.album.name, 0);
                    }
                  }}/>
              </div>
              <h2 className="mt-1 text-xs font-semibold text-gray-200">
                {item.album?.name ?? item.podcastName}
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
function GridView({ items, handlePlay, handleAlbumClick }) {
  const [itemsToShow, setItemsToShow] = useState(2);
  const navigate = useNavigate();

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
          <div onClick={() => {
            if (isPodcast(item)) {
              navigate(`/podcast/?name=${item.podcastName}`)
            } else {
              handleAlbumClick(item)
            }
          }} key={index} className="w-full group">
            <div className="relative bg-green-300">
              <img
                src={item.album?.image ?? item.image}
                alt="Thumbnail"
                className="h-36 w-full object-fit rounded"
              />
                <PlayButton 
                  onClick={(e) => {
                    e.stopPropagation();  // Prevents triggering handleAlbumClick
                    if (isPodcast(item)) {
                      handlePlay("podcast", item.podcastName, 0);
                    } else {
                      handlePlay("album", item.album.name, 0);
                    }
                  }}/>
            </div>
            <h2 className="mt-1 text-xs font-semibold text-gray-200">
              {item.album?.name ?? item.podcastName}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== Media Component =====
function MediaSection({title, items, renderCollapsed, renderExpanded}) {
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

function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function renderMediaSection(title, items, handlePlay, handleAlbumClick) {
  return (
    <MediaSection
      title={title}
      items={items}
      renderCollapsed={(items) => <RecentPlayedCarousel items={items} handlePlay={handlePlay} handleAlbumClick={handleAlbumClick}/>}
      renderExpanded={(items) => <GridView items={items} handlePlay={handlePlay} handleAlbumClick={handleAlbumClick}/>}
    />
  );
}

// ===== HomePage Component =====
export default function HomePage({ setMusicQueue }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [albums, setAlbums] = useState([]);
  const [podcasts, setPodcasts] = useState([]);
  const [shuffledRecentlyPlayed, setShuffledRecentlyPlayed] = useState([]);
  const [shuffledMadeForYou, setShuffledMadeForYou] = useState([]);
  const [shuffledTopMixes, setShuffledTopMixes] = useState([]);
  const [shuffledTrendingPodcasts, setShuffledTrendingPodcasts] = useState([]);
  const [shuffledLatestEpisodes, setShuffledLatestEpisodes] = useState([]);
  const [shuffledRecommended, setShuffledRecommended] = useState([]);
  const [, setCurrentAlbum] = useAlbum();
  const navigate = useNavigate();

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

    if (podcastData) {
      setPodcasts(Object.entries(podcastData).flatMap(([podcastName, podcast]) => ({ podcastName, ...podcast })));
    }
  }, []);

  useEffect(() => {
    if (albums.length > 0) {
      setShuffledRecentlyPlayed(shuffleArray(albums));
      setShuffledMadeForYou(shuffleArray(albums));
      setShuffledTopMixes(shuffleArray(albums));
      setShuffledRecommended(shuffleArray(albums));
    }
    if (podcasts.length > 0) {
      setShuffledTrendingPodcasts(shuffleArray(podcasts));
      setShuffledLatestEpisodes(shuffleArray(podcasts));
    }
  }, [albums, podcasts]);

  const handleCategory = (category) => {
    setSelectedCategory(category);
  };

  const handlePlay = (type, name, index) => {
    if (typeof setMusicQueue === 'function') {
      setMusicQueue(getStructuredData(type, name, index));
    } else {
      console.error('setMusicQueue is not a function');
    }
  };

  const handleAlbumClick = (album) => {
    setCurrentAlbum(album);
    navigate("/album");
  };

  return (
    <div className="p-8 w-full bg-[#212121]">
      {/* Main Grid Section */}
      <div className="w-full grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        {albums.length > 0 && albums.slice(0, 8).map((item, index) => (
          <div key={index} className="flex items-center bg-gray-700 hover:bg-gray-600 rounded group relative" onClick={() => handleAlbumClick(item)}>
            <img src={item.album.image} alt="Thumbnail" className="h-16 w-16 object-fit" />
            <h2 className="ml-3 p-1 text-xs font-semibold">{item.album.name}</h2>
            <button
              className="absolute bottom-2 right-2 bg-black rounded-full opacity-0 group-hover:opacity-100 transition-all ease-in-out"
              onClick={(e) => {
                e.stopPropagation();  // Prevents triggering handleAlbumClick
                handlePlay("album", item.album.name, 0);
              }}
            >
              <i className="fa-solid fa-circle-play text-5xl text-green-500 hover:scale-105 transition-all duration-150 ease-in-out"></i>
            </button>
          </div>
        ))}
      </div>

      {/* Category Buttons */}
      <div className="mt-7 mb-7 flex flex-wrap gap-3">
        {["All", "Music", "Podcasts", "Audiobooks"].map((category) => (
          <button
            onClick={() => handleCategory(category)}
            key={category}
            className={`bg-gray-700 text-sm font-semibold text-gray-300 px-4 py-1 rounded-full
                cursor-pointer transition-all duration-300 ease-in-out
                ${selectedCategory === category ? "bg-green-500 text-white" : "hover:bg-gray-500"}`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Conditional Rendering of Media Sections */}
      {selectedCategory === "All" && (
        <>
          {renderMediaSection("Recently Played", shuffledRecentlyPlayed, handlePlay, handleAlbumClick)}
          {renderMediaSection("Made For You", shuffledMadeForYou, handlePlay, handleAlbumClick)}
          {renderMediaSection("Your Top Mixes", shuffledTopMixes, handlePlay, handleAlbumClick)}
          {renderMediaSection("Trending Podcasts", shuffledTrendingPodcasts, handlePlay, handleAlbumClick)}
          {renderMediaSection("Your Latest Episodes", shuffledLatestEpisodes, handlePlay, handleAlbumClick)}
          {renderMediaSection("Recommended For You", shuffledRecommended, handlePlay, handleAlbumClick)}
        </>
      )}

      {selectedCategory === "Music" && (
        <>
          {renderMediaSection("Recently Played", shuffledRecentlyPlayed, handlePlay, handleAlbumClick)}
          {renderMediaSection("Made For You", shuffledMadeForYou, handlePlay, handleAlbumClick)}
          {renderMediaSection("Your Top Mixes", shuffledTopMixes, handlePlay, handleAlbumClick)}
        </>
      )}

      {selectedCategory === "Podcasts" && (
        <>
          {renderMediaSection("Trending Podcasts", shuffledTrendingPodcasts, handlePlay, handleAlbumClick)}
          {renderMediaSection("Your Latest Episodes", shuffledLatestEpisodes, handlePlay, handleAlbumClick)}
        </>
      )}

      {selectedCategory === "Audiobooks" && (
        <>
          {renderMediaSection("Audiobook Collection", shuffledRecentlyPlayed, handlePlay, handleAlbumClick)}
          {renderMediaSection("Your Audiobook Library", shuffledRecentlyPlayed, handlePlay, handleAlbumClick)}
        </>
      )}
    </div>
  );
}