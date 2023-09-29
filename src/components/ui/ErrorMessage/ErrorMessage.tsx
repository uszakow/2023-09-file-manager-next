import { HTMLAttributes } from "react";
import styles from './ErrorMessage.module.scss';

interface ErrorMessageProps extends HTMLAttributes<HTMLDivElement> { }

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ children, ...props }) => {
  return (
    <div className={styles['error-message']} {...props}>
      {children}
    </div>
  );
};