// interface episode {
//   title: string,
//   description: string,
//   date: Date,
//   length: int
//   img: string
// }

function formatDate(dateObj) {
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

function formatLength(lengthInMinutes) {
  const totalSeconds = Math.round(lengthInMinutes * 60);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours} hr ${minutes} min ${seconds} sec`;
  } else {
    return `${minutes} min ${seconds} sec`;
  }
}


function Episode({episode}) {
  return (
    <div
      className={"flex flex-nowrap items-center content-stretch gap-[10px] hover:cursor-pointer hover:scale-105 transition-all hover:bg-[#474747]"}>
      <img className={"flex-shrink h-44"} src={episode.img} alt="Thumbnail"/>
      <div className={"flex flex-col gap-1"}>
        <div className={"font-bold text-xl line-clamp-3"}>{episode.title}</div>
        <div className={"text-neutral-400 text-xs line-clamp-3"}>{episode.description}</div>
        <div className={"mt-2 font-bold line-clamp-1"}>{formatDate(episode.date)} • {formatLength(episode.length)}</div>
      </div>
    </div>
  )
}

export default Episode;