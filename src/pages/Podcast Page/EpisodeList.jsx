import genericThumbnail from "../../assets/Podcast/genericThumbnail.jpg";
import {AiFillPicture} from "react-icons/ai";
import {useEffect, useRef} from "react";

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

function EpisodeList({episodes, handlePlay, currentSong, podcastName}) {
  const tableBody = useRef(null)

  useEffect(() => {
    const topRowTds = tableBody.current.children[1].children;

    for (let i = 0; i < topRowTds.length; i++) {
      topRowTds[i].classList.add("pt-4")
    }

  }, []);
  return (
    <table className={"w-full mt-7"}>
      <tbody ref={tableBody}>
      <tr>
        <th className={"text-left pb-2 border-b-2 border-neutral-700 text-neutral-400"}><AiFillPicture/></th>
        <th className={"text-left pb-2 border-b-2 border-neutral-700 text-neutral-400"}>Name</th>
        <th className={"text-left pb-2 border-b-2 border-neutral-700 text-neutral-400"}>Release Date</th>
        <th className={"text-left pb-2 border-b-2 border-neutral-700 text-neutral-400"}>Duration</th>
      </tr>

      {episodes.map((episode, index) =>
        <tr onClick={() => {handlePlay(index);}} className={`hover:bg-[#474747] cursor-pointer ${(currentSong.index === index && podcastName === currentSong.albumName) && "text-green-500"}`} key={index}>
          <td className={"py-1.5"}><img className={"size-8"} src={episode?.image ?? genericThumbnail} alt={"Thumbnail"}/></td>
          <td className={"py-1.5"}>{episode.name}</td>
          <td className={"py-1.5"}>{formatDate(episode.releaseDate)}</td>
          <td className={"py-1.5"}>{formatLength(episode.durationMs)}</td>
        </tr>
      )}
      </tbody>
    </table>
  )
}

export default EpisodeList;