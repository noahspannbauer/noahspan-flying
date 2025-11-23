import { Navigate, Route, Routes } from 'react-router-dom';
import Flights from './components/flights/Flights';
import Logbook from './components/logbook/Logbook';
import Pilots from './components/pilots/Pilots';
import SiteNav from './components/siteNav/SiteNav';
import { HeroUIProvider } from '@heroui/react';
import { useHref, useNavigate } from 'react-router-dom';
import './styles.css';

const App = () => {
  const navigate = useNavigate();

  return (
    <HeroUIProvider navigate={navigate} useHref={useHref}>
      <SiteNav />
      <Routes>
        <Route path='/' element={<Flights />} />
        <Route path="/logbook" element={<Logbook />} />
        <Route path="/pilots" element={<Pilots />} />
      </Routes>
    </HeroUIProvider>
  );
};

export default App;