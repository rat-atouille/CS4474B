import { Routes, Route } from 'react-router-dom';
import './App.css';
import PodcastPage from "./pages/Podcast Page/PodcastPage.jsx";
import HomePage from './pages/homePage';
import Artist from './pages/Artist.jsx';
import Browse from './pages/Browse.jsx';
import Album from './pages/Album.jsx';
import GenrePage from './pages/GenrePage.jsx';
import SearchPage from "./pages/SearchPage.jsx";

function App({ musicQueue, setMusicQueue }) { // Make sure to accept the prop

  return (
    <Routes>
      <Route path={"/"} element={<HomePage setMusicQueue={setMusicQueue} musicQueue={musicQueue} />} />
      <Route path={"/search"} element={<SearchPage setMusicQueue={setMusicQueue} musicQueue={musicQueue} />} />
      <Route path={"/artist"} element={<Artist setMusicQueue={setMusicQueue} musicQueue={musicQueue} />} />
      <Route path={"/podcast"} element={<PodcastPage setMusicQueue={setMusicQueue} musicQueue={musicQueue} />} />
      <Route path={"/browse"} element={<Browse setMusicQueue={setMusicQueue} musicQueue={musicQueue} />} />
      <Route path={"/genre/:genre"} element={<GenrePage setMusicQueue={setMusicQueue} musicQueue={musicQueue} />} />
      <Route path={"/album"} element={<Album setMusicQueue={setMusicQueue} musicQueue={musicQueue} />} />
    </Routes>
  );
}

export default App;
