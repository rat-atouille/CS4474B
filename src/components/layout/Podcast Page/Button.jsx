function Button({text, onClick}) {
  return (
    <button onClick={onClick} className={"py-1 px-4 rounded-lg bg-[#121212] hover:bg-[#222222] hover:cursor-pointer"}
            style={{boxShadow: "0px 0px 5px 0px #121212"}}>
        <div className={"text-gray-200"}>{text}</div>
    </button>
  )
}

export default Button;