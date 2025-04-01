export function PlayButton({onClick}) {
  return <button
    className="absolute bottom-2 right-2 opacity-0 bg-black rounded-full group-hover:opacity-100 transition-all ease-in-out"
    onClick={onClick}  // Pass the item to the handlePlay function
  >
    <i
      className="fa-solid fa-circle-play text-5xl text-green-500 hover:scale-105 transition-all duration-150 ease-in-out"></i>
  </button>;
}