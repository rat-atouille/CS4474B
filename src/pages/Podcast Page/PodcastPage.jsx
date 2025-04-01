import Tag from "./Tag.jsx";
import Button from "./Button.jsx";
import Episode from "./Episode.jsx";
import React, {useState, useRef, useEffect} from "react";
import Grade from 'grade-js'
import useDebounce from '../../components/SearchBar.jsx';
import {IoIosArrowDown, IoIosArrowUp} from "react-icons/io";
import genericThumbnail from "../../assets/Podcast/genericThumbnail.jpg"
import podcastData from "../../assets/data/podcastData.json";
import SearchBar from "../../components/SearchBar.jsx";

// interface episode {
//   name: string,
//   description: string,
//   date: Date,
//   length: int
//   img: string
// }

function PodcastPage() {
  const podcastName = new URL(window.location.href).searchParams.get("name");
  const podcast = podcastData[podcastName];

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

  return (
    <div className="pb-7 bg-[#212121]">
      {/*Top section*/}
      <div ref={topRef} className={"pl-3 py-3 flex gap-2 bg-linear-to-b to-black to-110%"}>
        <img crossOrigin="anonymous" alt={"Thumbnail"} className={"h-36"} src={podcast.image ?? genericThumbnail}/>
        <section className={"justify-end flex flex-col gap-2"}>
          <div className={"flex gap-2 content-center line-clamp-1"}>
            <div>Podcast</div>
            <div>{podcast.tags?.map(tag => <Tag key={tag} tag={tag}></Tag>)}</div>
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
          </div>

          {/*Episodes grid*/}
          <div className={"w-full grid grid-cols-2 grid-rows-1 gap-x-14 gap-y-10 mt-7"}>
            {episodesState.map((episode, index) => <Episode key={index} episodes={podcast.episodes}
                                                            episode={episode}></Episode>)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PodcastPage;