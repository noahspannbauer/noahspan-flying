import { Navigate, Route, Routes } from 'react-router-dom';
import Flights from './components/flights/Flights';
import Logbook from './components/logbook/Logbook';
import Pilots from './components/pilots/Pilots';
import SiteNav from './components/siteNav/SiteNav';
import { useIsAuthenticated } from '@azure/msal-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const App = () => {
  const isAuthenticated = useIsAuthenticated()

  const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    return isAuthenticated ? children : <Navigate to='/' />
  }

  return (
    <>
      <SiteNav />
      <Routes>
        <Route path='/' element={<Flights />} />
        <Route path="/logbook" element={<Logbook />} />
        <Route path="/pilots" element={<Pilots />} />
        
      </Routes>
    </>
  );
};

export default App;