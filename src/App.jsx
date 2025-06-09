// App.jsx
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Contact from './components/Contact'
import About from './pages/About'
import Services from './pages/Services'
import Home from './pages/Home'
import SetApt from './pages/SetApt'
import './App.css'

function App() {
  useLocation()

  return (
    <>
      {/* Always render navbar */}
      <Navbar />

      <Routes>
        {/* Scrollable homepage */}
        <Route
          path="/"
          element={
            <>
              <section id="home"><Home /></section>
              <section id="about"><About /></section>
              <section id="services"><Services /></section>
              <section id="contact"><Contact /></section>
            </>
          }
        />

        {/* Standalone page */}
        <Route path="/setapt" element={<SetApt />} />
      </Routes>
    </>
  )
}

export default App
