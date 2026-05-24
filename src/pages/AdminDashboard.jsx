import Skeleton from '../layouts/Skeleton.jsx';
import Header from '../components/Header.jsx';
import AdminSidebar from '../components/AdminSidebar.jsx';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
    const { user } = useAuth();
    return (
        <Skeleton
            header={<Header role="Administrator" name={user?.name || 'Admin'} />}
            content={<div style={{ padding: '30px', background: 'white', height: '100%' }}><h2>Admin Dashboard</h2><p>Select a menu item from the sidebar to manage the system.</p></div>}
            nav={<AdminSidebar />}
        />
    );
}
