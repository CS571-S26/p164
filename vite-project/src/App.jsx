import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import NavBar from './components/NavBar'
import HowTo from './pages/HowTo'
import Game from './pages/Game'
import Stats from './pages/Stats'
import Options from './pages/Options'
function App() {
  return (
    <div>
      <NavBar/>
      <Routes>
        <Route path="/" element={<Game/>} />
        <Route path="/how-to-play" element={<HowTo />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/options" element={<Options />} />
      </Routes>
    </div>
  )
}

export default App
