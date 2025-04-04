function Button({text, onClick, className}) {
  return (
    <button onClick={onClick}
            className={"py-1 px-4 rounded-2xl bg-gray-700 hover:bg-gray-500 hover:cursor-pointer transition-all ease-in-out " + className}>
      <div className={"text-gray-300 flex gap-1 items-center"}>{text}</div>
    </button>
  )
}

export default Button;