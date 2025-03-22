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

  const options = { weekday: 'long' }; // for weekday name

  if (dateObj > oneWeekAgo) {
    // Return weekday (e.g., "Monday")
    return dateObj.toLocaleDateString(undefined, options);
  } else if (dateObj.getFullYear() === now.getFullYear()) {
    // Return MM-DD
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${month}-${day}`;
  } else {
    // Return YY-MM-DD
    const year = String(dateObj.getFullYear()).slice(-2);
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
    <div className={"flex flex-nowrap items-center content-stretch gap-[10px] hover:cursor-pointer hover:scale-105 transition-all"}>
      <img className={"flex-shrink h-44"} src={episode.img} alt="Thumbnail" />
      <div className={"flex flex-col gap-1"}>
        <div className={"font-bold text-xl line-clamp-3"}>{episode.title}</div>
        <div className={"text-neutral-400 text-xs line-clamp-3"}>{episode.description}</div>
        <div className={"mt-2 font-bold line-clamp-1"}>{formatDate(episode.date)} • {formatLength(episode.length)}</div>
      </div>
    </div>
  )
}

export default Episode;