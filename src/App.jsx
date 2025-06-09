import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Contact from './components/Contact';
import './App.css'
import { Routes, Route } from "react-router-dom";
import About from './pages/About';
import Services from './pages/Services';
import Home from './pages/Home';
import SetApt from './pages/SetApt';



function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route index element={<Hero />} />
          <Route path="contact" element={<Contact />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="home" element={<Home />} />
          <Route path="setapt" element={<SetApt />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
