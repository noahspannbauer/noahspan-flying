import { Navigate, Route, Routes } from 'react-router-dom';
import Flights from './components/flights/Flights';
import Logbook from './components/logbook/Logbook';
import Pilots from './components/pilots/Pilots';
import SiteNav from './components/siteNav/SiteNav';
import { useAuth } from 'react-oidc-context';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const App = () => {
  const auth = useAuth();

  const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    return auth.isAuthenticated ? children : <Navigate to='/' />
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