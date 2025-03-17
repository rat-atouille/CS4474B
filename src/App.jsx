import { BrowserRouter, Routes, Route } from 'react-router'
import './App.css'
import Artist from './components/Artist/Artist'


// make sure to route urs here 
// <Routepath="/pathName" element={<className />} />
function App() {
    return (
      <>
      <BrowserRouter>
        <Routes>
          <Route path='/artist' element={<Artist /> } />
        </Routes>
      </BrowserRouter>
      </>
    )
}

export default App
