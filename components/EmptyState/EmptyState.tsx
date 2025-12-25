import css from "./EmptyState.module.css";

interface EmptyStateProps {
  message?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message }) => (
  <div className={css.empty}>{message || "Нотаток не знайдено"}</div>
);

export default EmptyState; 