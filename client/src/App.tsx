import { Route, Routes } from 'react-router-dom';
import Flights from './components/flights/Flights';
import Logbook from './components/logbook/Logbook';
import Checklists from './components/checklists/Checklists';
import Pilots from './components/pilots/Pilots';


const App: React.FC<unknown> = () => {
  return (
    <Routes>
      <Route path='/' element={<Flights />} />
      <Route path='logbook' element={<Logbook />} />
      <Route path='checklists' element={<Checklists />} />
      <Route path='pilots' element={<Pilots />} />
    </Routes>
  );
}

export default App;
