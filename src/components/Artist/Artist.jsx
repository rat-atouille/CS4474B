import React, { useState } from "react";

const Container = () => {
  return(
    <div>
      songs...
    </div>
  )
}

const Artist = () => {
  const category = ["All", "Discography"]
  const [currTab, setCurrTab] = useState("All");

  return (
    <div className="w-full h-full bg-green-100">
      <div>
        <div>verified aritst</div>
        <div>
          Name
        </div>
        <div>
          how many ....
        </div>
      </div>
      <div>
        <div>
          artist info
        </div>
        <div>
          All
        </div>
        <div>
          Songs
        </div>
        <div>
          Albums
        </div>
      </div>
      <div>
        <Container />
      </div>
    </div>
  )
}

export default Artist;