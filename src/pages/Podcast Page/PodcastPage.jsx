import Tag from "./Tag.jsx";
import Button from "./Button.jsx";
import Episode from "./Episode.jsx";
import {useState, useRef, useEffect} from "react";
import Grade from 'grade-js'
import useDebounce from './UseDebounce.jsx';
import {IoIosArrowDown, IoIosArrowUp} from "react-icons/io";
import genericThumbnail from "../../assets/Podcast/genericThumbnail.jpg"
import podcastData from "../../assets/data/podcastData.json";

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
    {text: "Date", sortFn: (a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime(), ascending: true},
    {text: "Title", sortFn: (a, b) => a.name.localeCompare(b.name), ascending: true},
    {text: "Length", sortFn: (a, b) => b.duration - a.duration, ascending: true},
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

  function handleSearch(e) {
    setSearchValue(e.target.value);
  }

  // Runs similar to useEffect, whenever searchValue changes, wait 800 ms then run callback fn
  // might wanna add loading cus design??
  useDebounce(() => {
    setEpisodesState([...podcast.episodes].filter(episode => {
      if (episode.name.toLowerCase().includes(searchValue.toLowerCase())
        || episode.description.toLowerCase().includes(searchValue.toLowerCase())) {
        return episode;
      }
    }))
  }, [searchValue], 500)

  const topRef = useRef(null);
  useEffect(() => {
    Grade(topRef.current, null, (data) => {
      const element = data[0].element
      const gradientData = data[0].gradientData;
      gradientData[0].rgba.pop();
      element.style.backgroundColor = `rgb(${gradientData[0].rgba.toString().replaceAll(",", " ")})`
    })
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
            <input onChange={handleSearch} value={searchValue} placeholder={"Search for a episode"}
                   className={"rounded-lg pl-3 mr-4 bg-white text-black"}/>

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
            {episodesState.map((episode, index) => <Episode key={index} episode={episode}></Episode>)}
          </div>
        </div>
      </div>
    </div>)
}

export default PodcastPage;