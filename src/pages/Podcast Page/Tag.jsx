function Tag({tag}) {
  return (
    <div className={"py-0.5 px-4 rounded-lg bg-[#121212]"} style={{boxShadow: "0px 0px 5px 0px #121212"}}>
      <div className={"text-sm text-gray-400"}>{tag}</div>
    </div>
  )
}

export default Tag;