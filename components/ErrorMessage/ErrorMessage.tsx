import css from "./ErrorMessage.module.css";

interface ErrorMessageProps {
  message?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <div className={css.error}>{message || "Сталася помилка"}</div>
);

export default ErrorMessage; 