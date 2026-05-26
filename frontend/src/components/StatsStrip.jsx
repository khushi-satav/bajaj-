import { useTickets } from '../hooks/useTickets';

/**
 * StatsStrip Component
 * Displays dashboard statistics in a horizontal card strip.
 * Shows counts for each status and currently breached tickets.
 */
export default function StatsStrip() {
  const { stats, loading } = useTickets();

  if (loading.tickets && !stats) {
    return (
      <div className="stats-strip">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="stat-card" style={{ opacity: 0.5 }}>
            <div className="stat-card__value">—</div>
            <div className="stat-card__label">Loading...</div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const items = [
    { key: 'open', label: 'Open', value: stats.statusCounts.open },
    { key: 'in_progress', label: 'In Progress', value: stats.statusCounts.in_progress },
    { key: 'resolved', label: 'Resolved', value: stats.statusCounts.resolved },
    { key: 'closed', label: 'Closed', value: stats.statusCounts.closed },
    { key: 'breached', label: 'SLA Breached', value: stats.currentlyBreached },
  ];

  return (
    <section className="stats-strip" aria-label="Ticket Statistics">
      {items.map((item) => (
        <div
          key={item.key}
          className={`stat-card stat-card--${item.key}`}
          id={`stat-${item.key}`}
        >
          <div className="stat-card__value">{item.value}</div>
          <div className="stat-card__label">{item.label}</div>
        </div>
      ))}
    </section>
  );
}
