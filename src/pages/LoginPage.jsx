import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/LoginPage.module.sass';
import unclogo from '../assets/unclogo.png';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username.trim() || !password.trim()) {
            setError('Please enter your username and password');
            return;
        }
        setBusy(true);
        setError('');
        try {
            const user = await login(username, password);
            navigate(user.role === 'admin' ? '/admin' : '/assignedtos', { replace: true });
        } catch (err) {
            setError(err.message === 'Login failed' ? 'Unable to connect. Please try again.' : 'Invalid username or password');
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <div className={styles.logoSection}>
                    <img src={unclogo} alt="UNC Logo" />
                    <h2>UNC LPMS</h2>
                    <p>Learning Plan Management System</p>
                </div>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <h3>Sign In</h3>
                    {error && <div className={styles.error}>{error}</div>}
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        autoFocus
                    />
                    <input
                        className={styles.input}
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <button className={styles.btn} type="submit" disabled={busy}>
                        {busy ? 'Signing in...' : 'Sign In'}
                    </button>
                    <div className={styles.forgotRow}>
                        <a href="/forgot-password" className={styles.forgotLink} onClick={e => { e.preventDefault(); alert('Please contact your system administrator to reset your password.'); }}>
                            Forgot Password?
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}
