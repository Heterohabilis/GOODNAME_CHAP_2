import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  // useParams,
} from 'react-router-dom';

import './App.css';

import Navbar from './Components/Navbar';
import People from './Components/People';
import Manuscripts from './Components/Manuscript';
import Texts from './Components/Texts'
import About from './Components/About'
import PersonPage from './Components/PersonPage';
import Masthead from "./Components/Masthead";
import Home from "./Components/Home";


// function PersonPage() {
//   const { name } = useParams();
//   return <h1>{name}</h1>
// }


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* For a different home page, do:
         <Route index element={<Login />} /> */}
        <Route path="/" element={<Home />} />
        <Route path="people" element={<People />} />
        <Route path="people/:email" element={<PersonPage />} />
        <Route path="masthead" element={<Masthead />} />
        <Route path="manuscripts" element={<Manuscripts />} />
        <Route path="texts" element={<Texts />} />
        <Route path="about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

