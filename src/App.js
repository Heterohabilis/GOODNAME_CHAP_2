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

const homeHeader = "Journal of React";
function Home() {
  
  const styles = {
    'text-align': 'center',
  }
  return <h1 style={styles} >{homeHeader}</h1>
}

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
         <Route index element={<Home />} />
        <Route path="people" element={<People />} />
        <Route path="people/:email" element={<PersonPage />} />
        <Route path="manuscripts" element={<Manuscripts />} />
        <Route path="texts" element={<Texts />} />
        <Route path="about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

export {
  homeHeader,
}
