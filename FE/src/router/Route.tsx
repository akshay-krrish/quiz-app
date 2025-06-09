import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
import Login from '../pages/login/Login';
import { EPath } from '@/constants/pathConstants';
import { getToken } from '@/utils/authUtils';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isLoggedIn = getToken('accessToken') !== null;
  return isLoggedIn ? <>{children}</> : <Navigate to={EPath.login} replace />;
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path={EPath.home}
          element={
            <PrivateRoute>
              <div>Home</div>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
