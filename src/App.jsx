import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import HomePage from './pages/homePage';

// make sure to route urs here 
// <Routepath="/pathName" element={<className />} />
function App() {
    return (
      <>
      <BrowserRouter>
        <Routes>
        </Routes>
      </BrowserRouter>
      </>
    )
}

export default App
