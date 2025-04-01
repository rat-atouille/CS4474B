import React, { createContext, useContext, useState } from "react";

const AlbumContext = createContext();

export const useAlbum = () => {
  return useContext(AlbumContext);
};

export const AlbumProvider = ({ children }) => {
  const [currentAlbum, setCurrentAlbum] = useState(null);

  return (
    <AlbumContext.Provider value={[currentAlbum, setCurrentAlbum]}>
      {children}
    </AlbumContext.Provider>
  );
};
