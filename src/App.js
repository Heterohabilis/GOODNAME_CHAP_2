import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';

import People from './Components/People';
import Manuscripts from './Components/Manuscript';
import About from './Components/About';
import PersonPage from './Components/PersonPage';
import Masthead from './Components/Masthead';
import Home from './Components/Home';
import Login from './Components/Login';

function App() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleNavToggle = (open) => {
    setIsNavOpen(open);
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        <header className="top-bar">
          <div 
            className="nav-toggle-icon" 
            onMouseEnter={() => handleNavToggle(true)}
            onClick={() => handleNavToggle(!isNavOpen)}
          >
            &#9776;
          </div>
          <h1 className="site-title">GOODNAME JOURNAL</h1>
        </header>

        <nav 
          className={`side-navbar ${isNavOpen ? 'open' : ''}`}
          onMouseLeave={() => handleNavToggle(false)}
        >
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/people">People</Link></li>
            <li><Link to="/manuscripts">Manuscripts</Link></li>
            <li><Link to="/masthead">Masthead</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="people" element={<People />} />
            <Route path="people/:email" element={<PersonPage />} />
            <Route path="masthead" element={<Masthead />} />
            <Route path="manuscripts" element={<Manuscripts />} />
            <Route path="about" element={<About />} />
            <Route path="login" element={<Login />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
