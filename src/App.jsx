// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import DashboardLayout from './components/DashboardLayout';
import { UserProvider } from './context/UserContext';

function App() {
    return (
        <Router>
            <AuthProvider>
                <UserProvider>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/dashboard/*"
                            element={
                                <ProtectedRoute>
                                    <DashboardLayout />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                </UserProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;