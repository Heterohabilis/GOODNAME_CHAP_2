import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useParams,
} from 'react-router-dom';

import './App.css';

import Navbar from './Components/Navbar';
import People from './Components/People';
import Manuscripts from './Components/Manuscript';

const homeHeader = "Journal of React";
function Home() {
  
  const styles = {
    'text-align': 'center',
  }
  return <h1 style={styles} >{homeHeader}</h1>
}

function PersonPage() {
  const { name } = useParams();
  return <h1>{name}</h1>
}


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* For a different home page, do:
         <Route index element={<Login />} /> */}
         <Route index element={<Home />} />
        <Route path="people" element={<People />} />
        <Route path="people/:name" element={<PersonPage />} />
        <Route path="manuscripts" element={<Manuscripts />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

export {
  homeHeader,
}
