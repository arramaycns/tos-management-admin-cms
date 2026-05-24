import styles from '../styles/ConfirmModal.module.sass';

export default function ConfirmModal({ open, title, message, confirmLabel, cancelLabel, variant, onConfirm, onCancel }) {
    if (!open) return null;
    return (
        <div className={styles.overlay} onClick={onCancel}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <h3>{title}</h3>
                <p>{message}</p>
                <div className={styles.actions}>
                    <button className={`${styles.btn} ${styles.confirm} ${variant === 'danger' ? styles.danger : ''}`} onClick={onConfirm}>
                        {confirmLabel || 'Confirm'}
                    </button>
                    <button className={`${styles.btn} ${styles.cancel}`} onClick={onCancel}>
                        {cancelLabel || 'Cancel'}
                    </button>
                </div>
            </div>
        </div>
    );
}
