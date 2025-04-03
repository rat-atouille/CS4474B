import genericThumbnail from "../../assets/Podcast/genericThumbnail.jpg";
import {PlayButton} from "../../components/playButton.jsx";
import {BsSoundwave} from "react-icons/bs";
import React from "react";

// interface episode {
//   title: string,
//   description: string,
//   date: Date,
//   length: int
//   img: string
// }

function formatDate(releaseDate) {
  const dateObj = new Date(releaseDate)
  const now = new Date();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(now.getDate() - 7);

  const year = dateObj.toLocaleDateString(undefined, {year: "numeric"});
  const month = dateObj.toLocaleDateString(undefined, {month: "long"});
  const day = dateObj.toLocaleDateString(undefined, {weekday: "long"});
  const dayNumeric = dateObj.toLocaleDateString(undefined, {day: "2-digit"});


  if (dateObj > oneWeekAgo) {
    return `${day}`;
  } else if (dateObj.getFullYear() === now.getFullYear()) {
    return ` ${month} ${dayNumeric}`;
  } else {
    return `${year} ${month}  ${dayNumeric}`;
  }
}

function formatLength(lengthInMs) {
  const totalSeconds = Math.round(lengthInMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours} hr ${minutes} min ${seconds} sec`;
  } else {
    return `${minutes} min ${seconds} sec`;
  }
}


function EpisodeGrid({episodes, handlePlay, currentSong, podcastName}) {
  return (
    <div className={"w-full grid grid-cols-2 grid-rows-1 gap-x-14 gap-y-10 mt-7"}>
      {episodes.map((episode, index) =>
        <div key={index} onClick={() => {handlePlay(index);}}
             className={"group flex flex-nowrap items-center gap-[10px] hover:cursor-pointer hover:scale-105 transition-all hover:bg-[#474747] p-0.5"}>
          <div className={"relative size-36 flex-shrink-0"}>
            <img className={"size-full object-cover"} src={episode?.image ?? genericThumbnail}
                 alt="Thumbnail"/>
            <PlayButton/>
          </div>
          <div className={"flex flex-col gap-0.5 min-w-0"}>
            <div
              className={`font-bold text-lg line-clamp-2 ${(currentSong.index === index && currentSong.albumName === podcastName) && 'text-green-500'}`}>{episode.name}</div>
            <div dangerouslySetInnerHTML={{__html: episode.description}}
                 className={"text-neutral-400 text-xs line-clamp-3"}></div>
            <div
              className={"mt-2 text-sm font-bold line-clamp-1 flex gap-1"}>{formatDate(episode.releaseDate)} • {formatLength(episode.durationMs)}
              {(currentSong.index === index && currentSong.albumName === podcastName) && <BsSoundwave size={20} className="text-green-500 text-lg ml-auto mr-2"/>}</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EpisodeGrid;