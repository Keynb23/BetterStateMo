import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';  
import Contact from './components/Contact.jsx';  
import About from './pages/About.jsx';  
import Services from './pages/Services.jsx';  
import Home from './pages/Home.jsx';  
import SetApt from './pages/SetApt.jsx';  
import LoginReg from './context/login-Reg.jsx';  
import Profile from './pages/profile.jsx';     
import './App.css'; 


function App() {
  useLocation(); 

  return (
    <>
      <Navbar />

      <Routes>
        {/* Scrollable homepage route */}
        <Route
          path="/"
          element={
            <>
              <section id="home"><Home /></section>
              <section id="services"><Services /></section>
              <section id="about"><About /></section>
              <section id="contact"><Contact /></section>
            </>
          }
        />

        {/* Standalone pages */}
        <Route path="/setapt" element={<SetApt />} />
        <Route path="/login" element={<LoginReg />} /> 
        <Route path="/profile" element={<Profile />} /> 
      </Routes>
    </>
  );
}

export default App;
