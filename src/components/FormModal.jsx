import styles from '../styles/AdminPage.module.sass';

export default function FormModal({ open, onClose, title, children }) {
    if (!open) return null;
    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.formModal} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h3>{title}</h3>
                    <button className={styles.modalClose} onClick={onClose}>×</button>
                </div>
                {children}
            </div>
        </div>
    );
}
