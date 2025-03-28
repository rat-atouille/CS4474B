import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css'
import PodcastPage from "./pages/Podcast Page/PodcastPage.jsx";
import HomePage from './pages/homePage';
import Artist from './pages/Artist.jsx';
import Browse from './pages/Browse.jsx';

// make sure to route urs here 
// <Route path="/pathName" element={<componentName />} />
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<HomePage />}/>
        <Route path={"/artist"} element={<Artist />} />
        <Route path={"/podcast"} element={<PodcastPage/>}></Route>
        <Route path={"/browse"} element={<Browse />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
