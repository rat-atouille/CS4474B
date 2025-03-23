import {BrowserRouter, Route, Routes} from 'react-router'
import './App.css'
import Podcast from "./components/layout/Podcast Page/Podcast.jsx";
import HomePage from './pages/homePage';

// make sure to route urs here 
// <Route path="/pathName" element={<className />} />
function App() {
    return (
      <BrowserRouter>
          <Routes>
              <Route path={"/podcast"} element={<Podcast/>}></Route>
          </Routes>
      </BrowserRouter>
    )
}

export default App
