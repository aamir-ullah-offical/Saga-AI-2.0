import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login'; // ✅ Make sure file name is Login.jsx

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} /> {/* ✅ PascalCase */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AuthRoutes;
