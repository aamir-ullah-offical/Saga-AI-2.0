import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/authLogin" replace />;
};

export default PrivateRoute;
