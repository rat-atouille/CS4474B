import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css'
import Podcast from "./components/layout/Podcast Page/Podcast.jsx";
import HomePage from './pages/homePage';
import Artist from './components/Artist/Artist';

// make sure to route urs here 
// <Route path="/pathName" element={<componentName />} />
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<HomePage />}/>
        <Route path={"/artist"} element={<Artist />} />
        <Route path={"/podcast"} element={<Podcast/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
