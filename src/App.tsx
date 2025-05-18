import "./App.css"
import "./components/styles/custom-scrollbar.css"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import SignupPanel from "./pages/landing"
import GamePage from "./pages/game/index"
import HunterId from "./pages/HunterId"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignupPanel />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/hunterid" element={<HunterId />} />
      </Routes>
    </Router>
  )
}

export default App
