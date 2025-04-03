import Tag from "./Tag.jsx";
import Button from "./Button.jsx";
import React, {useState, useRef, useEffect} from "react";
import Grade from 'grade-js'
import {IoIosArrowDown, IoIosArrowUp} from "react-icons/io";
import genericThumbnail from "../../assets/Podcast/genericThumbnail.jpg"
import podcastData from "../../assets/data/podcastData.json";
import SearchBar from "../../components/SearchBar.jsx";
import {FaList} from "react-icons/fa";
import {IoGridOutline} from "react-icons/io5";
import {GiHamburgerMenu} from "react-icons/gi";
import {FcCheckmark} from "react-icons/fc";
import EpisodeGrid from "./EpisodeGrid.jsx";
import EpisodeList from "./EpisodeList.jsx";
import getStructuredData from "../../getStructuredData.js";

// interface episode {
//   name: string,
//   description: string,
//   date: Date,
//   length: int
//   img: string
// }

function PodcastPage({setMusicQueue, currentSong}) {
  const podcastName = new URL(window.location.href).searchParams.get("name");
  const podcast = podcastData[podcastName];

  const handlePlay = (index) => {
    if (typeof setMusicQueue === 'function') {
      setMusicQueue(getStructuredData("podcast", podcastName, index));
    } else {
      console.error('setMusicQueue is not a function');
    }
  };

  const sortButtons = [
    {
      text: "Date",
      sortFn: (a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime(),
      ascending: true
    },
    {text: "Title", sortFn: (a, b) => a.name.localeCompare(b.name), ascending: true},
    {text: "Length", sortFn: (a, b) => b.durationMs - a.durationMs, ascending: true},
  ]
  const [sortButtonsState, setSortButtonsState] = useState(sortButtons);
  const [selectedSortButtonIndex, setSelectedSortButtonIndex] = useState(0);
  const [showViewDropdown, setShowViewDropdown] = useState(false)
  const [view, setView] = useState("Grid")

  function setAscendingState(index, ascending) {
    const clonedButton = {...sortButtonsState[index]}
    clonedButton.ascending = !clonedButton.ascending;
    ascending = !ascending;

    const clonedButtons = [...sortButtonsState];
    clonedButtons[index] = clonedButton;

    setSortButtonsState(clonedButtons);
    return ascending;
  }

  podcast.episodes.sort((a, b) => sortButtons[0].sortFn(a, b)); // sort by ascending date initially
  const [episodesState, setEpisodesState] = useState(podcast.episodes)

  const [searchValue, setSearchValue] = useState('');
  const debounceCallbackFn = () => {
    setEpisodesState([...podcast.episodes].filter(episode => {
      if (episode.name.toLowerCase().includes(searchValue.toLowerCase())
        || episode.description.toLowerCase().includes(searchValue.toLowerCase())) {
        return episode;
      }
    }))
  }

  const dropdownViewButtons = [
    {text: "Grid", icon: <IoGridOutline size={20}/>},
    {text: "List", icon: <GiHamburgerMenu size={20}/>}]

  const topRef = useRef(null);
  useEffect(() => {
    setTimeout(() => {
      Grade(topRef.current, null, (data) => {
        const element = data[0].element
        const gradientData = data[0].gradientData;
        gradientData[0].rgba.pop();
        element.style.backgroundColor = `rgb(${gradientData[0].rgba.toString().replaceAll(",", " ")})`
      })
    }, 500)
  }, []);

  useEffect(() => {
    const handleClick = (event) => {
      if (event.target.closest('.ignore-click')) {
        return; // Do nothing if click is inside .ignore-click
      }
      setShowViewDropdown(false);
    };

    window.addEventListener('click', handleClick);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className="pb-7 bg-[#212121]">
      {/*Top section*/}
      <div ref={topRef} className={"pl-3 py-3 flex gap-2 bg-linear-to-b to-black to-110%"}>
        <img crossOrigin="anonymous" alt={"Thumbnail"} className={"h-36"} src={podcast.image ?? genericThumbnail}/>
        <section className={"justify-end flex flex-col gap-2"}>
          <div className={"flex gap-2 content-center line-clamp-1"}>
            <div>Podcast</div>
            <div className={"flex gap-1.5"}>{podcast.genres?.map(tag => <Tag key={tag} tag={tag}></Tag>)}</div>
          </div>
          <div className={"text-4xl font-sans font-bold italic line-clamp-2"}>{podcastName}</div>
          <div className={"text-xl font-bold line-clamp-1"}>{podcast.publisher}</div>
        </section>
      </div>

      {/*Everything else (all indented*/}
      <div className={"ml-7 mr-14 mt-4"}>

        {/*Top Buttons*/}
        <div className={"flex gap-2"}>
          <Button text={"Follow"}/>
          <Button text={"Rate Show"}/>
          <Button text={"Share"}/>
        </div>

        {/*About*/}
        <div className={"mt-5"}>
          <div className={"font-bold text-xl"}>About</div>
          <div dangerouslySetInnerHTML={{__html: podcast.about}} className={"mt-2 text-sm text-neutral-400"}></div>
        </div>

        {/*Episodes*/}
        <div className={"mt-5"}>
          <div className={"font-bold text-xl"}>Episodes</div>

          {/*Search and sorters*/}
          <div className={"mt-3 flex gap-2 content-center items-center"}>
            <div
              className="relative flex items-center rounded-full text-white bg-black
                     hover:bg-stone-900 focus-within:bg-stone-950
                     transition-all duration-150 ease-in-out px-4 py-2
                     max-w-xs sm:max-w-md md:max-w-lg">
              <i className="fa-solid fa-search text-lg md:text-xl hover:text-white
                       hover:scale-110 transition-all duration-150 ease-in-out"/>
              <SearchBar searchText={searchValue} setSearchText={setSearchValue} callBackFn={debounceCallbackFn}
                         delay={500} placeholder={"Search episode"}
                         className={"w-full text-sm md:text-md pl-3 pr-4 outline-none bg-transparent"}/>
            </div>

            {sortButtonsState.map((button, index) => {
              const isSelected = selectedSortButtonIndex === index;
              let ascending = button.ascending;
              const arrow = isSelected ? ascending ? <IoIosArrowUp/> : <IoIosArrowDown/> : ''
              return <Button
                onClick={() => {
                  if (isSelected) {
                    ascending = setAscendingState(index, ascending);
                  }
                  setSelectedSortButtonIndex(index)
                  setEpisodesState([...episodesState].sort((a, b) => {
                    if (ascending) return button.sortFn(a, b)
                    else return button.sortFn(b, a)
                  }))
                }} key={index}
                text={[button.text, arrow]}
                className={isSelected && "bg-green-500 hover:bg-green-600 active:bg-green-700"}/>
            })}

            <div className="relative select-none cursor-pointer ml-8">
              <FaList size={"30"} onClick={() => setShowViewDropdown(!showViewDropdown)}
                      className="text-gray-400 text-lg hover:bg-stone-700 p-1 rounded-lg shadow-2xl ignore-click"/>
              <ul hidden={!showViewDropdown}
                  className={"absolute w-36 shadow-2xl bg-[#343434] right-4 z-10 rounded ignore-click"}>
                {(dropdownViewButtons.map((item, index) =>
                  <li className={"flex items-center gap-2 p-2 hover:bg-stone-700 active:bg-stone-800 rounded-lg"}
                      key={index} onClick={() => setView(item.text)}>
                    <div className={item.text === view ? "text-green-500" : ''}>{item.icon}</div>
                    <div className={item.text === view ? "text-green-500" : ''}>{item.text}</div>
                    {item.text === view && <FcCheckmark size={20} className={"ml-auto mb-1"}/>}
                  </li>))}
              </ul>
            </div>
          </div>

          {/*Episodes grid*/}
          {view === "Grid" ?
            <EpisodeGrid handlePlay={handlePlay} episodes={episodesState}
                         currentSong={currentSong} podcastName={podcastName}/> :
            <EpisodeList handlePlay={handlePlay} episodes={episodesState}
                         currentSong={currentSong} podcastName={podcastName}/>}
        </div>
      </div>
    </div>
  )
}

export default PodcastPage;