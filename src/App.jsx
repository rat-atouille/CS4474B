import { Routes, Route } from 'react-router-dom';
import './App.css';
import PodcastPage from "./pages/Podcast Page/PodcastPage.jsx";
import HomePage from './pages/homePage';
import Artist from './pages/Artist.jsx';
import Browse from './pages/Browse.jsx';
import Album from './pages/Album.jsx';
import GenrePage from './pages/GenrePage.jsx';
import SearchPage from "./pages/SearchPage.jsx";
import { useEffect } from 'react';

function App({ setMusicQueue }) { // Make sure to accept the prop

  return (
    <Routes>
      <Route path={"/"} element={<HomePage setMusicQueue={setMusicQueue} />} />
      <Route path={"/search"} element={<SearchPage setMusicQueue={setMusicQueue} />} />
      <Route path={"/artist"} element={<Artist setMusicQueue={setMusicQueue} />} />
      <Route path={"/podcast"} element={<PodcastPage setMusicQueue={setMusicQueue} />} />
      <Route path={"/browse"} element={<Browse setMusicQueue={setMusicQueue} />} />
      <Route path={"/genre/:genre"} element={<GenrePage setMusicQueue={setMusicQueue} />} />
      <Route path={"/album"} element={<Album setMusicQueue={setMusicQueue} />} />
    </Routes>
  );
}

export default App;
