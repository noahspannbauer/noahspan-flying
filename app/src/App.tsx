import { Navigate, Route, Routes } from 'react-router-dom';
import Pilots from './components/pilots/Pilots';
import Logbook from './components/logbook/Logbook';
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
        <Route path="/pilots" element={<Pilots />} />
        <Route path="/" element={<Logbook />} />
      </Routes>
    </>
  );
};

export default App;