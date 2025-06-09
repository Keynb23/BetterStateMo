import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Contact from './components/Contact';
import ChatWithUs from './components/ChatWithUs';
import RequestQuote from './components/RequestQuote';
import './App.css'
import { Routes, Route } from "react-router-dom";


function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route index element={<Hero />} />
          <Route path="contact" element={<Contact />} />
          <Route path="chat" element={<ChatWithUs />} />
          <Route path="requestquote" element={<RequestQuote />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
