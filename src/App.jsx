import './App.css'
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import {AuthProvider} from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from "./pages/LoginPage.jsx";
import AssignedTOS from "./pages/AssignedTOS.jsx";
import TOS from "./pages/TOS.jsx";
import AdminLayout from './layouts/AdminLayout.jsx';
import AdminAcademicPeriods from './pages/AdminAcademicPeriods.jsx';
import AdminCourses from './pages/AdminCourses.jsx';
import AdminTemplates from './pages/AdminTemplates.jsx';
import AdminAssignments from './pages/AdminAssignments.jsx';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="appPage">
                    <Routes>
                        <Route path={'/login'} element={<LoginPage />} />
                        <Route path={'/admin'} element={<ProtectedRoute role="admin"><AdminLayout><Navigate to="/admin/academic-periods" replace /></AdminLayout></ProtectedRoute>} />
                        <Route path={'/admin/academic-periods'} element={<ProtectedRoute role="admin"><AdminLayout><AdminAcademicPeriods /></AdminLayout></ProtectedRoute>} />
                        <Route path={'/admin/courses'} element={<ProtectedRoute role="admin"><AdminLayout><AdminCourses /></AdminLayout></ProtectedRoute>} />
                        <Route path={'/admin/templates'} element={<ProtectedRoute role="admin"><AdminLayout><AdminTemplates /></AdminLayout></ProtectedRoute>} />
                        <Route path={'/admin/assignments'} element={<ProtectedRoute role="admin"><AdminLayout><AdminAssignments /></AdminLayout></ProtectedRoute>} />
                        <Route path={'/assignedtos'} element={<ProtectedRoute role="instructor"><AssignedTOS /></ProtectedRoute>} />
                        <Route path={'/tos/:code'} element={<ProtectedRoute role="instructor"><TOS /></ProtectedRoute>} />
                        <Route path={'*'} element={<Navigate to="/login" replace />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    )
}

export default App
