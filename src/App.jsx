import {Routes, Route, BrowserRouter} from 'react-router-dom';
import './App.css';
import PodcastPage from "./pages/Podcast Page/PodcastPage.jsx";
import HomePage from './pages/homePage';
import Artist from './pages/Artist.jsx';
import Browse from './pages/Browse.jsx';
import Album from './pages/Album.jsx';
import GenrePage from './pages/GenrePage.jsx';
import SearchPage from "./pages/SearchPage.jsx";
import Layout from "./components/layout/Layout.jsx";
import {useState} from "react";

function App() { // Make sure to accept the prop
  const [musicQueue, setMusicQueue] = useState();
  const [currentSong, setCurrentSong] = useState();

  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={
          <Layout currentSongIndex={currentSong} setCurrentSongIndex={setCurrentSong} musicQueue={musicQueue} setMusicQueue={setMusicQueue}/>}>
          <Route index element={<HomePage currentSong={currentSong} setMusicQueue={setMusicQueue} musicQueue={musicQueue}/>}/>
          <Route path={"/search"} element={<SearchPage currentSong={currentSong} setMusicQueue={setMusicQueue} musicQueue={musicQueue}/>}/>
          <Route path={"/artist"} element={<Artist currentSong={currentSong} setMusicQueue={setMusicQueue} musicQueue={musicQueue}/>}/>
          <Route path={"/podcast"} element={<PodcastPage currentSong={currentSong} setMusicQueue={setMusicQueue} musicQueue={musicQueue}/>}/>
          <Route path={"/browse"} element={<Browse currentSong={currentSong} setMusicQueue={setMusicQueue} musicQueue={musicQueue}/>}/>
          <Route path={"/genre/:genre"} element={<GenrePage currentSong={currentSong} setMusicQueue={setMusicQueue} musicQueue={musicQueue}/>}/>
          <Route path={"/album"} element={<Album currentSong={currentSong} setMusicQueue={setMusicQueue} musicQueue={musicQueue}/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
