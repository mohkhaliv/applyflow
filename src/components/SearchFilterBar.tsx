import { Search } from 'lucide-react';
import { STATUSES, type Filters } from '../types';
export function SearchFilterBar({
  filters,
  onChange,
  board = false,
}: {
  filters: Filters;
  onChange: (v: Filters) => void;
  board?: boolean;
}) {
  return (
    <div className="filter-bar">
      <label className="search-input">
        <Search size={17} />
        <input
          aria-label="Search applications"
          placeholder="Search company, role, or location…"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
        />
      </label>
      <select
        aria-label="Filter by status"
        value={filters.status}
        onChange={(e) => onChange({ ...filters, status: e.target.value })}
      >
        <option value="all">All statuses</option>
        {STATUSES.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>
      {!board && (
        <select
          aria-label="Sort applications"
          value={filters.sort}
          onChange={(e) =>
            onChange({ ...filters, sort: e.target.value as Filters['sort'] })
          }
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="company">Company A–Z</option>
        </select>
      )}
      {(filters.search || filters.status !== 'all') && (
        <button
          onClick={() => onChange({ ...filters, search: '', status: 'all' })}
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
