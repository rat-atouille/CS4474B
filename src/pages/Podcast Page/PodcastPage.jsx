import Tag from "./Tag.jsx";
import Button from "./Button.jsx";
import Episode from "./Episode.jsx";
import {useState, useRef, useEffect} from "react";
import Grade from 'grade-js'
import useDebounce from './UseDebounce.jsx';


// interface episode {
//   title: string,
//   description: string,
//   date: Date,
//   length: int
//   img: string
// }

function PodcastPage({title, author, about, tags, img, episodes}) {
  // hard-coding variables for now, we can integrate later
  title = "The Draymond Green Show With Baron Davis";
  author = "IHeartPodcasts and The Volume";
  about = "The world's best basketball podcast just got even better. NBA superstar and 4x champ Draymond Green has a new co-host: 2x All Star Baron Davis. Twice a week, they deliver their no-holds-barred takes on the biggest stories in basketball, break down the latest with the Golden State Warriors, and share never-before-heard stories from on and off the court. It's the most raw, entertaining, and hilarious conversation in the game."
  tags = ["Sports"]
  img = "src/assets/Podcast/sample_thumbnail.png"
  episodes = [
    {
      title: "Sloane Knows - Jay Williams talks Duke Basketball, Cooper Flagg, Coach K, NIL & NBA",
      description: "RJ Barett It’s another edition of the Sloane Knows! PodcastPage, and Sloane chops it up with ESPN college basketball & NBA analyst Jay Williams. The Duke Basketball alum GIVE ME LEBRON GIVE ME LEBRON GIVE ME LEBRON",
      date: new Date("2020-03-17T14:32:00Z"),
      length: 65.5, // 47 minutes + 46 seconds
      img: "https://yt3.googleusercontent.com/Ie-9J6VZENotvs380Z1orDK5PI2fcWhmsoal-vzmi4VKnCb5kQ_gc46v78c11qzo2cJdW0mMrA=s900-c-k-c0x00ffffff-no-rj"
    }, {
      title: "Loane Knows - Jay Williams talks Duke Basketball, Cooper Flagg, Coach K, NIL & NBA",
      description: "It’s another edition of the Sloane Knows! PodcastPage, and Sloane chops it up with ESPN college basketball & NBA analyst Jay Williams. The Duke Basketball alum GIVE ME LEBRON GIVE ME LEBRON GIVE ME LEBRON",
      date: new Date("2025-03-19T09:15:00Z"),
      length: 47.77,
      img: "https://yt3.googleusercontent.com/Ie-9J6VZENotvs380Z1orDK5PI2fcWhmsoal-vzmi4VKnCb5kQ_gc46v78c11qzo2cJdW0mMrA=s900-c-k-c0x00ffffff-no-rj"
    }, {
      title: "Aloane Knows - Jay Williams talks Duke Basketball, Cooper Flagg, Coach K, NIL & NBA",
      description: "It’s another edition of the Sloane Knows! PodcastPage, and Sloane chops it up with ESPN college basketball & NBA analyst Jay Williams. The Duke Basketball alum GIVE ME LEBRON GIVE ME LEBRON GIVE ME LEBRON",
      date: new Date("2025-03-20T21:45:00Z"),
      length: 47.77,
      img: "https://yt3.googleusercontent.com/Ie-9J6VZENotvs380Z1orDK5PI2fcWhmsoal-vzmi4VKnCb5kQ_gc46v78c11qzo2cJdW0mMrA=s900-c-k-c0x00ffffff-no-rj"
    }, {
      title: "Sloane Knows - Jay Williams talks Duke Basketball, Cooper Flagg, Coach K, NIL & NBA",
      description: "It’s another edition of the Sloane Knows! PodcastPage, and Sloane chops it up with ESPN college basketball & NBA analyst Jay Williams. The Duke Basketball alum GIVE ME LEBRON GIVE ME LEBRON GIVE ME LEBRON",
      date: new Date("2025-03-18T16:10:00Z"),
      length: 47.77,
      img: "https://yt3.googleusercontent.com/Ie-9J6VZENotvs380Z1orDK5PI2fcWhmsoal-vzmi4VKnCb5kQ_gc46v78c11qzo2cJdW0mMrA=s900-c-k-c0x00ffffff-no-rj"
    }, {
      title: "Sloane Knows - Jay Williams talks Duke Basketball, Cooper Flagg, Coach K, NIL & NBA",
      description: "It’s another edition of the Sloane Knows! PodcastPage, and Sloane chops it up with ESPN college basketball & NBA analyst Jay Williams. The Duke Basketball alum GIVE ME LEBRON GIVE ME LEBRON GIVE ME LEBRON",
      date: new Date("2025-03-21T11:05:00Z"),
      length: 47.77,
      img: "https://yt3.googleusercontent.com/Ie-9J6VZENotvs380Z1orDK5PI2fcWhmsoal-vzmi4VKnCb5kQ_gc46v78c11qzo2cJdW0mMrA=s900-c-k-c0x00ffffff-no-rj"
    }, {
      title: "Sloane Knows - Jay Williams talks Duke Basketball, Cooper Flagg, Coach K, NIL & NBA",
      description: "It’s another edition of the Sloane Knows! PodcastPage, and Sloane chops it up with ESPN college basketball & NBA analyst Jay Williams. The Duke Basketball alum GIVE ME LEBRON GIVE ME LEBRON GIVE ME LEBRON",
      date: new Date("2025-03-16T22:28:00Z"),
      length: 47.77,
      img: "https://yt3.googleusercontent.com/Ie-9J6VZENotvs380Z1orDK5PI2fcWhmsoal-vzmi4VKnCb5kQ_gc46v78c11qzo2cJdW0mMrA=s900-c-k-c0x00ffffff-no-rj"
    }];

  const sortButtons = [
    {text: "Date", sortFn: (a, b) => b.date.getTime() - a.date.getTime(), ascending: true},
    {text: "Title", sortFn: (a, b) => a.title.localeCompare(b.title), ascending: true},
    {text: "Length", sortFn: (a, b) => b.length - a.length, ascending: true},
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

  episodes.sort((a, b) => sortButtons[0].sortFn(a, b)); // sort by ascending date initially
  const [episodesState, setEpisodesState] = useState(episodes)

  const [searchValue, setSearchValue] = useState('');
  function handleSearch(e) {
    setSearchValue(e.target.value);
  }

  // Runs similar to useEffect, whenever searchValue changes, wait 800 ms then run callback fn
  // might wanna add loading cus design??
  useDebounce(() => {
    setEpisodesState([...episodes].filter(episode => {
      if (episode.title.toLowerCase().includes(searchValue.toLowerCase())
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
    <div className={"pb-7"}>
      {/*Top section*/}
      <div ref={topRef} className={"pl-3 py-3 flex gap-2 bg-linear-to-b to-black to-110%"}>
        <img crossOrigin="anonymous" alt={"Thumbnail"} className={"h-36"} src={img}/>
        <section className={"justify-end flex flex-col gap-2"}>
          <div className={"flex gap-2 content-center line-clamp-1"}>
            <div>Podcast</div>
            <div>{tags.map(tag => <Tag key={tag} tag={tag}></Tag>)}</div>
          </div>
          <div className={"text-4xl font-sans font-bold italic line-clamp-2"}>{title}</div>
          <div className={"text-xl font-bold line-clamp-1"}>{author}</div>
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
          <div className={"text-sm text-neutral-400"}>{about}</div>
        </div>

        {/*Episodes*/}
        <div className={"mt-5"}>
          <div className={"font-bold text-xl"}>Episodes</div>

          {/*Search and sorters*/}
          <div className={"flex gap-2 content-center items-center"}>
            <input onChange={handleSearch} value={searchValue} placeholder={"Search for a episode"}
                   className={"mr-6 bg-white text-black"}/>

            {sortButtonsState.map((button, index) => {
              const isSelected = selectedSortButtonIndex === index;
              let ascending = button.ascending;
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
                text={button.text + ` ${isSelected ? ascending ? '↑' : '↓' : ''} `}
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