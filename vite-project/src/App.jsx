import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import HowTo from './pages/HowTo'
import Game from './pages/Game'

function App() {
  return (
    <div>
      <NavBar/>
      <Routes>
        <Route path="/" element={<Game />} />
        <Route path="/how-to-play" element={<HowTo />} />
      </Routes>
    </div>
  )
}

export default App
