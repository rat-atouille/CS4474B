function Button({text, onClick, className}) {
  return (
    <button onClick={onClick}
            className={"py-1 px-4 rounded-lg bg-[#121212] hover:bg-[#222222] hover:cursor-pointer " + className}
            style={{boxShadow: "0px 0px 5px 0px #121212"}}>
      <div className={"text-gray-200 flex gap-0.5 items-center"}>{text}</div>
    </button>
  )
}

export default Button;