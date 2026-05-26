import { useTickets } from '../hooks/useTickets';

/**
 * FilterBar Component
 * Provides priority dropdown and breached-only checkbox filters.
 * Filters are combinable and update the global ticket state.
 */
export default function FilterBar() {
  const { filters, setFilters } = useTickets();

  const handlePriorityChange = (e) => {
    setFilters((prev) => ({ ...prev, priority: e.target.value }));
  };

  const handleBreachedChange = () => {
    setFilters((prev) => ({ ...prev, breached: !prev.breached }));
  };

  return (
    <div className="filter-bar" id="filter-bar">
      <div className="filter-bar__group">
        <label className="filter-bar__label" htmlFor="priority-filter">
          Priority:
        </label>
        <select
          id="priority-filter"
          className="filter-bar__select"
          value={filters.priority}
          onChange={handlePriorityChange}
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      <label
        className={`filter-bar__checkbox-label ${
          filters.breached ? 'filter-bar__checkbox-label--active' : ''
        }`}
        htmlFor="breached-filter"
      >
        <input
          type="checkbox"
          id="breached-filter"
          className="filter-bar__checkbox"
          checked={filters.breached}
          onChange={handleBreachedChange}
        />
        <span className="filter-bar__checkbox-icon" />
        SLA Breached Only
      </label>
    </div>
  );
}
