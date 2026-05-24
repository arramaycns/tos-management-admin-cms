import styles from '../styles/SideNavigation.module.sass';
import unclogo from '../assets/unclogo.png';
import { Calendar, Book, Layers, Users, LogOut } from 'react-feather';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const items = [
    { label: 'Academic Periods', path: '/admin/academic-periods', icon: Calendar },
    { label: 'Course Catalog', path: '/admin/courses', icon: Book },
    { label: 'CO/ILO Templates', path: '/admin/templates', icon: Layers },
    { label: 'Course Assignments', path: '/admin/assignments', icon: Users },
];

export default function AdminSidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    return (
        <div className={styles.container}>
            <div className={styles.logo}>
                <img src={unclogo} alt="" />
            </div>
            <div className={styles['nav-list']}>
                {items.map(item => {
                    const Icon = item.icon;
                    const selected = location.pathname.startsWith(item.path);
                    return (
                        <div key={item.path} onClick={() => navigate(item.path)} className={`${styles.list} ${selected ? styles.selected : ''}`}>
                            <Icon size={24} /> {item.label}
                        </div>
                    );
                })}
                <div className={styles.listB} onClick={handleLogout}>
                    <LogOut size={24} color={'#F94545'} /> Log Out
                </div>
            </div>
        </div>
    );
}
