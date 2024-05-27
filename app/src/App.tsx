import { Route, Routes } from 'react-router-dom';
import Logbook from './components/logbook/Logbook';
import Pilots from './components/pilots/Pilots';

const App: React.FC<unknown> = () => {
  return (
    <Routes>
      <Route path="logbook" element={<Logbook />} />
      <Route path="pilots" element={<Pilots />} />
    </Routes>
  );
};

export default App;
