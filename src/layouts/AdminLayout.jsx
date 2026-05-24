import Skeleton from './Skeleton.jsx';
import Header from '../components/Header.jsx';
import AdminSidebar from '../components/AdminSidebar.jsx';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout({ children, title }) {
    const { user } = useAuth();
    return (
        <Skeleton
            header={<Header role="Administrator" name={user?.name || 'Administrator'} />}
            content={children}
            nav={<AdminSidebar />}
        />
    );
}
