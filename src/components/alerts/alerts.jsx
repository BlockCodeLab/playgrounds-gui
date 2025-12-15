import { Alert } from './alert';
import styles from './alerts.module.css';

export function Alerts({ items }) {
  return (
    <div className={styles.alertsWrapper}>
      {items.map(({ id, mode, icon, message, button, onClose, ...options }) => (
        <Alert
          key={id}
          mode={mode ?? 'success'}
          icon={icon}
          message={message}
          options={options}
          button={button}
          onClose={onClose}
        />
      ))}
    </div>
  );
}
