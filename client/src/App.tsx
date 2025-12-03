import { Route, Routes } from 'react-router-dom';
import Flights from './components/flights/Flights';
import Logbook from './components/logbook/Logbook';
import Pilots from './components/pilots/Pilots';
import SiteNav from './components/siteNav/SiteNav';
import { useNavigate } from 'react-router-dom';

const App = () => {
  const navigate = useNavigate();

  return (
    <div className='bg-[#f5f5f5]' data-theme="lofi">
      <SiteNav />
      <Routes>
        <Route path='/' element={<Flights />} />
        <Route path="/logbook" element={<Logbook />} />
        <Route path="/pilots" element={<Pilots />} />
      </Routes>
    </div>
  );
};

export default App;