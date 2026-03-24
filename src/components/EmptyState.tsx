import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title: string;
  message: string;
  actionHref?: string;
  actionLabel?: string;
}

export const EmptyState = ({ title, message, actionHref, actionLabel }: EmptyStateProps) => (
  <section className="empty-state card">
    <h3>{title}</h3>
    <p>{message}</p>
    {actionHref && actionLabel ? (
      <Link className="button" to={actionHref}>
        {actionLabel}
      </Link>
    ) : null}
  </section>
);
